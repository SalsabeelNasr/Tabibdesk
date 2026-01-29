"use client"

import { Button } from "@/components/Button"
import { SearchInput } from "@/components/SearchInput"
import { RiUserAddLine } from "@remixicon/react"

interface PatientsToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  totalPatients: number
  filteredCount?: number
  onAddPatient?: () => void
}

export function PatientsToolbar({
  searchQuery,
  onSearchChange,
  totalPatients,
  filteredCount,
  onAddPatient,
}: PatientsToolbarProps) {
  return (
    <div className="space-y-3">
      {/* Search + Add Patient */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <SearchInput
          placeholder="Search by name, phone, email, complaint, or job..."
          value={searchQuery}
          onSearchChange={onSearchChange}
          className="flex-1 min-w-0"
        />
        {onAddPatient && (
          <Button
            onClick={onAddPatient}
            variant="secondary"
            className="shrink-0"
          >
            <RiUserAddLine className="mr-2 size-4" />
            Add Patient
          </Button>
        )}
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
