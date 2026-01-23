"use client"

import React from "react"
import { cx, focusRing } from "@/lib/utils"
import {
  getNavigationForRole,
  isActiveRoute,
  type Role,
} from "@/lib/navigation"
import { RiMenuLine, RiUser3Line } from "@remixicon/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/Button"
import { Badge } from "@/components/Badge"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerClose,
} from "@/components/Drawer"
import { DropdownUserProfile } from "./DropdownUserProfile"
import { useUserClinic } from "@/contexts/user-clinic-context"

interface MobileSidebarProps {
  role: Role
}

export default function MobileSidebar({ role }: MobileSidebarProps) {
  const pathname = usePathname()
  const navigation = getNavigationForRole(role)
  const { currentUser } = useUserClinic()
  const roleLabel = currentUser.role === "doctor" ? "طبيب" : "مساعد"

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            aria-label="Open menu"
            className="group flex items-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10"
          >
            <RiMenuLine
              className="size-6 shrink-0 sm:size-5"
              aria-hidden="true"
            />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-64">
          <DrawerHeader>
            <DrawerTitle>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary-600 dark:bg-primary-500">
                  <span className="text-sm font-bold text-white">TD</span>
                </div>
                <span className="text-lg font-semibold">TabibDesk</span>
              </div>
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="flex flex-col">
            <nav
              aria-label="Mobile navigation"
              className="flex flex-1 flex-col gap-y-4"
            >
              {/* Primary Navigation */}
              <ul role="list" className="space-y-0.5">
                {navigation.map((item) => {
                  const active = isActiveRoute(item.href, pathname)

                  return (
                    <li key={item.name}>
                      <DrawerClose asChild>
                        <Link
                          href={item.href}
                          className={cx(
                            active
                              ? "bg-gray-100 text-primary-600 dark:bg-gray-800 dark:text-primary-400"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50",
                            "flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                            focusRing
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          <div className="flex items-center gap-x-2.5">
                            <item.icon className="size-4 shrink-0" aria-hidden="true" />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && item.badge > 0 && (
                            <Badge variant="count">{item.badge}</Badge>
                          )}
                        </Link>
                      </DrawerClose>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* User Profile Section - For assistants, show at bottom */}
            {currentUser.role === "assistant" && (
              <div className="mt-auto border-t border-gray-200 pt-4 dark:border-gray-800">
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
              </div>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
