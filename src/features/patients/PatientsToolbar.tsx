"use client"

import { Input } from "@/components/Input"
import { RiSearchLine } from "@remixicon/react"

interface PatientsToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  totalPatients: number
  filteredCount?: number
}

export function PatientsToolbar({
  searchQuery,
  onSearchChange,
  totalPatients,
  filteredCount,
}: PatientsToolbarProps) {
  return (
    <div className="space-y-3">
      {/* Search */}
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
