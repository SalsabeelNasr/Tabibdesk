/**
 * Appointments API - replaceable backend layer
 * Currently uses mock data, but structured for easy backend replacement
 */

import { mockData } from "@/data/mock/mock-data"
import { activate as activatePatient } from "./patients.api"
import { shouldActivatePatientFromAppointment } from "@/features/patients/patientLifecycle"
import type { AppointmentStatus } from "@/features/patients/patientLifecycle"

// In-memory store for appointments (demo mode only)
let appointmentsStore = [...mockData.appointments]

export interface Appointment {
  id: string
  patientId: string
  patient_id: string
  status: AppointmentStatus
  appointmentDate: string
  scheduled_at: string
  [key: string]: unknown
}

/**
 * Update appointment status
 * Automatically triggers patient activation if status is 'arrived' or 'completed'
 */
export async function updateStatus(appointmentId: string, status: AppointmentStatus): Promise<Appointment> {
  const appointment = appointmentsStore.find((apt) => apt.id === appointmentId)
  if (!appointment) {
    throw new Error("Appointment not found")
  }

  // Update appointment status
  const updated = {
    ...appointment,
    status,
    updated_at: new Date().toISOString(),
  }

  const index = appointmentsStore.findIndex((apt) => apt.id === appointmentId)
  appointmentsStore[index] = updated

  // Trigger patient activation if needed
  if (shouldActivatePatientFromAppointment(status)) {
    const activationReason = status === "arrived" ? ("arrived" as const) : ("completed" as const)
    await activatePatient(appointment.patient_id, activationReason)
  }

  // Also update mock data for consistency
  const mockIndex = mockData.appointments.findIndex((apt) => apt.id === appointmentId)
  if (mockIndex !== -1) {
    mockData.appointments[mockIndex] = updated as typeof mockData.appointments[0]
  }

  return {
    ...updated,
    patientId: appointment.patient_id,
    appointmentDate: appointment.scheduled_at,
  } as Appointment
}

/**
 * Get appointment by ID
 */
export async function getById(appointmentId: string): Promise<Appointment | null> {
  const appointment = appointmentsStore.find((apt) => apt.id === appointmentId)
  if (!appointment) return null
  
  return {
    ...appointment,
    patientId: appointment.patient_id,
    appointmentDate: appointment.scheduled_at,
  } as Appointment
}
