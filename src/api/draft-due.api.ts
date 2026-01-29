/**
 * Draft Due API - Pending charges (line items) before final invoice
 * Mock implementation, backend-replaceable
 */

import type { DraftDue, ChargeLineItem } from "@/types/draft-due"
import type { GetOrCreateDraftDueParams, AddOrUpdateChargesParams } from "@/types/draft-due"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const store: DraftDue[] = []

function nextId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Get or create a draft due for a patient (and optionally appointment).
 * Returns existing draft for same patientId + appointmentId, or creates new.
 */
export async function getOrCreateDraftDue(
  params: GetOrCreateDraftDueParams
): Promise<DraftDue> {
  await delay(100)

  const appointmentId = params.appointmentId ?? null
  const existing = store.find(
    (d) =>
      d.patientId === params.patientId &&
      d.clinicId === params.clinicId &&
      (d.appointmentId ?? null) === appointmentId &&
      d.status === "draft"
  )
  if (existing) return { ...existing, lineItems: [...existing.lineItems] }

  const now = new Date().toISOString()
  const draft: DraftDue = {
    id: nextId("draft"),
    patientId: params.patientId,
    clinicId: params.clinicId,
    doctorId: params.doctorId,
    appointmentId,
    status: "draft",
    lineItems: [],
    total: 0,
    createdAt: now,
    updatedAt: now,
  }
  store.push(draft)
  return { ...draft, lineItems: [] }
}

/**
 * Update draft due with consultation, procedure lines, and discount.
 * Rebuilds lineItems and recomputes total.
 */
export async function addOrUpdateCharges(
  params: AddOrUpdateChargesParams
): Promise<DraftDue> {
  await delay(150)

  const draft = store.find((d) => d.id === params.draftDueId)
  if (!draft) throw new Error("Draft due not found")

  const items: ChargeLineItem[] = []

  if (!params.consultationWaived && params.consultationAmount > 0) {
    items.push({
      id: nextId("line"),
      type: "consultation",
      label: "Consultation",
      amount: params.consultationAmount,
    })
  } else {
    items.push({
      id: nextId("line"),
      type: "consultation",
      label: "Consultation — Waived",
      amount: 0,
    })
  }

  for (const p of params.procedureLines) {
    if (p.amount <= 0) continue
    items.push({
      id: p.id ?? nextId("line"),
      type: "procedure",
      label: p.label,
      amount: p.amount,
    })
  }

  if (params.discountAmount > 0) {
    items.push({
      id: nextId("line"),
      type: "discount",
      label: "Discount",
      amount: -params.discountAmount,
    })
  }

  const total = items.reduce((sum, i) => sum + i.amount, 0)
  const updated: DraftDue = {
    ...draft,
    lineItems: items,
    total: Math.max(0, total),
    updatedAt: new Date().toISOString(),
  }
  const idx = store.findIndex((d) => d.id === params.draftDueId)
  store[idx] = updated
  return { ...updated, lineItems: [...updated.lineItems] }
}

/**
 * Get draft due(s) for a patient. Optionally filter by appointmentId.
 */
export async function getDraftDueForPatient(
  patientId: string,
  appointmentId?: string | null
): Promise<DraftDue | null> {
  await delay(80)

  const filtered = store.filter(
    (d) =>
      d.patientId === patientId &&
      d.status === "draft" &&
      (appointmentId === undefined || (d.appointmentId ?? null) === (appointmentId ?? null))
  )
  const draft = filtered[0] ?? null
  return draft ? { ...draft, lineItems: [...draft.lineItems] } : null
}

/**
 * Get total draft due amount for a patient (sum across all draft dues for that patient).
 */
export async function getDraftDueTotalForPatient(patientId: string): Promise<number> {
  await delay(80)
  return store
    .filter((d) => d.patientId === patientId && d.status === "draft")
    .reduce((sum, d) => sum + d.total, 0)
}

/**
 * Clear (remove) a draft due after it has been converted to an invoice.
 */
export async function clearDraftDue(draftDueId: string): Promise<void> {
  await delay(80)
  const idx = store.findIndex((d) => d.id === draftDueId)
  if (idx !== -1) store.splice(idx, 1)
}
