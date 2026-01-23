/**
 * Patient lifecycle management - pure functions
 * These functions contain the business logic for patient activation
 * and can be easily moved to backend later.
 */

import type { Patient, PatientStatus } from "./patients.types"

export type AppointmentStatus = "scheduled" | "confirmed" | "arrived" | "completed" | "no_show" | "cancelled"

/**
 * Determines if an appointment status should trigger patient activation
 */
export function shouldActivatePatientFromAppointment(status: AppointmentStatus): boolean {
  return status === "arrived" || status === "completed"
}

/**
 * Determines if a visit note should trigger patient activation
 */
export function shouldActivatePatientFromNote(note: string | null | undefined): boolean {
  return !!note && note.trim().length > 0
}

/**
 * Applies activation logic to a patient
 * Sets status to 'active', updates first_visit_at if null, and last_visit_at
 */
export function applyPatientActivation(patient: Patient, nowISO: string): Patient {
  return {
    ...patient,
    status: "active" as PatientStatus,
    first_visit_at: patient.first_visit_at || nowISO,
    last_visit_at: nowISO,
    updated_at: nowISO,
  }
}
