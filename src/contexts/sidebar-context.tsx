"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface SidebarContextType {
  isCollapsed: boolean
  toggleSidebar: () => void
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

const SIDEBAR_STORAGE_KEY = "tabibdesk-sidebar-collapsed"

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
      if (stored !== null) {
        setIsCollapsed(stored === "true")
      }
    } catch (error) {
      // localStorage might not be available (SSR)
      console.warn("Failed to load sidebar state from localStorage:", error)
    }
  }, [])

  // Save to localStorage when changed
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed))
      } catch (error) {
        // localStorage might not be available
        console.warn("Failed to save sidebar state to localStorage:", error)
      }
    }
  }, [isCollapsed, mounted])

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev)
  }

  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
  }

  // Always provide the context, even before mounting
  // This prevents the "must be used within a SidebarProvider" error
  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
