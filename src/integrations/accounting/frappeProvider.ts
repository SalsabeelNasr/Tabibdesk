/**
 * Frappe/ERPNext Provider
 * Integration stub for Frappe ERPNext (open-source ERP)
 * https://erpnext.com
 */

import type { AccountingProvider } from "./accountingProvider"
import { simulateDelay } from "./accountingProvider"
import type { Payment, Expense } from "@/features/accounting/accounting.types"

export const frappeProvider: AccountingProvider = {
  async pushInvoice(payment: Payment): Promise<void> {
    await simulateDelay()
    
    // Mock: Would POST to Frappe API
    // POST /api/resource/Sales Invoice
    console.log("[Frappe/ERPNext] Would push sales invoice:", {
      customer: payment.patientName,
      posting_date: payment.createdAt,
      grand_total: payment.amount,
      currency: "EGP",
      status: payment.status === "paid" ? "Paid" : "Unpaid",
    })
  },

  async pushExpense(expense: Expense): Promise<void> {
    await simulateDelay()
    
    // Mock: Would POST to Frappe API
    // POST /api/resource/Purchase Invoice
    console.log("[Frappe/ERPNext] Would push purchase invoice:", {
      supplier: expense.vendor,
      posting_date: expense.date,
      grand_total: expense.amount,
      expense_account: expense.category,
      description: expense.description,
    })
  },

  async syncStatus() {
    await simulateDelay(200)
    
    return {
      lastSync: new Date().toISOString(),
      status: "connected" as const,
    }
  },

  async testConnection(): Promise<boolean> {
    await simulateDelay(300)
    
    // Mock: Would test API connection
    return true
  },
}
