"use client"

import { Badge } from "@/components/Badge"
import { DropdownUserProfile } from "@/components/shell/navigation/DropdownUserProfile"
import { Select } from "@/components/Select"
import { Tooltip } from "@/components/Tooltip"
import { cx, focusRing } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { useFeatures } from "@/features/settings/useFeatures"
import {
  getNavigationForRole,
  isActiveRoute,
  type Role,
} from "@/lib/navigation"
import {
  RiArrowDownSLine,
  RiUser3Line,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
} from "@remixicon/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import MobileSidebar from "./navigation/MobileSidebar"

interface SidebarProps {
  role: Role
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const navigation = getNavigationForRole(role)
  const { currentUser, currentClinic, allClinics, setCurrentClinic } = useUserClinic()
  const { effective } = useFeatures()
  const roleLabel = 
    currentUser.role === "doctor" ? "طبيب" : 
    currentUser.role === "manager" ? "مدير" : 
    "مساعد"
  const { isCollapsed, toggleSidebar } = useSidebar()

  // Filter navigation based on feature flags
  const filteredNavigation = navigation.filter((item) => {
    // If item has no featureKey, always show it (e.g., Dashboard, Settings)
    if (!item.featureKey) return true
    // Only show if feature is enabled
    return effective[item.featureKey] === true
  })

  return (
    <>
      {/* Desktop Sidebar - TailAdmin style (collapsible) */}
      <aside
        className={cx(
          "fixed start-0 top-0 z-50 hidden h-screen flex-col border-e border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:flex",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Expand/Collapse Button Section */}
        <div
          className={cx(
            "flex h-16 items-center border-b border-gray-200 dark:border-gray-800",
            isCollapsed ? "justify-center px-2" : "px-6"
          )}
        >
          <button
            onClick={toggleSidebar}
            className={cx(
              "flex size-9 items-center justify-center rounded-lg transition-colors",
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
        </div>

        {/* Navigation Section */}
        <nav
          className={cx(
            "flex-1 overflow-y-auto py-6",
            isCollapsed ? "px-2" : "px-4"
          )}
          aria-label="Sidebar navigation"
        >
          <ul className="space-y-1">
            {/* Logo as first navigation item */}
            <li>
              {(() => {
                const logoActive = pathname === "/"
                const logoContent = (
                  <Link
                    href="/"
                    className={cx(
                      "group flex items-center rounded-lg text-sm font-medium transition-colors",
                      isCollapsed ? "justify-center px-3 py-2.5" : "gap-3 px-3 py-2.5",
                      logoActive
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50",
                      focusRing
                    )}
                    aria-current={logoActive ? "page" : undefined}
                  >
                    <div className="flex size-5 shrink-0 items-center justify-center rounded bg-primary-600 dark:bg-primary-500" aria-hidden="true">
                      <span className="text-xs font-bold text-white">TD</span>
                    </div>
                    {!isCollapsed && (
                      <span className="flex-1">TabibDesk</span>
                    )}
                  </Link>
                )
                return isCollapsed ? (
                  <Tooltip content="TabibDesk" side="right">
                    {logoContent}
                  </Tooltip>
                ) : (
                  logoContent
                )
              })()}
            </li>
            {filteredNavigation.map((item) => {
              const active = isActiveRoute(item.href, pathname)

              const linkContent = (
                <Link
                  href={item.href}
                  className={cx(
                    "group flex items-center rounded-lg text-sm font-medium transition-colors",
                    isCollapsed ? "justify-center px-3 py-2.5" : "gap-3 px-3 py-2.5",
                    active
                      ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50",
                    focusRing
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <item.icon className="size-5 shrink-0" aria-hidden="true" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.badge && item.badge > 0 && (
                        <Badge variant="count" className="ms-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              )

              return (
                <li key={item.name}>
                  {isCollapsed ? (
                    <Tooltip content={item.name} side="right">
                      {linkContent}
                    </Tooltip>
                  ) : (
                    linkContent
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Section - Clinic Switcher & User Menu */}
        <div
          className={cx(
            "border-t border-gray-200 dark:border-gray-800",
            isCollapsed ? "p-2" : "p-4"
          )}
        >
          {!isCollapsed && (
            <>
              {/* Clinic Switcher */}
              <div className="mb-3">
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  العيادة
                </label>
                <div className="relative">
                  <Select
                    value={currentClinic.id}
                    onChange={(e) => setCurrentClinic(e.target.value)}
                    className="w-full appearance-none pe-8 text-sm"
                  >
                    {allClinics.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </option>
                    ))}
                  </Select>
                  <RiArrowDownSLine
                    className="pointer-events-none absolute end-2 top-1/2 size-4 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* User Profile */}
              {currentUser.role === "assistant" ? (
                <DropdownUserProfile>
                  <button
                    className={cx(
                      "flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-left transition-colors",
                      "hover:bg-gray-100 hover:border-gray-300",
                      "dark:border-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-800 dark:hover:border-gray-700",
                      focusRing
                    )}
                    aria-label="User settings"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                      {currentUser.avatar_initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                        {currentUser.full_name}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {roleLabel}
                      </p>
                    </div>
                    <RiUser3Line className="size-4 shrink-0 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                  </button>
                </DropdownUserProfile>
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                    {currentUser.avatar_initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                      {currentUser.full_name}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {roleLabel}
                    </p>
                  </div>
                  <DropdownUserProfile>
                    <button
                      className={cx(
                        "flex size-8 items-center justify-center rounded-md transition-colors",
                        "text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50",
                        focusRing
                      )}
                      aria-label="User settings"
                    >
                      <RiUser3Line className="size-4" aria-hidden="true" />
                    </button>
                  </DropdownUserProfile>
                </div>
              )}
            </>
          )}

          {/* Collapsed: User Profile Icon Only */}
          {isCollapsed && (
            <div className="flex flex-col items-center gap-2">
              {currentUser.role === "assistant" ? (
                <DropdownUserProfile>
                  <Tooltip content={`${currentUser.full_name} - User settings`} side="right">
                    <button
                      className={cx(
                        "flex size-10 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700 transition-colors",
                        "hover:bg-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30",
                        focusRing
                      )}
                      aria-label="User settings"
                    >
                      {currentUser.avatar_initials}
                    </button>
                  </Tooltip>
                </DropdownUserProfile>
              ) : (
                <>
                  <Tooltip content={currentUser.full_name} side="right">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                      {currentUser.avatar_initials}
                    </div>
                  </Tooltip>
                  <DropdownUserProfile>
                    <Tooltip content="User settings" side="right">
                      <button
                        className={cx(
                          "flex size-8 items-center justify-center rounded-md transition-colors",
                          "text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50",
                          focusRing
                        )}
                        aria-label="User settings"
                      >
                        <RiUser3Line className="size-4" aria-hidden="true" />
                      </button>
                    </Tooltip>
                  </DropdownUserProfile>
                </>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile: Floating menu button */}
      <div className="fixed bottom-4 end-4 z-50 lg:hidden">
        <MobileSidebar role={role} />
      </div>
    </>
  )
}
