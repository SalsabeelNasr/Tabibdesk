/**
 * Mock appointments repository - in-memory store, no direct mockData mutations.
 */

import { mockData } from "@/data/mock/mock-data"
import { DEMO_CLINIC_ID } from "@/lib/constants"
import type {
  IAppointmentsRepository,
  AppointmentRow,
  AppointmentInsert,
  AppointmentUpdate,
} from "../../interfaces/appointments.interface"
import { NotFoundError } from "../../errors"

let appointmentsStore: AppointmentRow[] = []
let initialized = false

function initStore() {
  if (!initialized) {
    appointmentsStore = mockData.appointments.map((apt) => ({
      id: apt.id,
      clinic_id: apt.clinic_id ?? DEMO_CLINIC_ID,
      patient_id: apt.patient_id,
      scheduled_at: apt.scheduled_at,
      status: apt.status,
      notes: apt.notes,
      created_at: apt.created_at,
      updated_at: apt.created_at,
      deleted_at: null,
      doctor_id: apt.doctor_id,
      type: apt.type,
      patient_name: apt.patient_name,
    }))
    initialized = true
  }
}

function generateId(): string {
  return `apt-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export class MockAppointmentsRepository implements IAppointmentsRepository {
  async getAppointments(clinicId: string): Promise<AppointmentRow[]> {
    initStore()
    return appointmentsStore.filter(
      (a) => a.clinic_id === clinicId && !a.deleted_at
    )
  }

  async getAppointment(id: string, clinicId: string): Promise<AppointmentRow> {
    initStore()
    const apt = appointmentsStore.find(
      (a) => a.id === id && a.clinic_id === clinicId && !a.deleted_at
    )
    if (!apt) throw new NotFoundError("Appointment", id)
    return apt
  }

  async getById(id: string): Promise<AppointmentRow | null> {
    initStore()
    return appointmentsStore.find((a) => a.id === id && !a.deleted_at) ?? null
  }

  async createAppointment(insert: AppointmentInsert): Promise<AppointmentRow> {
    initStore()
    const now = new Date().toISOString()
    const appointment: AppointmentRow = {
      id: insert.id ?? generateId(),
      clinic_id: insert.clinic_id,
      patient_id: insert.patient_id,
      scheduled_at: insert.scheduled_at,
      status: insert.status ?? "scheduled",
      notes: insert.notes ?? null,
      created_at: insert.created_at ?? now,
      updated_at: now,
      deleted_at: null,
      doctor_id: insert.doctor_id ?? null,
      type: insert.type,
      patient_name: insert.patient_name,
    }
    appointmentsStore.push(appointment)
    return appointment
  }

  async updateAppointment(
    id: string,
    updates: AppointmentUpdate
  ): Promise<AppointmentRow> {
    initStore()
    const index = appointmentsStore.findIndex((a) => a.id === id)
    if (index === -1) throw new NotFoundError("Appointment", id)
    const updated: AppointmentRow = {
      ...appointmentsStore[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    appointmentsStore[index] = updated
    return updated
  }

  async deleteAppointment(id: string, clinicId: string): Promise<void> {
    initStore()
    const index = appointmentsStore.findIndex(
      (a) => a.id === id && a.clinic_id === clinicId
    )
    if (index === -1) throw new NotFoundError("Appointment", id)
    appointmentsStore[index] = {
      ...appointmentsStore[index],
      deleted_at: new Date().toISOString(),
    }
  }
}
