"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/PageHeader"
import { Select } from "@/components/Select"
import { ArchiveToolbar } from "./components/ArchiveToolbar"
import { ArchivedAppointmentsTab } from "./tabs/ArchivedAppointmentsTab"
import { ArchivedTasksTab } from "./tabs/ArchivedTasksTab"
import { ArchivedActivityTab } from "./tabs/ArchivedActivityTab"
import type { DateRangePreset } from "./archive.types"
import { DateRange } from "react-day-picker"

interface ArchivePageProps {
  clinicId: string
}

export function ArchivePage({ clinicId }: ArchivePageProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabParam = searchParams.get("tab")
  const initialTab = (tabParam === "tasks" || tabParam === "activity" ? tabParam : "appointments") as "appointments" | "tasks" | "activity"
  
  const [activeTab, setActiveTab] = useState<"appointments" | "tasks" | "activity">(initialTab)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>("30")
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined)

  // Sync tab with URL param
  useEffect(() => {
    if (tabParam && (tabParam === "tasks" || tabParam === "activity" || tabParam === "appointments")) {
      setActiveTab(tabParam as "appointments" | "tasks" | "activity")
    }
  }, [tabParam])

  const handleTabChange = (tab: "appointments" | "tasks" | "activity") => {
    setActiveTab(tab)
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    router.push(`/archive?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="page-content">
      <PageHeader
        title="Archive"
        actions={
          <Select
            id="date-range"
            value={dateRangePreset}
            onChange={(e) => setDateRangePreset(e.target.value as DateRangePreset)}
            className="w-32"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="custom">Custom range</option>
          </Select>
        }
      />

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange("appointments")}
            className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "appointments"
                ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => handleTabChange("tasks")}
            className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "tasks"
                ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => handleTabChange("activity")}
            className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "activity"
                ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Activity
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === "appointments" ? (
        <ArchivedAppointmentsTab
          clinicId={clinicId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateRangePreset={dateRangePreset}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
        />
      ) : activeTab === "tasks" ? (
        <ArchivedTasksTab
          clinicId={clinicId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateRangePreset={dateRangePreset}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
        />
      ) : (
        <ArchivedActivityTab
          clinicId={clinicId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateRangePreset={dateRangePreset}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
        />
      )}
    </div>
  )
}
