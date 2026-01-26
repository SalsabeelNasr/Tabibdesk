"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { RiSearchLine, RiAddLine } from "@remixicon/react"
import type { TaskSource, TaskStatus } from "./tasks.types"

interface TasksToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onNewTask: () => void
}

export function TasksToolbar({
  searchQuery,
  onSearchChange,
  onNewTask,
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

        {/* New Task Button */}
        <Button onClick={onNewTask} className="flex-shrink-0 md:h-9 md:py-1.5 md:text-sm">
          <RiAddLine className="hidden sm:block sm:mr-2 size-4" />
          <span className="hidden sm:inline">New Task</span>
          <span className="sm:hidden">+</span>
        </Button>
      </div>
    </div>
  )
}
