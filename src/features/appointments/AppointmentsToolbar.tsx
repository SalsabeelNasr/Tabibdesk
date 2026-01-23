"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { RiSearchLine, RiAddLine, RiCalendarLine, RiListCheck } from "@remixicon/react"
import Link from "next/link"

interface AppointmentsToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  timeFilter: "upcoming" | "past" | "all"
  onTimeFilterChange: (filter: "upcoming" | "past" | "all") => void
  viewMode: "list" | "calendar"
  onViewModeChange: (mode: "list" | "calendar") => void
  totalAppointments: number
  filteredCount?: number
}

export function AppointmentsToolbar({
  searchQuery,
  onSearchChange,
  timeFilter,
  onTimeFilterChange,
  viewMode,
  onViewModeChange,
  totalAppointments,
  filteredCount,
}: AppointmentsToolbarProps) {
  return (
    <div className="space-y-3">
      {/* Top Row: View Toggle and Add New Button */}
      <div className="flex items-center justify-between gap-3">
        {/* View Mode Toggle */}
        <div className="flex shrink-0 items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          <button
            onClick={() => onViewModeChange("list")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              viewMode === "list"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-gray-50"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            }`}
          >
            <RiListCheck className="size-4" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            onClick={() => onViewModeChange("calendar")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              viewMode === "calendar"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-gray-50"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            }`}
          >
            <RiCalendarLine className="size-4" />
            <span className="hidden sm:inline">Calendar</span>
          </button>
        </div>

        {/* New Appointment Button */}
        <Link href="/appointments/book" className="flex-shrink-0">
          <Button>
            <RiAddLine className="mr-2 size-4" />
            New Appointment
          </Button>
        </Link>
      </div>

      {/* Bottom Row: Search and Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <RiSearchLine className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by patient name, phone, or type..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Time Filter */}
        <select
          value={timeFilter}
          onChange={(e) => onTimeFilterChange(e.target.value as "upcoming" | "past" | "all")}
          className="flex-shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
        >
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="all">All Appointments</option>
        </select>
      </div>

      {/* Result Count (below the rows) */}
      {searchQuery && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredCount !== undefined
            ? `${filteredCount} appointment${filteredCount !== 1 ? "s" : ""} found`
            : `${totalAppointments} total appointment${totalAppointments !== 1 ? "s" : ""}`}
        </p>
      )}
    </div>
  )
}
