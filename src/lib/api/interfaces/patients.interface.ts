/**
 * Patients repository interface.
 * Implemented by mock (in-memory) and Supabase implementations.
 */

import type { Patient } from "@/features/patients/patients.types"

/** Patient row for repository layer - app Patient with clinic_id for multi-tenant filtering */
export type PatientRow = Patient & { clinic_id: string }

/** Minimal fields required to create a patient */
export type PatientInsert = Pick<
  PatientRow,
  | "first_name"
  | "last_name"
  | "phone"
  | "clinic_id"
> & {
  email?: string | null
  gender?: string | null
  date_of_birth?: string | null
  address?: string | null
  age?: number | null
  height?: number | null
  complaint?: string | null
  job?: string | null
  social_status?: string | null
  source?: string | null
  status?: Patient["status"]
  doctor_id?: string | null
}

export type PatientUpdate = Partial<Omit<PatientRow, "id" | "created_at">>

export interface IPatientsRepository {
  getPatients(clinicId: string): Promise<PatientRow[]>
  getPatient(id: string, clinicId: string): Promise<PatientRow>
  getById(patientId: string): Promise<PatientRow | null>
  createPatient(patient: PatientInsert): Promise<PatientRow>
  updatePatient(id: string, clinicId: string, updates: PatientUpdate): Promise<PatientRow>
  deletePatient(id: string, clinicId: string): Promise<void>
  searchPatients(clinicId: string, query: string): Promise<PatientRow[]>
}
