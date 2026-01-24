"use client"

import MobileSidebar from "@/components/shell/navigation/MobileSidebar"

interface TopbarProps {
  role: "doctor" | "assistant" | "manager"
}

export function Topbar({ role }: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-start border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:hidden">
      {/* Mobile: Hamburger Menu Button */}
      <MobileSidebar role={role} />
    </header>
  )
}
