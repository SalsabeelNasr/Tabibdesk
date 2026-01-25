"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Select } from "@/components/Select"
import { IncomeTab } from "./tabs/IncomeTab"
import { ExpensesTab } from "./tabs/ExpensesTab"
import { DuesTab } from "./tabs/DuesTab"
import type { DateRangePreset } from "./components/AccountingToolbar"

type AccountingTab = "in" | "out" | "dues"

export function AccountingPage() {
  const [activeTab, setActiveTab] = useState<AccountingTab>("in")
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>("thismonth")

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <PageHeader title="Accounting" />

      {/* Tab Navigation with Date Range */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("in")}
              className={`${
                activeTab === "in"
                  ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
              } whitespace-nowrap border-b-2 px-2 sm:px-1 py-4 text-sm font-medium`}
            >
              IN
            </button>
            <button
              onClick={() => setActiveTab("out")}
              className={`${
                activeTab === "out"
                  ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
              } whitespace-nowrap border-b-2 px-2 sm:px-1 py-4 text-sm font-medium`}
            >
              OUT
            </button>
            <button
              onClick={() => setActiveTab("dues")}
              className={`${
                activeTab === "dues"
                  ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
              } whitespace-nowrap border-b-2 px-2 sm:px-1 py-4 text-sm font-medium`}
            >
              DUES
            </button>
          </nav>
          
          {/* Date Range Dropdown - Top Right */}
          <div className="pb-4 sm:pb-0">
            <Select
              value={dateRangePreset}
              onChange={(e) => setDateRangePreset(e.target.value as DateRangePreset)}
              className="w-full sm:w-auto sm:min-w-[160px]"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="thismonth">This month</option>
              <option value="all">All time</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4 sm:mt-6">
        {activeTab === "in" && <IncomeTab dateRangePreset={dateRangePreset} />}
        {activeTab === "out" && <ExpensesTab dateRangePreset={dateRangePreset} />}
        {activeTab === "dues" && <DuesTab dateRangePreset={dateRangePreset} />}
      </div>
    </div>
  )
}
