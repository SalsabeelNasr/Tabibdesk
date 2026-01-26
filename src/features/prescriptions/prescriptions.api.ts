import { mockData } from "@/data/mock/mock-data"
import type {
  Prescription,
  CreatePrescriptionPayload,
  PastMedication,
  CreatePastMedicationPayload,
} from "./prescriptions.types"

// Get prescriptions for a patient
export async function getPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
  // In demo mode, use mock data
  return mockData.prescriptions.filter((p) => p.patientId === patientId)
}

// Create a new prescription
export async function createPrescription(
  payload: CreatePrescriptionPayload
): Promise<Prescription> {
  const newPrescription: Prescription = {
    id: `prescription-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    clinicId: payload.clinicId,
    patientId: payload.patientId,
    doctorId: payload.doctorId,
    createdAt: new Date().toISOString(),
    visitType: payload.visitType,
    diagnosisText: payload.diagnosisText,
    notesToPatient: payload.notesToPatient,
    followUpDate: payload.followUpDate || null,
    requestedLabsText: payload.requestedLabsText,
    requestedImagingText: payload.requestedImagingText,
    items: payload.items.map((item, index) => ({
      ...item,
      id: `item-${Date.now()}-${index}`,
    })),
  }

  // Add to mock data
  mockData.prescriptions.push(newPrescription)

  return newPrescription
}

// Get past medications for a patient
export async function getPastMedicationsByPatient(patientId: string): Promise<PastMedication[]> {
  return mockData.pastMedications.filter((m) => m.patientId === patientId)
}

// Create a new past medication
export async function createPastMedication(
  payload: CreatePastMedicationPayload
): Promise<PastMedication> {
  const newMedication: PastMedication = {
    id: `past-med-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    patientId: payload.patientId,
    name: payload.name,
    duration: payload.duration,
    takenFrom: payload.takenFrom,
    takenTo: payload.takenTo || null,
    notes: payload.notes || null,
    createdAt: new Date().toISOString(),
  }

  // Add to mock data
  mockData.pastMedications.push(newMedication)

  return newMedication
}
