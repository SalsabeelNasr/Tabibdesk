/**
 * Accounting Rules & Automation Logic
 * Pure functions for detecting issues and generating suggestions
 */

import type { CashierRow, Payment } from "./accounting.types"

export interface MissingPaymentItem {
  appointmentId: string
  patientId: string
  patientName: string
  appointmentDate: string
  amount: number
  suggestedMethod: "cash" | "instapay" | "bank_transfer" | "credit_card"
}

export interface FeeInconsistency {
  appointmentId: string
  patientId: string
  patientName: string
  appointmentDate: string
  expectedAmount: number
  actualAmount: number
  difference: number
}

export interface PendingApprovalItem {
  paymentId: string
  appointmentId: string
  patientId: string
  patientName: string
  amount: number
  method: string
  evidenceUrl?: string
  reference?: string
  createdAt: string
}

/**
 * Detect missing payments from cashier rows
 * Rule: Appointment is completed but has no payment or is unpaid
 */
export function detectMissingPayments(
  cashierRows: CashierRow[]
): MissingPaymentItem[] {
  return cashierRows
    .filter(
      (row) =>
        row.appointmentStatus === "completed" &&
        (row.paymentStatus === "unpaid" || !row.paymentId)
    )
    .map((row) => ({
      appointmentId: row.appointmentId,
      patientId: row.patientId,
      patientName: row.patientName,
      appointmentDate: row.time,
      amount: row.feeAmount,
      suggestedMethod: row.feeAmount > 300 ? "instapay" : "cash",
    }))
}

/**
 * Detect fee inconsistencies
 * Rule: Payment amount doesn't match expected fee
 */
export function detectFeeInconsistencies(
  cashierRows: CashierRow[]
): FeeInconsistency[] {
  return cashierRows
    .filter(
      (row) =>
        row.paymentStatus === "paid" &&
        row.paymentAmount !== undefined &&
        row.paymentAmount !== row.feeAmount
    )
    .map((row) => ({
      appointmentId: row.appointmentId,
      patientId: row.patientId,
      patientName: row.patientName,
      appointmentDate: row.time,
      expectedAmount: row.feeAmount,
      actualAmount: row.paymentAmount!,
      difference: row.paymentAmount! - row.feeAmount,
    }))
}

/**
 * Detect pending approval payments
 * Rule: Payment status is pending_approval
 */
export function detectPendingApprovals(
  payments: Payment[]
): PendingApprovalItem[] {
  return payments
    .filter((p) => p.status === "pending_approval")
    .map((p) => ({
      paymentId: p.id,
      appointmentId: p.appointmentId || "",
      patientId: p.patientId,
      patientName: p.patientName || "Unknown",
      amount: p.amount,
      method: p.method,
      evidenceUrl: p.evidenceUrl,
      reference: p.reference,
      createdAt: p.createdAt,
    }))
}

/**
 * Generate task title for missing payment
 */
export function generateMissingPaymentTaskTitle(patientName: string): string {
  return `Collect payment — ${patientName}`
}

/**
 * Generate task description for missing payment
 */
export function generateMissingPaymentTaskDescription(
  item: MissingPaymentItem
): string {
  return `Payment collection needed for appointment on ${item.appointmentDate}. Amount: ${item.amount} EGP. Suggested method: ${item.suggestedMethod}.`
}

/**
 * Determine if payment requires approval based on method and amount
 */
export function requiresApproval(
  method: string,
  amount: number,
  hasEvidence: boolean
): boolean {
  // Instapay and bank transfers always require approval if there's evidence
  if ((method === "instapay" || method === "bank_transfer") && hasEvidence) {
    return true
  }
  // Large cash payments (over 1000 EGP) require approval
  if (method === "cash" && amount > 1000) {
    return true
  }
  return false
}
