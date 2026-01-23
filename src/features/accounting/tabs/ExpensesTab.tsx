"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/Card"
import { Select } from "@/components/Select"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { useToast } from "@/hooks/useToast"
import { listExpenses } from "@/api/accounting.api"
import type { Expense } from "../accounting.types"
import { ExpenseList } from "../components/ExpenseList"
import { formatCurrency } from "../accounting.utils"

export function ExpensesTab() {
  const { currentClinic } = useUserClinic()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().substring(0, 7) // YYYY-MM
  )

  const loadData = async () => {
    try {
      setLoading(true)
      const startDate = `${selectedMonth}-01`
      const endDate = `${selectedMonth}-31`
      const response = await listExpenses({
        clinicId: currentClinic.id,
        dateFrom: startDate,
        dateTo: endDate,
        page: 1,
        pageSize: 100,
      })
      setExpenses(response.expenses)
    } catch (error) {
      console.error("Failed to load expenses:", error)
      showToast("Failed to load expenses", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [currentClinic.id, selectedMonth])

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  // Generate month options (last 12 months)
  const monthOptions = []
  for (let i = 0; i < 12; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const value = date.toISOString().substring(0, 7)
    const label = date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
    monthOptions.push({ value, label })
  }

  return (
    <div className="space-y-6">
      {/* Header with Month Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Expenses
          </h3>
        </div>
        <Select
          className="w-[200px]"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {monthOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Total KPI */}
      <Card className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-50">
          {formatCurrency(totalExpenses)}
        </p>
      </Card>

      {/* Loading */}
      {loading && (
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600" />
          </div>
        </Card>
      )}

      {/* Expenses List */}
      {!loading && <ExpenseList expenses={expenses} />}
    </div>
  )
}
