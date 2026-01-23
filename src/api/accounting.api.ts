/**
 * Accounting API
 * Mock implementation for payments, expenses, and accounting operations
 * All data handling is replaceable - this is the backend interface layer
 */

import type {
  Payment,
  Expense,
  CashierRow,
  PatientBalance,
  PatientPaymentHistory,
  MonthlySummary,
  ClinicAccountingSettings,
  AccountingIntegration,
  CreatePaymentInput,
  UpdatePaymentInput,
  CreateExpenseInput,
  ListPaymentsParams,
  ListPaymentsResponse,
  ListExpensesParams,
  ListExpensesResponse,
  ListBalancesParams,
  ListBalancesResponse,
} from "@/features/accounting/accounting.types"
import { getById as getPatient } from "./patients.api"

// Mock data stores with seed data
const paymentsStore: Payment[] = [
  // Today's payments
  {
    id: "pay_001",
    clinicId: "clinic_1",
    patientId: "patient_1",
    patientName: "Ahmed Hassan",
    appointmentId: "apt_001",
    amount: 500,
    method: "cash",
    status: "paid",
    createdAt: new Date().toISOString(),
    createdByUserId: "user_1",
  },
  {
    id: "pay_002",
    clinicId: "clinic_1",
    patientId: "patient_2",
    patientName: "Fatima Ali",
    appointmentId: "apt_002",
    amount: 300,
    method: "instapay",
    status: "paid",
    reference: "INS123456",
    createdAt: new Date().toISOString(),
    createdByUserId: "user_1",
  },
  {
    id: "pay_003",
    clinicId: "clinic_1",
    patientId: "patient_3",
    patientName: "Omar Mohamed",
    appointmentId: "apt_003",
    amount: 700,
    method: "credit_card",
    status: "paid",
    reference: "CARD7890",
    createdAt: new Date().toISOString(),
    createdByUserId: "user_1",
  },
  // Pending approval
  {
    id: "pay_004",
    clinicId: "clinic_1",
    patientId: "patient_4",
    patientName: "Sara Ibrahim",
    appointmentId: "apt_004",
    amount: 500,
    method: "instapay",
    status: "pending_approval",
    reference: "INS789012",
    evidenceUrl: "/uploads/evidence-001.jpg",
    createdAt: new Date().toISOString(),
    createdByUserId: "user_1",
  },
  // This month's previous payments
  {
    id: "pay_005",
    clinicId: "clinic_1",
    patientId: "patient_5",
    patientName: "Layla Ahmed",
    amount: 600,
    method: "cash",
    status: "paid",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdByUserId: "user_1",
  },
  {
    id: "pay_006",
    clinicId: "clinic_1",
    patientId: "patient_6",
    patientName: "Karim Youssef",
    amount: 400,
    method: "bank_transfer",
    status: "paid",
    reference: "BANK456789",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdByUserId: "user_1",
  },
]

const expensesStore: Expense[] = [
  {
    id: "exp_001",
    clinicId: "clinic_1",
    category: "supplies",
    amount: 1500,
    vendor: "Medical Supplies Co.",
    description: "Medical supplies and consumables",
    paymentMethod: "bank_transfer",
    date: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    createdByUserId: "user_1",
  },
  {
    id: "exp_002",
    clinicId: "clinic_1",
    category: "rent",
    amount: 5000,
    vendor: "Building Management",
    description: "Monthly clinic rent",
    paymentMethod: "bank_transfer",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdByUserId: "user_1",
  },
  {
    id: "exp_003",
    clinicId: "clinic_1",
    category: "utilities",
    amount: 800,
    vendor: "Electricity Company",
    description: "Monthly electricity bill",
    paymentMethod: "cash",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdByUserId: "user_1",
  },
  {
    id: "exp_004",
    clinicId: "clinic_1",
    category: "marketing",
    amount: 1200,
    vendor: "Digital Marketing Agency",
    description: "Social media ads campaign",
    paymentMethod: "credit_card",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdByUserId: "user_1",
  },
]

const settingsStore: Record<string, ClinicAccountingSettings> = {}
const integrationStore: Record<string, AccountingIntegration> = {}

// Helper to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * PAYMENTS
 */

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  await delay(300)

  const payment: Payment = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    clinicId: input.clinicId,
    patientId: input.patientId,
    patientName: input.patientName,
    appointmentId: input.appointmentId,
    amount: input.amount,
    method: input.method,
    status: input.status || "paid",
    reference: input.reference,
    notes: input.notes,
    evidenceUrl: input.evidenceUrl,
    createdAt: new Date().toISOString(),
    createdByUserId: input.createdByUserId,
  }

  paymentsStore.push(payment)
  return payment
}

export async function updatePayment(
  paymentId: string,
  input: UpdatePaymentInput
): Promise<Payment> {
  await delay(200)

  const index = paymentsStore.findIndex((p) => p.id === paymentId)
  if (index === -1) {
    throw new Error("Payment not found")
  }

  const updated: Payment = {
    ...paymentsStore[index],
    ...input,
    updatedAt: new Date().toISOString(),
  }

  paymentsStore[index] = updated
  return updated
}

