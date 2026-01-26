"use client"

import { Button } from "@/components/Button"
import { RiUserAddLine } from "@remixicon/react"

interface PatientsHeaderProps {
  activeTab: "active" | "inactive"
  onTabChange: (tab: "active" | "inactive") => void
  onAddPatient: () => void
}

export function PatientsHeader({
  activeTab,
  onTabChange,
  onAddPatient,
}: PatientsHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Tabs Row */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          {/* Tabs and Add Button (mobile: inline, desktop: tabs only) */}
          <div className="flex items-center gap-2 sm:gap-0">
            <nav className="-mb-px flex space-x-4 sm:space-x-8">
              <button
                onClick={() => onTabChange("active")}
                className={`border-b-2 px-1 py-3 sm:py-4 text-sm font-medium transition-colors ${
                  activeTab === "active"
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Active Patients
              </button>
              <button
                onClick={() => onTabChange("inactive")}
                className={`border-b-2 px-1 py-3 sm:py-4 text-sm font-medium transition-colors ${
                  activeTab === "inactive"
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Inactive Patients
              </button>
            </nav>
            
            {/* Add Button on mobile: next to tabs */}
            <Button 
              variant="primary" 
              onClick={onAddPatient} 
              className="sm:hidden flex-shrink-0 ml-auto"
            >
              <span>+</span>
            </Button>
          </div>
          
          {/* Add Patient Button on desktop */}
          <div className="hidden sm:block pb-0">
            <Button 
              variant="primary" 
              onClick={onAddPatient} 
              className="flex-shrink-0"
            >
              <RiUserAddLine className="mr-2 size-4" />
              <span>Add Patient</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
