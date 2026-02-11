/**
 * Appointments repository interface.
 * Implemented by mock (in-memory) and Supabase implementations.
 */

/** Appointment row for repository - core fields for persistence and filtering */
export interface AppointmentRow {
  id: string
  clinic_id: string
  patient_id: string
  scheduled_at: string
  status: string
  notes: string | null
  created_at: string
  updated_at?: string
  deleted_at?: string | null
  /** App-specific: doctor, type, etc. - optional for compatibility */
  doctor_id?: string | null
  type?: string
  patient_name?: string
}

export type AppointmentInsert = Omit<AppointmentRow, "id" | "created_at"> & {
  id?: string
  created_at?: string
}

export type AppointmentUpdate = Partial<
  Omit<AppointmentRow, "id" | "clinic_id" | "patient_id" | "created_at">
>

export interface IAppointmentsRepository {
  getAppointments(clinicId: string): Promise<AppointmentRow[]>
  getAppointment(id: string, clinicId: string): Promise<AppointmentRow>
  getById(id: string): Promise<AppointmentRow | null>
  createAppointment(appointment: AppointmentInsert): Promise<AppointmentRow>
  updateAppointment(id: string, updates: AppointmentUpdate): Promise<AppointmentRow>
  deleteAppointment(id: string, clinicId: string): Promise<void>
}
