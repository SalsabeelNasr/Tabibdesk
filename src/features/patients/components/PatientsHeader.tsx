"use client"

interface PatientsHeaderProps {
  activeTab: "active" | "inactive"
  onTabChange: (tab: "active" | "inactive") => void
}

export function PatientsHeader({
  activeTab,
  onTabChange,
}: PatientsHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="border-b border-gray-200 dark:border-gray-800">
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
      </div>
    </div>
  )
}
