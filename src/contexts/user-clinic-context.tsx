"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import {
  mockUsers,
  mockClinics,
  DEFAULT_CURRENT_USER_ID,
  DEFAULT_CURRENT_CLINIC_ID,
  type MockUser,
  type MockClinic,
} from "@/data/mock/users-clinics"

interface UserClinicContextType {
  currentUser: MockUser
  currentClinic: MockClinic
  role: "doctor" | "assistant" | "manager"
  setCurrentUser: (userId: string) => void
  setCurrentClinic: (clinicId: string) => void
  allUsers: MockUser[]
  allClinics: MockClinic[]
}

const UserClinicContext = createContext<UserClinicContextType | undefined>(
  undefined
)

export function UserClinicProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentUserId, setCurrentUserId] = useState<string>(
    DEFAULT_CURRENT_USER_ID
  )
  const [currentClinicId, setCurrentClinicId] = useState<string>(
    DEFAULT_CURRENT_CLINIC_ID
  )

  // Load from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem("currentUserId")
    const savedClinicId = localStorage.getItem("currentClinicId")
    if (savedUserId) setCurrentUserId(savedUserId)
    if (savedClinicId) setCurrentClinicId(savedClinicId)
  }, [])

  const currentUser =
    mockUsers.find((u) => u.id === currentUserId) || mockUsers[0]
  const currentClinic =
    mockClinics.find((c) => c.id === currentClinicId) || mockClinics[0]

  const setCurrentUser = (userId: string) => {
    setCurrentUserId(userId)
    localStorage.setItem("currentUserId", userId)
    // Reload to reflect user change
    window.location.reload()
  }

  const setCurrentClinic = (clinicId: string) => {
    setCurrentClinicId(clinicId)
    localStorage.setItem("currentClinicId", clinicId)
  }

  return (
    <UserClinicContext.Provider
      value={{
        currentUser,
        currentClinic,
        role: currentUser.role,
        setCurrentUser,
        setCurrentClinic,
        allUsers: mockUsers,
        allClinics: mockClinics,
      }}
    >
      {children}
    </UserClinicContext.Provider>
  )
}

export function useUserClinic() {
  const context = useContext(UserClinicContext)
  if (context === undefined) {
    throw new Error("useUserClinic must be used within a UserClinicProvider")
  }
  return context
}
