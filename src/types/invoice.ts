export type InvoiceStatus = "unpaid" | "paid" | "void";

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
}
