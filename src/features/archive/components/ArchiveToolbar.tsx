"use client"

import { DateRangePicker } from "@/components/DatePicker"
import { FeatureToolbar } from "@/components/shared/FeatureToolbar"
import type { DateRange } from "react-day-picker"
import type { DateRangePreset } from "../archive.types"

interface ArchiveToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  dateRangePreset: DateRangePreset
  customDateRange: DateRange | undefined
  onCustomDateRangeChange: (range: DateRange | undefined) => void
  searchPlaceholder?: string
  children?: React.ReactNode // For essential status filters
}

export function ArchiveToolbar({
  searchQuery,
  onSearchChange,
  dateRangePreset,
  customDateRange,
  onCustomDateRangeChange,
  searchPlaceholder = "Search archived items...",
  children,
}: ArchiveToolbarProps) {
  const showCustomDatePicker = dateRangePreset === "custom"

  return (
    <FeatureToolbar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={searchPlaceholder}
    >
      <div className="flex flex-wrap items-center gap-2">
        {/* Essential Status Filters */}
        {children}

        {/* Custom Date Range Picker */}
        {showCustomDatePicker && (
          <DateRangePicker
            value={customDateRange}
            onChange={onCustomDateRangeChange}
            className="w-full sm:w-fit"
            align="end"
          />
        )}
      </div>
    </FeatureToolbar>
  )
}
