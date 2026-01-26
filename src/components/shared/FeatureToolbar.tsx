"use client"

import React from "react"
import { Input } from "@/components/Input"
import { RiSearchLine } from "@remixicon/react"
import { cx } from "@/lib/utils"

interface FeatureToolbarProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  searchPlaceholder?: string
  children?: React.ReactNode
  className?: string
}

/**
 * A unified, responsive toolbar for feature pages.
 * Follows the dense design language and provides a consistent
 * layout for search and filters across the application.
 */
export function FeatureToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  children,
  className,
}: FeatureToolbarProps) {
  return (
    <div className={cx(
      "flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900/50 md:flex-row md:items-center md:justify-between",
      className
    )}>
      {/* Search Area - Primary on mobile */}
      {onSearchChange !== undefined && (
        <div className="relative flex-1 min-w-0 max-w-lg">
          <RiSearchLine className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 text-sm border-gray-200 bg-gray-50/50 focus:border-primary-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800/50 dark:focus:bg-gray-900 w-full transition-colors rounded-lg"
          />
        </div>
      )}

      {/* Filters/Actions Area */}
      {children && (
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {children}
        </div>
      )}
    </div>
  )
}
