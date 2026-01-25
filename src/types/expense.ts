export type ExpenseCategory =
  | "supplies"
  | "rent"
  | "salaries"
  | "utilities"
  | "marketing"
  | "other";

export type ExpenseMethod = "cash" | "instapay" | "transfer";

export interface Expense {
  id: string
  clinicId: string
  amount: number
  category: ExpenseCategory
  method: ExpenseMethod
  vendorName?: string
  note?: string
  receiptFileId?: string
  createdByUserId: string
  createdAt: string
}
