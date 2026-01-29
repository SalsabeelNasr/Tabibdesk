export type InvoiceStatus = "unpaid" | "partial" | "paid" | "void";

export interface ChargeLineItem {
  id: string
  type: "consultation" | "procedure" | "discount"
  label: string
  amount: number
}

export interface Invoice {
  id: string
  clinicId: string
  doctorId: string
  patientId: string
  appointmentId: string
  appointmentType: string
  amount: number
  status: InvoiceStatus
  createdAt: string
  /** Optional line items (consultation, procedures, discount). When present, amount = sum(lineItems). */
  lineItems?: ChargeLineItem[]
}
