"use client"

import { useState } from "react"
import { cx } from "@/lib/utils"
import {
  RiAddLine,
  RiCloseLine,
  RiFileTextLine,
  RiCapsuleLine,
  RiTaskLine,
  RiAttachmentLine,
} from "@remixicon/react"

export interface Tab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface HorizontalTabNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  tabs: Tab[]
  // Action callbacks
  onAddNote?: () => void
  onAddMedication?: () => void
  onAddTask?: () => void
  onAddFile?: () => void
}

export function HorizontalTabNav({
  activeTab,
  onTabChange,
  tabs,
  onAddNote,
  onAddMedication,
  onAddTask,
  onAddFile,
}: HorizontalTabNavProps) {
  const [showActionsMenu, setShowActionsMenu] = useState(false)

  const actions = [
    {
      label: "Clinical Note",
      icon: RiFileTextLine,
      onClick: onAddNote,
    },
    {
      label: "Prescription",
      icon: RiCapsuleLine,
      onClick: onAddMedication,
    },
    {
      label: "Task",
      icon: RiTaskLine,
      onClick: onAddTask,
    },
    {
      label: "File",
      icon: RiAttachmentLine,
      onClick: onAddFile,
    },
  ]

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between">
        {/* Tabs */}
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cx(
                  "group inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                    : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-200"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={cx(
                    "size-5 shrink-0",
                    isActive
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-gray-500 group-hover:text-gray-700 dark:text-gray-500 dark:group-hover:text-gray-300"
                  )}
                />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Add Record Dropdown */}
        <div className="relative ml-4 shrink-0">
          <button
            onClick={() => setShowActionsMenu(!showActionsMenu)}
            className={cx(
              "inline-flex items-center justify-center rounded-lg border p-2 transition-colors",
              showActionsMenu
                ? "border-primary-600 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/20 dark:text-primary-400"
                : "border-primary-600 bg-primary-600 text-white hover:bg-primary-700 dark:border-primary-500 dark:bg-primary-500 dark:text-white dark:hover:bg-primary-600"
            )}
            aria-label="Add Record"
          >
            {showActionsMenu ? (
              <RiCloseLine className="size-5" />
            ) : (
              <RiAddLine className="size-5" />
            )}
          </button>

          {showActionsMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowActionsMenu(false)}
              />

              {/* Dropdown Menu */}
              <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950">
                <div className="p-1.5">
                  {actions.map((action, i) => {
                    const ActionIcon = action.icon
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setShowActionsMenu(false)
                          action.onClick?.()
                        }}
                        className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
                      >
                        <ActionIcon className="size-5 text-gray-500 transition-colors group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
                        <span>{action.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
