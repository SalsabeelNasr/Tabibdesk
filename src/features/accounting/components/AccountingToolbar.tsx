"use client"

import React, { useEffect } from "react"
import { Input } from "@/components/Input"
import { useDebounce } from "@/lib/useDebounce"
import { RiSearchLine, RiFilterLine } from "@remixicon/react"

export type DateRangePreset = "today" | "7days" | "30days" | "90days" | "thismonth" | "custom" | "all"

export interface AccountingToolbarProps {
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  showFilters?: boolean
  onFiltersToggle?: () => void
}

export function AccountingToolbar({
  searchQuery,
  onSearchQueryChange,
  showFilters = false,
  onFiltersToggle,
}: AccountingToolbarProps) {
  const debouncedSearch = useDebounce(searchQuery, 250)

  // Update parent when debounced search changes
  useEffect(() => {
    onSearchQueryChange(debouncedSearch)
  }, [debouncedSearch, onSearchQueryChange])

  return (
    <div className="flex flex-col gap-3">
      {/* Search Bar */}
      <div className="flex-1 min-w-0">
        <div className="relative">
          <RiSearchLine className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
      </div>

      {/* Filters Button (for mobile) */}
      {onFiltersToggle && (
        <button
          onClick={onFiltersToggle}
          className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition sm:hidden ${
            showFilters
              ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/20 dark:text-primary-400"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          <RiFilterLine className="size-4" />
          Filters
        </button>
      )}
    </div>
  )
}
