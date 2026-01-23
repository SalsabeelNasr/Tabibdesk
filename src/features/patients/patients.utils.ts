import type { Patient, PatientListItem } from "./patients.types"

export function calculateAge(dateOfBirth: string | null, ageFromDb: number | null): number | "N/A" {
  if (ageFromDb !== null && ageFromDb !== undefined) {
    return ageFromDb
  }
  if (!dateOfBirth) return "N/A"
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age >= 0 ? age : "N/A"
}

// Status computation is now handled by the backend/lifecycle logic
// This function is kept for backward compatibility but should use patient.status directly
export function computePatientStatus(
  patient: Patient,
  _lastAppointmentDate: string | null,
): "inactive" | "active" | "lost" {
  // Use the patient's stored status
  return patient.status || "inactive"
}

export function searchPatients(patients: Patient[], query: string): Patient[] {
  if (!query.trim()) {
    return patients
  }

  const lowerQuery = query.toLowerCase().trim()

  return patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase()
    const phone = patient.phone.toLowerCase()
    const email = (patient.email || "").toLowerCase()
    const complaint = (patient.complaint || "").toLowerCase()
    const job = (patient.job || "").toLowerCase()

    return (
      fullName.includes(lowerQuery) ||
      phone.includes(lowerQuery) ||
      email.includes(lowerQuery) ||
      complaint.includes(lowerQuery) ||
      job.includes(lowerQuery)
    )
  })
}

export function getStatusBadgeVariant(status: PatientListItem["status"]): "default" | "success" | "warning" | "neutral" | "error" {
  switch (status) {
    case "inactive":
      return "neutral"
    case "active":
      return "success"
    case "lost":
      return "error"
    default:
      return "neutral"
  }
}

export function getStatusLabel(status: PatientListItem["status"]): string {
  switch (status) {
    case "inactive":
      return "Inactive"
    case "active":
      return "Active"
    case "lost":
      return "Lost"
    default:
      return "Unknown"
  }
}