export async function getPayment(paymentId: string): Promise<Payment> {
  await delay(100)

  const payment = paymentsStore.find((p) => p.id === paymentId)
  if (!payment) {
    throw new Error("Payment not found")
  }

  return payment
}

export async function listPayments(
  params: ListPaymentsParams
): Promise<ListPaymentsResponse> {
  await delay(200)

  let filtered = paymentsStore

  // Apply filters
  if (params.patientId) {
    filtered = filtered.filter((p) => p.patientId === params.patientId)
  }
  if (params.appointmentId) {
    filtered = filtered.filter((p) => p.appointmentId === params.appointmentId)
  }
  if (params.status) {
    filtered = filtered.filter((p) => p.status === params.status)
  }
  if (params.dateFrom) {
    filtered = filtered.filter((p) => p.createdAt >= params.dateFrom!)
  }
  if (params.dateTo) {
    filtered = filtered.filter((p) => p.createdAt <= params.dateTo!)
  }

  // Sort by date desc
  filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  // Pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedPayments = filtered.slice(start, end)

  return {
    payments: paginatedPayments,
    total: filtered.length,
    page,
    pageSize,
    hasMore: end < filtered.length,
  }
}

/**
 * EXPENSES
 */

export async function createExpense(input: CreateExpenseInput): Promise<Expense> {
  await delay(300)

  const expense: Expense = {
    id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    clinicId: input.clinicId,
    category: input.category,
    amount: input.amount,
    vendor: input.vendor,
    description: input.description,
    paymentMethod: input.paymentMethod,
    receiptUrl: input.receiptUrl,
    date: input.date,
    createdAt: new Date().toISOString(),
    createdByUserId: input.createdByUserId,
  }

  expensesStore.push(expense)
  return expense
}

export async function listExpenses(
  params: ListExpensesParams
): Promise<ListExpensesResponse> {
  await delay(200)

  let filtered = expensesStore

  // Apply filters
  if (params.category) {
    filtered = filtered.filter((e) => e.category === params.category)
  }
  if (params.dateFrom) {
    filtered = filtered.filter((e) => e.date >= params.dateFrom!)
  }
  if (params.dateTo) {
    filtered = filtered.filter((e) => e.date <= params.dateTo!)
  }

  // Sort by date desc
  filtered.sort((a, b) => b.date.localeCompare(a.date))

  // Pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 50
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedExpenses = filtered.slice(start, end)

  return {
    expenses: paginatedExpenses,
    total: filtered.length,
    page,
    pageSize,
  }
}

/**
 * CASHIER / TODAY VIEW
 */

export async function getTodayCashierRows(params: {
  clinicId: string
  date: string
}): Promise<CashierRow[]> {
  await delay(300)

  // Mock: Get today's payments for this clinic
  const todayPayments = paymentsStore.filter(
    (p) => p.createdAt.startsWith(params.date)
  )

  // Build cashier rows from payments
  const rows: CashierRow[] = todayPayments.map((payment) => {
    const isPaid = payment.status === "paid"
    const isPending = payment.status === "pending_approval"
    
    return {
      appointmentId: payment.appointmentId || `apt_${payment.id}`,
      patientId: payment.patientId,
      patientName: payment.patientName || "Unknown Patient",
      appointmentStatus: "completed",
      time: payment.createdAt,
      feeAmount: payment.amount,
      paymentId: payment.id,
      paymentStatus: isPaid ? "paid" : isPending ? "pending_approval" : "unpaid",
      paymentMethod: payment.method,
      paymentAmount: payment.amount,
      paymentReference: payment.reference,
      evidenceUrl: payment.evidenceUrl,
    }
  })

  // Add some unpaid appointments (mock)
  if (rows.length < 5) {
    const unpaidMockPatients = [
      { id: "patient_10", name: "Mona Khaled" },
      { id: "patient_11", name: "Youssef Salem" },
    ]
    
    unpaidMockPatients.forEach((patient, index) => {
      rows.push({
        appointmentId: `apt_unpaid_${index}`,
        patientId: patient.id,
        patientName: patient.name,
        appointmentStatus: "completed",
        time: new Date(Date.now() + (index + 1) * 60 * 60 * 1000).toISOString(),
        feeAmount: 500,
        paymentStatus: "unpaid",
      })
    })
  }

  return rows
}

/**
 * BALANCES
 */

