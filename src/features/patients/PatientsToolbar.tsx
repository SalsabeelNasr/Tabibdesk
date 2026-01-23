"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { RiSearchLine, RiUserAddLine, RiTableLine, RiLayoutGridLine } from "@remixicon/react"
import type { PatientStatus } from "./patients.types"

interface PatientsToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddPatient: () => void
  totalPatients: number
  filteredCount?: number
  viewMode: "table" | "cards"
  onViewModeChange: (mode: "table" | "cards") => void
  statusFilter?: PatientStatus | "all"
  onStatusFilterChange?: (status: PatientStatus | "all") => void
  role?: "doctor" | "assistant" | "manager"
}

export function PatientsToolbar({
  searchQuery,
  onSearchChange,
  onAddPatient,
  totalPatients,
  filteredCount,
  viewMode,
  onViewModeChange,
  statusFilter = "all",
  onStatusFilterChange,
  role = "doctor",
}: PatientsToolbarProps) {
  return (
    <div className="space-y-3">
      {/* Top Row: View Toggle and Add New Button */}
      <div className="flex items-center justify-between gap-3">
        {/* View Mode Toggle */}
        <div className="flex shrink-0 items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          <button
            onClick={() => onViewModeChange("table")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              viewMode === "table"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-gray-50"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            }`}
          >
            <RiTableLine className="size-4" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            onClick={() => onViewModeChange("cards")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              viewMode === "cards"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-gray-50"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            }`}
          >
            <RiLayoutGridLine className="size-4" />
            <span className="hidden sm:inline">Cards</span>
          </button>
        </div>

        {/* Add Patient Button */}
        <Button variant="primary" onClick={onAddPatient} className="flex-shrink-0">
          <RiUserAddLine className="mr-2 size-4" />
          Add Patient
        </Button>
      </div>

      {/* Status Filter Tabs */}
      {onStatusFilterChange && (
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => onStatusFilterChange("all")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === "all"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => onStatusFilterChange("active")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === "active"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => onStatusFilterChange("inactive")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === "inactive"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            }`}
          >
            Inactive
          </button>
        </div>
      )}

      {/* Bottom Row: Search */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <RiSearchLine className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by name, phone, email, complaint, or job..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Result Count (below the rows) */}
      {searchQuery && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredCount !== undefined
            ? `${filteredCount} patient${filteredCount !== 1 ? "s" : ""} found`
            : `${totalPatients} total patient${totalPatients !== 1 ? "s" : ""}`}
        </p>
      )}
    </div>
  )
}
