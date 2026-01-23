"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { RiSearchLine, RiAddLine } from "@remixicon/react"
import type { TaskStatus } from "./tasks.types"

interface TasksToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: TaskStatus | "all"
  onStatusFilterChange: (status: TaskStatus | "all") => void
  onNewTask: () => void
  totalTasks: number
  filteredCount?: number
}

export function TasksToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onNewTask,
  totalTasks,
  filteredCount,
}: TasksToolbarProps) {
  return (
    <div className="space-y-3">
      {/* Search and Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <RiSearchLine className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search tasks, patients, descriptions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as TaskStatus | "all")}
          className="flex-shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
        >
          <option value="pending">Active</option>
          <option value="done">Completed</option>
          <option value="all">All Tasks</option>
        </select>

        {/* New Task Button */}
        <Button onClick={onNewTask} className="flex-shrink-0">
          <RiAddLine className="mr-2 size-4" />
          New Task
        </Button>
      </div>
    </div>
  )
}