export async function getPatientBalances(
  params: ListBalancesParams
): Promise<ListBalancesResponse> {
  await delay(300)

  // Get all payments
  const allPayments = paymentsStore

  // Group by patient
  const balanceMap: Record<string, PatientBalance> = {}

  for (const payment of allPayments) {
    if (!balanceMap[payment.patientId]) {
      balanceMap[payment.patientId] = {
        patientId: payment.patientId,
        patientName: payment.patientName || "Unknown Patient",
        phone: "0100-000-0000",
        totalDue: 0,
        lastVisit: payment.createdAt,
        lastPayment: "",
      }
    }

    const balance = balanceMap[payment.patientId]

    // Calculate total due (unpaid/partial)
    if (payment.status === "unpaid" || payment.status === "partial") {
      balance.totalDue += payment.amount
    }

    // Track last payment date
    if (payment.status === "paid" && payment.createdAt > balance.lastPayment) {
      balance.lastPayment = payment.createdAt
    }
    
    // Track last visit
    if (payment.createdAt > balance.lastVisit) {
      balance.lastVisit = payment.createdAt
    }
  }

  let balances = Object.values(balanceMap)

  // Apply search filter
  if (params.query) {
    const query = params.query.toLowerCase()
    balances = balances.filter(
      (b) =>
        b.patientName.toLowerCase().includes(query) ||
        b.phone.includes(query)
    )
  }

  // Filter: only show patients with balance > 0 if requested
  if (params.onlyWithBalance) {
    balances = balances.filter((b) => b.totalDue > 0)
  }

  // Sort by last visit desc
  balances.sort((a, b) => b.lastVisit.localeCompare(a.lastVisit))

  // Pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedBalances = balances.slice(start, end)

  return {
    balances: paginatedBalances,
    total: balances.length,
    page,
    pageSize,
  }
}

export async function getPatientPaymentHistory(params: {
  clinicId: string
  patientId: string
}): Promise<PatientPaymentHistory> {
  await delay(200)

  const payments = paymentsStore
    .filter(
      (p) => p.clinicId === params.clinicId && p.patientId === params.patientId
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const unpaidCharges = payments.filter(
    (p) => p.status === "unpaid" || p.status === "partial"
  )

  return {
    payments,
    unpaidCharges: unpaidCharges.map((p) => ({
      id: p.id,
      appointmentId: p.appointmentId || undefined,
      date: p.createdAt,
      amount: p.amount,
      status: p.status,
    })),
  }
}

/**
 * SUMMARY / REPORTS
 */

export async function getMonthlySummary(params: {
  clinicId: string
  month: string // YYYY-MM
}): Promise<MonthlySummary> {
  await delay(300)

  const startDate = `${params.month}-01`
  const endDate = `${params.month}-31` // Simplified

  const paymentsResponse = await listPayments({
    clinicId: params.clinicId,
    dateFrom: startDate,
    dateTo: endDate,
    page: 1,
    pageSize: 10000,
  })

  const expensesResponse = await listExpenses({
    clinicId: params.clinicId,
    dateFrom: startDate,
    dateTo: endDate,
    page: 1,
    pageSize: 10000,
  })

  const paidPayments = paymentsResponse.payments.filter((p) => p.status === "paid")
  const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalExpenses = expensesResponse.expenses.reduce((sum: number, e: Expense) => sum + e.amount, 0)

  const unpaidPayments = paymentsResponse.payments.filter(
    (p) => p.status === "unpaid" || p.status === "partial"
  )
  const totalOutstanding = unpaidPayments.reduce((sum, p) => sum + p.amount, 0)

  // Payment methods breakdown
  const paymentMethodBreakdown: Record<string, number> = {}
  paidPayments.forEach((p) => {
    paymentMethodBreakdown[p.method] = (paymentMethodBreakdown[p.method] || 0) + p.amount
  })

  return {
    month: params.month,
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    totalOutstanding,
    paymentMethodBreakdown,
  }
}

/**
 * SETTINGS
 */

export async function getAccountingSettings(params: {
  clinicId: string
}): Promise<ClinicAccountingSettings> {
  await delay(100)

  if (!settingsStore[params.clinicId]) {
    // Return defaults
    settingsStore[params.clinicId] = {
      clinicId: params.clinicId,
      defaultFees: {
        follow_up: 300,
        new: 500,
        urgent: 700,
        online: 400,
      },
      allowCustomPricing: true,
    }
  }

  return settingsStore[params.clinicId]
}

export async function updateAccountingSettings(params: {
  clinicId: string
  settings: Partial<Omit<ClinicAccountingSettings, "clinicId">>
}): Promise<ClinicAccountingSettings> {
  await delay(200)

  const current = await getAccountingSettings({ clinicId: params.clinicId })

  const updated: ClinicAccountingSettings = {
    ...current,
    ...params.settings,
  }

  settingsStore[params.clinicId] = updated
  return updated
}

/**
 * INTEGRATIONS
 */

export async function getAccountingIntegration(params: {
  clinicId: string
}): Promise<AccountingIntegration | null> {
  await delay(100)

  return integrationStore[params.clinicId] || null
}

export async function updateAccountingIntegration(
  params: {
    clinicId: string
  },
  integration: AccountingIntegration
): Promise<AccountingIntegration> {
  await delay(200)

  integrationStore[params.clinicId] = integration
  return integration
}
