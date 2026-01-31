/**
 * Akaunting Provider
 * Integration stub for Akaunting (open-source accounting software)
 * https://akaunting.com
 */

import type { AccountingProvider } from "./accountingProvider"
import { simulateDelay } from "./accountingProvider"
import type { Payment, Expense } from "@/features/accounting/accounting.types"

export const akauntingProvider: AccountingProvider = {
  async pushInvoice(_payment: Payment): Promise<void> {
    await simulateDelay()
    // Mock: Would POST to Akaunting API - POST /api/v1/invoices
  },

  async pushExpense(_expense: Expense): Promise<void> {
    await simulateDelay()
    // Mock: Would POST to Akaunting API - POST /api/v1/expenses
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
