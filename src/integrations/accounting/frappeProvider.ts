/**
 * Frappe/ERPNext Provider
 * Integration stub for Frappe ERPNext (open-source ERP)
 * https://erpnext.com
 */

import type { AccountingProvider } from "./accountingProvider"
import { simulateDelay } from "./accountingProvider"
import type { Payment, Expense } from "@/features/accounting/accounting.types"

export const frappeProvider: AccountingProvider = {
  async pushInvoice(_payment: Payment): Promise<void> {
    await simulateDelay()
    // Mock: Would POST to Frappe API - POST /api/resource/Sales Invoice
  },

  async pushExpense(_expense: Expense): Promise<void> {
    await simulateDelay()
    // Mock: Would POST to Frappe API - POST /api/resource/Purchase Invoice
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
