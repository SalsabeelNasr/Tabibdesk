/**
 * Accounting AI API
 * Mock AI behavior for accounting automation
 * All logic is replaceable - this simulates an AI backend
 */

import { getTodayCashierRows, listPayments } from "./accounting.api"
import { detectMissingPayments, detectPendingApprovals } from "@/features/accounting/accounting.rules"

export type AiAlertType = 
  | "missing_payments"
  | "pending_approvals"
  | "unusual_discounts"
  | "fee_inconsistency"
  | "high_no_shows"

export interface AiAlert {
  id: string
  type: AiAlertType
  title: string
  description: string
  count: number
  primaryActionLabel: string
  primaryActionRoute?: string
  primaryActionFn?: string // Function name to call
}

export interface ParsePaymentProofInput {
  clinicId: string
  patientId?: string
  appointmentId?: string
  evidenceFileUrl: string
  messageText?: string
}

export interface ParsePaymentProofResult {
  suggestedAmount: number
  suggestedMethod: "instapay" | "bank_transfer" | "cash" | "credit_card"
  suggestedReference?: string
  suggestedDate?: string
  confidence: number // 0-1
  warnings: string[]
}

export interface DailyClosingReport {
  date: string
  totalsByMethod: Record<string, number>
  unpaidCount: number
  unpaidTotal: number
  pendingApprovals: number
  totalDiscounts: number
  noShowsCount: number
  summary: string
}

/**
 * Get AI-generated alerts for accounting module
 */
export async function getAiAlerts(params: {
  clinicId: string
  dateRange?: { from: string; to: string }
}): Promise<AiAlert[]> {
  await new Promise(resolve => setTimeout(resolve, 500)) // Simulate AI processing

  const alerts: AiAlert[] = []
  const today = new Date().toISOString().split("T")[0]

  // Get data
  const cashierRows = await getTodayCashierRows({
    clinicId: params.clinicId,
    date: today,
  })
  const payments = await listPayments({
    clinicId: params.clinicId,
    page: 1,
    pageSize: 1000,
  })

  // Alert 1: Missing payments
  const missingPayments = detectMissingPayments(cashierRows)
  if (missingPayments.length > 0) {
    alerts.push({
      id: "alert-missing-payments",
      type: "missing_payments",
      title: "Missing Payments",
      description: `${missingPayments.length} completed appointments have no payment recorded`,
      count: missingPayments.length,
      primaryActionLabel: "Create Tasks",
      primaryActionFn: "createMissingPaymentTasks",
    })
  }

  // Alert 2: Pending approvals
  const pendingApprovals = detectPendingApprovals(payments.payments)
  if (pendingApprovals.length > 0) {
    alerts.push({
      id: "alert-pending-approvals",
      type: "pending_approvals",
      title: "Instapay Proofs Pending Approval",
      description: `${pendingApprovals.length} payment proofs waiting for review`,
      count: pendingApprovals.length,
      primaryActionLabel: "Review Now",
      primaryActionRoute: "/accounting?tab=today&filter=pending",
    })
  }

  // Alert 3: High no-shows
  const noShows = cashierRows.filter((row) => row.appointmentStatus === "no_show")
  if (noShows.length >= 3) {
    alerts.push({
      id: "alert-high-no-shows",
      type: "high_no_shows",
      title: "High No-Shows Today",
      description: `${noShows.length} patients did not show up for their appointments`,
      count: noShows.length,
      primaryActionLabel: "View List",
      primaryActionRoute: "/accounting?tab=today&status=no_show",
    })
  }

  // Return up to 3 alerts
  return alerts.slice(0, 3)
}

/**
 * Parse payment proof using AI (mock implementation)
 * Simulates extracting payment details from uploaded image + text
 */
export async function parsePaymentProof(
  input: ParsePaymentProofInput
): Promise<ParsePaymentProofResult> {
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate AI processing

  // Mock: Extract from message text if available
  const text = input.messageText || ""
  const warnings: string[] = []

  // Mock extraction logic
  let suggestedAmount = 0
  let suggestedReference = ""
  let confidence = 0.85

  // Try to extract amount (e.g., "300 EGP", "paid 500")
  const amountMatch = text.match(/(\d+)\s*(EGP|egp|جنيه)?/i)
  if (amountMatch) {
    suggestedAmount = parseInt(amountMatch[1])
    confidence = 0.9
  } else {
    warnings.push("Could not extract payment amount from text")
    confidence = 0.5
  }

  // Try to extract reference number (e.g., "ref: 12345", "reference 67890")
  const refMatch = text.match(/ref(?:erence)?[:\s]+(\w+)/i)
  if (refMatch) {
    suggestedReference = refMatch[1]
  }

  // Determine method based on keywords
  let suggestedMethod: "instapay" | "bank_transfer" | "cash" | "credit_card" = "instapay"
  if (text.toLowerCase().includes("bank") || text.toLowerCase().includes("transfer")) {
    suggestedMethod = "bank_transfer"
  } else if (text.toLowerCase().includes("cash")) {
    suggestedMethod = "cash"
  }

  // Add confidence warning if low
  if (confidence < 0.7) {
    warnings.push("Low confidence - please verify extracted details")
  }

  return {
    suggestedAmount,
    suggestedMethod,
    suggestedReference: suggestedReference || undefined,
    suggestedDate: new Date().toISOString().split("T")[0],
    confidence,
    warnings,
  }
}

/**
 * Generate daily closing report
 */
export async function generateDailyClosingReport(params: {
  clinicId: string
  date: string
}): Promise<DailyClosingReport> {
  await new Promise(resolve => setTimeout(resolve, 800)) // Simulate AI processing

  const { clinicId, date } = params

  // Get data
  const cashierRows = await getTodayCashierRows({ clinicId, date })
  const payments = await listPayments({ clinicId, page: 1, pageSize: 1000 })
  const todayPayments = payments.payments.filter((p) =>
    p.createdAt.startsWith(date)
  )

  // Calculate totals by method
  const totalsByMethod: Record<string, number> = {}
  todayPayments
    .filter((p) => p.status === "paid")
    .forEach((p) => {
      totalsByMethod[p.method] = (totalsByMethod[p.method] || 0) + p.amount
    })

  // Calculate metrics
  const missingPayments = detectMissingPayments(cashierRows)
  const pendingApprovals = detectPendingApprovals(todayPayments)
  const noShows = cashierRows.filter((row) => row.appointmentStatus === "no_show")

  const totalRevenue = Object.values(totalsByMethod).reduce((sum, val) => sum + val, 0)
  const unpaidTotal = missingPayments.reduce((sum, item) => sum + item.amount, 0)

  // Generate AI summary
  const summary = `Today's revenue: ${totalRevenue.toFixed(2)} EGP. ${
    missingPayments.length > 0
      ? `${missingPayments.length} unpaid appointments (${unpaidTotal.toFixed(2)} EGP).`
      : "All completed appointments are paid."
  } ${
    pendingApprovals.length > 0
      ? `${pendingApprovals.length} payment proofs pending approval.`
      : ""
  } ${noShows.length > 0 ? `${noShows.length} no-shows recorded.` : ""}`

  return {
    date,
    totalsByMethod,
    unpaidCount: missingPayments.length,
    unpaidTotal,
    pendingApprovals: pendingApprovals.length,
    totalDiscounts: 0, // TODO: Implement discount tracking
    noShowsCount: noShows.length,
    summary,
  }
}
