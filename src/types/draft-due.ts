export type ChargeLineItemType = "consultation" | "procedure" | "discount"

export interface ChargeLineItem {
  id: string
  type: ChargeLineItemType
  label: string
  amount: number
}

export interface DraftDue {
  id: string
  patientId: string
  clinicId: string
  doctorId: string
  appointmentId: string | null
  status: "draft"
  lineItems: ChargeLineItem[]
  total: number
  createdAt: string
  updatedAt: string
}

export interface GetOrCreateDraftDueParams {
  patientId: string
  clinicId: string
  doctorId: string
  appointmentId?: string | null
}

export interface AddOrUpdateChargesParams {
  draftDueId: string
  consultationWaived: boolean
  consultationAmount: number
  procedureLines: { id?: string; label: string; amount: number }[]
  discountAmount: number
}
