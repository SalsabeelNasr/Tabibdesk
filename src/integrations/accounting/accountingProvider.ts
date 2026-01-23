/**
 * Accounting Provider Interface
 * Standard interface for external accounting system integrations
 */

import type { Payment, Expense } from "@/features/accounting/accounting.types"

export interface AccountingProvider {
  /**
   * Push invoice/payment to external system
   */
  pushInvoice(payment: Payment): Promise<void>

  /**
   * Push expense to external system
   */
  pushExpense(expense: Expense): Promise<void>

  /**
   * Get sync status
   */
  syncStatus(): Promise<{
    lastSync: string
    status: "connected" | "error" | "pending"
    errorMessage?: string
  }>

  /**
   * Test connection
   */
  testConnection(): Promise<boolean>
}

/**
 * Helper to simulate network delay
 */
export async function simulateDelay(ms: number = 500): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
