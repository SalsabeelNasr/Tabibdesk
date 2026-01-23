"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubMenu,
  DropdownMenuSubMenuContent,
  DropdownMenuSubMenuTrigger,
  DropdownMenuTrigger,
} from "@/components/Dropdown"
import {
  RiComputerLine,
  RiMoonLine,
  RiSunLine,
  RiFlaskLine,
  RiUserSettingsLine,
} from "@remixicon/react"
import { useTheme } from "next-themes"
import { useDemo } from "@/contexts/demo-context"
import { useUserClinic } from "@/contexts/user-clinic-context"
import * as React from "react"

export type DropdownUserProfileProps = {
  children: React.ReactNode
  align?: "center" | "start" | "end"
}

export function DropdownUserProfile({
  children,
  align = "start",
}: DropdownUserProfileProps) {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const { isDemoMode, enableDemoMode, disableDemoMode } = useDemo()
  const { currentUser, allUsers, setCurrentUser } = useUserClinic()
  
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align={align}>
          <DropdownMenuLabel>{currentUser.email}</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuSubMenu>
              <DropdownMenuSubMenuTrigger>
                <RiUserSettingsLine
                  className="size-4 shrink-0"
                  aria-hidden="true"
                />
                Switch User
              </DropdownMenuSubMenuTrigger>
              <DropdownMenuSubMenuContent>
                {allUsers.map((user) => (
                  <DropdownMenuItem
                    key={user.id}
                    onClick={() => {
                      if (user.id !== currentUser.id) {
                        setCurrentUser(user.id)
                      }
                    }}
                    className={user.id === currentUser.id ? "bg-gray-100 dark:bg-gray-800" : ""}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                        {user.avatar_initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.full_name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user.role === "doctor" ? "طبيب" : "مساعد"}
                          {user.specialization && ` - ${user.specialization}`}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubMenuContent>
            </DropdownMenuSubMenu>
            <DropdownMenuSubMenu>
              <DropdownMenuSubMenuTrigger>Theme</DropdownMenuSubMenuTrigger>
              <DropdownMenuSubMenuContent>
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={(value) => {
                    setTheme(value)
                  }}
                >
                  <DropdownMenuRadioItem
                    aria-label="Switch to Light Mode"
                    value="light"
                    iconType="check"
                  >
                    <RiSunLine className="size-4 shrink-0" aria-hidden="true" />
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    aria-label="Switch to Dark Mode"
                    value="dark"
                    iconType="check"
                  >
                    <RiMoonLine
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    Dark
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    aria-label="Switch to System Mode"
                    value="system"
                    iconType="check"
                  >
                    <RiComputerLine
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    System
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubMenuContent>
            </DropdownMenuSubMenu>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem 
              onClick={() => {
                if (isDemoMode) {
                  disableDemoMode()
                } else {
                  enableDemoMode()
                }
                // Reload to reflect demo mode changes
                window.location.reload()
              }}
            >
              <RiFlaskLine
                className="size-4 shrink-0"
                aria-hidden="true"
              />
              {isDemoMode ? "Disable Demo Mode" : "Enable Demo Mode"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
