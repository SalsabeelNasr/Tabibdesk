export type PatientStatus = "inactive" | "active" | "lost"

export interface Patient {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string | null
  age: number | null
  gender: string
  phone: string
  email: string | null
  complaint: string | null
  job: string | null
  doctor_id: string | null
  status: PatientStatus
  first_visit_at: string | null
  last_visit_at: string | null
  created_at: string
  updated_at: string
}

export interface PatientListItem extends Patient {
  lastAppointmentDate: string | null
}

export interface ListPatientsParams {
  clinicId?: string
  page: number
  pageSize: number
  query?: string
  status?: PatientStatus
}

export interface ListPatientsResponse {
  patients: PatientListItem[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface CreatePatientInput {
  first_name: string
  last_name: string
  phone: string
  email?: string
  gender?: string
  source?: string
  source_other?: string
  address?: string
}
