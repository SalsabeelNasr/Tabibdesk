/**
 * Patients API - replaceable backend layer
 * Currently uses mock data, but structured for easy backend replacement
 */

import { mockData } from "@/data/mock/mock-data"
import type { Patient, PatientStatus } from "@/features/patients/patients.types"
import { applyPatientActivation } from "@/features/patients/patientLifecycle"

// In-memory store for created/updated patients (demo mode only)
let patientsStore: Patient[] = []

// Initialize store from mock data
function initializeStore() {
  if (patientsStore.length === 0) {
    patientsStore = [...mockData.patients]
  }
}

export interface ListPatientsParams {
  clinicId?: string
  status?: PatientStatus
  query?: string
  page: number
  pageSize: number
}

export interface ListPatientsResponse {
  patients: Patient[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface CreatePatientPayload {
  firstName: string
  lastName: string
  phone: string
  email?: string
  gender?: string
  dateOfBirth?: string
  age?: number
}

export type ActivationReason = "arrived" | "completed" | "visit_note"

/**
 * List patients with filtering and pagination
 */
export async function list(params: ListPatientsParams): Promise<ListPatientsResponse> {
  initializeStore()
  const { page, pageSize, query, status } = params

  let filtered = [...patientsStore]

  // Filter by status
  if (status) {
    filtered = filtered.filter((p) => p.status === status)
  }

  // Filter by query
  if (query && query.trim()) {
    const lowerQuery = query.toLowerCase().trim()
    filtered = filtered.filter((patient) => {
      const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase()
      const phone = patient.phone.toLowerCase()
      const email = (patient.email || "").toLowerCase()
      return fullName.includes(lowerQuery) || phone.includes(lowerQuery) || email.includes(lowerQuery)
    })
  }

  // Paginate
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginated = filtered.slice(startIndex, endIndex)
  const total = filtered.length
  const hasMore = endIndex < total

  return {
    patients: paginated,
    total,
    page,
    pageSize,
    hasMore,
  }
}

/**
 * Create a new patient (starts as inactive)
 */
export async function create(payload: CreatePatientPayload): Promise<Patient> {
  initializeStore()
  const now = new Date().toISOString()

  const newPatient: Patient = {
    id: `patient-${Date.now()}`,
    first_name: payload.firstName,
    last_name: payload.lastName,
    phone: payload.phone,
    email: payload.email || null,
    gender: payload.gender || "",
    date_of_birth: payload.dateOfBirth || null,
    age: payload.age || null,
    complaint: null,
    job: null,
    doctor_id: null,
    status: "inactive",
    first_visit_at: null,
    last_visit_at: null,
    created_at: now,
    updated_at: now,
  }

  patientsStore.push(newPatient)
  return newPatient
}

/**
 * Update patient status
 */
export async function updateStatus(patientId: string, status: PatientStatus): Promise<Patient> {
  initializeStore()
  const patient = patientsStore.find((p) => p.id === patientId)
  if (!patient) {
    throw new Error("Patient not found")
  }

  const updated = {
    ...patient,
    status,
    updated_at: new Date().toISOString(),
  }

  const index = patientsStore.findIndex((p) => p.id === patientId)
  patientsStore[index] = updated

  return updated
}

/**
 * Activate a patient (called when activation event occurs)
 */
export async function activate(patientId: string, _reason: ActivationReason): Promise<Patient> {
  initializeStore()
  const patient = patientsStore.find((p) => p.id === patientId)
  if (!patient) {
    throw new Error("Patient not found")
  }

  // If already active, just update last_visit_at
  if (patient.status === "active") {
    const updated = {
      ...patient,
      last_visit_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const index = patientsStore.findIndex((p) => p.id === patientId)
    patientsStore[index] = updated
    return updated
  }

  // Apply activation logic
  const activated = applyPatientActivation(patient, new Date().toISOString())
  const index = patientsStore.findIndex((p) => p.id === patientId)
  patientsStore[index] = activated

  return activated
}

/**
 * Get patient by ID
 */
export async function getById(patientId: string): Promise<Patient | null> {
  initializeStore()
  return patientsStore.find((p) => p.id === patientId) || null
}
