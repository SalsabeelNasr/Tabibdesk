"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/Button"
import { RiAddLine } from "@remixicon/react"
import { TodayCashierTab } from "./tabs/TodayCashierTab"
import { BalancesTab } from "./tabs/BalancesTab"
import { ExpensesTab } from "./tabs/ExpensesTab"
import { AiSummaryTab } from "./tabs/AiSummaryTab"
import { AddExpenseModal } from "./components/AddExpenseModal"

type AccountingTab = "today" | "balances" | "expenses" | "ai-summary"

export function AccountingPage() {
  const [activeTab, setActiveTab] = useState<AccountingTab>("today")
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)

  const handleExpenseAdded = () => {
    setShowAddExpenseModal(false)
    // Refresh will happen automatically via tab reloading
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Accounting"
        subtitle="Collect payments and track balances"
        actions={
          <Button
            variant="primary"
            onClick={() => setShowAddExpenseModal(true)}
          >
            <RiAddLine className="size-4" />
            Add Expense
          </Button>
        }
      />

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("today")}
            className={`${
              activeTab === "today"
                ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
            } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab("balances")}
            className={`${
              activeTab === "balances"
                ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
            } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
          >
            Balances
          </button>
          <button
            onClick={() => setActiveTab("expenses")}
            className={`${
              activeTab === "expenses"
                ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
            } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab("ai-summary")}
            className={`${
              activeTab === "ai-summary"
                ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
            } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
          >
            AI Summary
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "today" && <TodayCashierTab />}
        {activeTab === "balances" && <BalancesTab />}
        {activeTab === "expenses" && <ExpensesTab />}
        {activeTab === "ai-summary" && <AiSummaryTab />}
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        open={showAddExpenseModal}
        onOpenChange={setShowAddExpenseModal}
        onSuccess={handleExpenseAdded}
      />
    </div>
  )
}
