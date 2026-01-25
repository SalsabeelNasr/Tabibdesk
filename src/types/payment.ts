export type PaymentMethod = "cash" | "visa" | "instapay";

export interface Payment {
  id: string
  clinicId: string
  invoiceId: string
  patientId: string
  appointmentId: string
  amount: number
  method: PaymentMethod
  proofFileId?: string
  createdByUserId: string
  createdAt: string
}
