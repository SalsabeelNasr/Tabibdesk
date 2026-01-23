"use client"

import { Badge } from "@/components/Badge"
import MobileSidebar from "@/components/shell/navigation/MobileSidebar"
import { cx, focusRing } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"
import {
  RiBellLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiSearchLine,
} from "@remixicon/react"
import { useState } from "react"

interface TopbarProps {
  role: "doctor" | "assistant" | "manager"
}

export function Topbar({ role }: TopbarProps) {
  const roleLabel = 
    role === "doctor" ? "Doctor" : 
    role === "manager" ? "Manager" : 
    "Assistant"
  const [searchQuery, setSearchQuery] = useState("")
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:px-6">
      {/* Left side - Search and Mobile menu */}
      <div className="flex flex-1 items-center gap-4">
        {/* Mobile: Menu button */}
        <div className="lg:hidden">
          <MobileSidebar role={role} />
        </div>

        {/* Mobile: Logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <span className="flex aspect-square size-7 items-center justify-center rounded bg-primary-600 text-xs font-medium text-white dark:bg-primary-500">
            TD
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
            TabibDesk
          </span>
        </div>

        {/* Desktop: Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={cx(
            "hidden lg:flex size-9 items-center justify-center rounded-lg transition-colors",
            "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            "dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50",
            focusRing
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <RiMenuUnfoldLine className="size-5" />
          ) : (
            <RiMenuFoldLine className="size-5" />
          )}
        </button>

        {/* Desktop: Search bar - TailAdmin style */}
        <div className="hidden flex-1 max-w-md lg:block">
          <div className="relative">
            <RiSearchLine className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cx(
                "w-full rounded-lg border border-gray-300 bg-white py-2 ps-10 pe-4 text-sm",
                "placeholder:text-gray-400",
                "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder:text-gray-500",
                "dark:focus:border-primary-400",
                focusRing
              )}
            />
          </div>
        </div>
      </div>

      {/* Right side - Notifications */}
      <div className="flex items-center gap-3">
        {/* Notifications - Desktop only */}
        <button
          className={cx(
            "hidden lg:flex size-9 items-center justify-center rounded-lg transition-colors",
            "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            "dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50",
            focusRing
          )}
          aria-label="Notifications"
        >
          <RiBellLine className="size-5" />
        </button>

        {/* Role Badge - Mobile only */}
        <Badge
          variant="default"
          className={cx(
            "lg:hidden",
            "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
          )}
        >
          {roleLabel}
        </Badge>
      </div>
    </header>
  )
}
