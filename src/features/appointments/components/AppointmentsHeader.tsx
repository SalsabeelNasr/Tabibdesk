"use client"

import { useEffect, useState, useMemo } from "react"
import { Select } from "@/components/Select"
import { Button } from "@/components/Button"
import { RiAddLine } from "@remixicon/react"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { listDoctorsByClinic } from "../availability.api"
import { DEMO_DOCTOR_ID } from "@/data/mock/mock-data"

interface AppointmentsHeaderProps {
  activeTab: "appointments" | "waitlist"
  onTabChange: (tab: "appointments" | "waitlist") => void
  clinicId: string
  selectedDoctorId: string
  onDoctorChange: (doctorId: string) => void
  onAddToWaitlist?: () => void
}

export function AppointmentsHeader({
  activeTab,
  onTabChange,
  clinicId,
  selectedDoctorId,
  onDoctorChange,
  onAddToWaitlist,
}: AppointmentsHeaderProps) {
  const { currentUser, allUsers } = useUserClinic()
  const [doctorsAtClinic, setDoctorsAtClinic] = useState<string[]>([])
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  
  // Fetch doctors who have availability at the selected clinic
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true)
      try {
        const doctorIds = await listDoctorsByClinic(clinicId)
        console.log(`Found ${doctorIds.length} doctors at clinic ${clinicId}:`, doctorIds)
        setDoctorsAtClinic(doctorIds)
      } catch (error) {
        console.error("Failed to fetch doctors for clinic:", error)
        setDoctorsAtClinic([])
      } finally {
        setLoadingDoctors(false)
      }
    }
    
    if (clinicId) {
      fetchDoctors()
    }
  }, [clinicId])
  
  // Filter doctors: only show those who have availability at the selected clinic
  const availableDoctors = useMemo(() => {
    return allUsers.filter(
      (user) => user.role === "doctor" && doctorsAtClinic.includes(user.id)
    )
  }, [allUsers, doctorsAtClinic])
  
  // Auto-select doctor when clinic changes or doctors load
  useEffect(() => {
    if (!loadingDoctors && availableDoctors.length > 0) {
      const isSelectedDoctorAvailable = availableDoctors.some(
        (doc) => doc.id === selectedDoctorId
      )
      
      if (!isSelectedDoctorAvailable) {
        // If current user is a doctor and they're available at this clinic, use them
        if (currentUser.role === "doctor" && doctorsAtClinic.includes(currentUser.id)) {
          onDoctorChange(currentUser.id)
        } else {
          // Otherwise, use the first available doctor
          onDoctorChange(availableDoctors[0].id)
        }
      }
    }
  }, [clinicId, availableDoctors, selectedDoctorId, loadingDoctors, currentUser, doctorsAtClinic, onDoctorChange])
  
  // Determine if we should show doctor selector
  // Show if: user is not a doctor OR user is a doctor but there are multiple doctors at this clinic
  const showDoctorSelector = currentUser.role !== "doctor" || availableDoctors.length > 1
  
  return (
    <div className="space-y-3">
      {/* Tabs Row with Doctor Selector */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          {/* Tabs and Add Button (mobile: inline, desktop: tabs only) */}
          <div className="flex items-center gap-2 sm:gap-0">
            <nav className="-mb-px flex space-x-4 sm:space-x-8">
              <button
                onClick={() => onTabChange("appointments")}
                className={`border-b-2 px-1 py-3 sm:py-4 text-sm font-medium ${
                  activeTab === "appointments"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:border-gray-300"
                }`}
              >
                Appointments
              </button>
              <button
                onClick={() => onTabChange("waitlist")}
                className={`border-b-2 px-1 py-3 sm:py-4 text-sm font-medium ${
                  activeTab === "waitlist"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:border-gray-300"
                }`}
              >
                Waitlist
              </button>
            </nav>
            
            {/* Add Button on mobile: next to tabs */}
            {activeTab === "waitlist" && onAddToWaitlist && (
              <Button 
                onClick={onAddToWaitlist} 
                variant="primary"
                className="sm:hidden flex-shrink-0 ml-auto"
              >
                <span>+</span>
              </Button>
            )}
          </div>
          
          {/* Right side: Add to Waitlist button (desktop) and Doctor Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pb-3 sm:pb-0">
            {/* Add Button on desktop: before doctor selector */}
            {activeTab === "waitlist" && onAddToWaitlist && (
              <Button 
                onClick={onAddToWaitlist} 
                variant="primary"
                className="hidden sm:flex flex-shrink-0"
              >
                <RiAddLine className="mr-2 size-4" />
                <span>Add to Waitlist</span>
              </Button>
            )}
            
            {/* Doctor Selector */}
            {showDoctorSelector && (
              <div className="flex items-center gap-2 my-2 sm:my-0">
                <label htmlFor="doctor-select" className="shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Doctor:
                </label>
                {loadingDoctors ? (
                  <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
                ) : availableDoctors.length > 0 ? (
                  <Select
                    id="doctor-select"
                    value={selectedDoctorId || availableDoctors[0]?.id || DEMO_DOCTOR_ID}
                    onChange={(e) => onDoctorChange(e.target.value)}
                    className="w-full sm:min-w-[200px]"
                  >
                    {availableDoctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.full_name} {doctor.specialization ? `- ${doctor.specialization}` : ""}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    No doctors available
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
