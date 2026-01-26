export type VisitType = "in_clinic" | "online"

export interface Prescription {
  id: string
  clinicId: string
  patientId: string
  doctorId?: string
  createdAt: string // ISO
  visitType?: VisitType

  diagnosisText: string // free text
  notesToPatient?: string // free text
  followUpDate?: string | null // ISO date
  requestedLabsText?: string // free text (one textarea)
  requestedImagingText?: string // free text (one textarea)

  items: PrescriptionItem[]
}

export interface PrescriptionItem {
  id: string
  name: string // free text + autocomplete
  strength?: string // "500mg"
  form?: string // "tabs/syrup/cream/injection"
  sig: string // instructions free text
  duration?: string // "5 days"
  notes?: string // optional
}

export interface CreatePrescriptionPayload {
  clinicId: string
  patientId: string
  doctorId?: string
  visitType?: VisitType
  diagnosisText: string
  notesToPatient?: string
  followUpDate?: string | null
  requestedLabsText?: string
  requestedImagingText?: string
  items: Omit<PrescriptionItem, "id">[]
}

export interface PastMedication {
  id: string
  patientId: string
  name: string
  duration: string // e.g., "3 months", "2 weeks"
  takenFrom: string // ISO date
  takenTo?: string | null // ISO date (null if ongoing)
  notes?: string | null
  createdAt: string
}

export interface CreatePastMedicationPayload {
  patientId: string
  name: string
  duration: string
  takenFrom: string
  takenTo?: string | null
  notes?: string
}
