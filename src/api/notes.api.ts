/**
 * Visit Notes API - replaceable backend layer
 * Uses in-memory store (no direct mockData mutations).
 */

import { mockData } from "@/data/mock/mock-data"
import { activate as activatePatient } from "./patients.api"
import { shouldActivatePatientFromNote } from "@/features/patients/patientLifecycle"

let notesStore: VisitNote[] = []
let notesInitialized = false

function initNotesStore() {
  if (!notesInitialized) {
    notesStore = mockData.doctorNotes.map((note) => ({
      id: note.id,
      patientId: note.patient_id,
      note: note.note,
      createdAt: note.created_at,
    }))
    notesInitialized = true
  }
}

export interface VisitNote {
  id: string
  patientId: string
  note: string
  createdAt: string
}

export interface CreateNotePayload {
  patientId: string
  note: string
}

/**
 * Create a visit note
 * Automatically triggers patient activation if note is created
 */
export async function create(payload: CreateNotePayload): Promise<VisitNote> {
  initNotesStore()
  const now = new Date().toISOString()

  const newNote: VisitNote = {
    id: `note-${Date.now()}`,
    patientId: payload.patientId,
    note: payload.note,
    createdAt: now,
  }

  notesStore.push(newNote)

  if (shouldActivatePatientFromNote(payload.note)) {
    await activatePatient(payload.patientId, "visit_note")
  }

  return newNote
}

/**
 * Update a visit note
 */
export async function update(id: string, note: string): Promise<VisitNote> {
  initNotesStore()
  const index = notesStore.findIndex((n) => n.id === id)
  if (index === -1) throw new Error("Note not found")

  notesStore[index] = { ...notesStore[index], note }
  return notesStore[index]
}

/**
 * Delete a visit note
 */
export async function remove(id: string): Promise<void> {
  initNotesStore()
  notesStore = notesStore.filter((n) => n.id !== id)
}

/**
 * Get notes for a patient
 */
export async function getByPatientId(patientId: string): Promise<VisitNote[]> {
  initNotesStore()
  return notesStore.filter((note) => note.patientId === patientId)
}
