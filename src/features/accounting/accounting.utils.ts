import type { PaymentStatus, PaymentMethod, ExpenseCategory } from './accounting.types'

export function formatCurrency(amount: number): string {
  return `${Math.round(amount)} EGP`
}

export function getPaymentStatusVariant(status: PaymentStatus | string): 'success' | 'warning' | 'error' | 'default' | 'neutral' {
  switch (status) {
    case 'paid': return 'success'
    case 'partial': return 'warning'
    case 'unpaid': return 'error'
    case 'pending_approval': return 'warning'
    default: return 'default'
  }
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case 'paid': return 'Paid'
    case 'partial': return 'Partial'
    case 'unpaid': return 'Unpaid'
    case 'pending_approval': return 'Pending Approval'
    case 'refunded': return 'Refunded'
    case 'cancelled': return 'Cancelled'
    default: return status
  }
}

export function getPaymentMethodLabel(method: PaymentMethod | string): string {
  switch (method) {
    case 'cash': return 'Cash'
    case 'instapay': return 'Instapay'
    case 'credit_card': return 'Credit Card'
    case 'bank_transfer': return 'Bank Transfer'
    default: return String(method)
  }
}

export function getExpenseCategoryLabel(category: ExpenseCategory): string {
  switch (category) {
    case 'supplies': return 'Supplies'
    case 'equipment': return 'Equipment'
    case 'rent': return 'Rent'
    case 'utilities': return 'Utilities'
    case 'salaries': return 'Salaries'
    case 'marketing': return 'Marketing'
    case 'other': return 'Other'
    default: return category
  }
}

export function getExpenseCategoryVariant(category: ExpenseCategory): 'success' | 'warning' | 'error' | 'default' {
  switch (category) {
    case 'rent': return 'error'
    case 'salaries': return 'warning'
    case 'supplies': return 'warning'
    case 'equipment': return 'warning'
    case 'marketing': return 'success'
    default: return 'default'
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function formatMonth(monthString: string): string {
  const [year, month] = monthString.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function getTodayDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

export function requiresApproval(method: PaymentMethod, hasEvidence: boolean): boolean {
  return (method === 'instapay' || method === 'bank_transfer' || method === 'credit_card') && hasEvidence
}

export async function mockUploadFile(file: File): Promise<string> {
  const delay = 1000 + Math.random() * 1000
  await new Promise(resolve => setTimeout(resolve, delay))
  const uuid = crypto.randomUUID()
  const extension = file.name.split('.').pop() || 'jpg'
  return `/uploads/${file.type.startsWith('image/') ? 'evidence' : 'receipt'}-${uuid}.${extension}`
}
