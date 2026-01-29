"use client"

import { useEffect, useState, useMemo } from "react"
import { Select } from "@/components/Select"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { listDoctorsByClinic } from "../availability.api"
import { DEMO_DOCTOR_ID } from "@/data/mock/mock-data"

/** Doctor dropdown for page header (top right), used in Appointments page like Insights time-range dropdown */
export interface DoctorSelectorProps {
  clinicId: string
  selectedDoctorId: string
  onDoctorChange: (doctorId: string) => void
  className?: string
}

export function DoctorSelector({
  clinicId,
  selectedDoctorId,
  onDoctorChange,
  className,
}: DoctorSelectorProps) {
  const { currentUser, allUsers } = useUserClinic()
  const [doctorsAtClinic, setDoctorsAtClinic] = useState<string[]>([])
  const [loadingDoctors, setLoadingDoctors] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true)
      try {
        const doctorIds = await listDoctorsByClinic(clinicId)
        setDoctorsAtClinic(doctorIds)
      } catch (error) {
        console.error("Failed to fetch doctors for clinic:", error)
        setDoctorsAtClinic([])
      } finally {
        setLoadingDoctors(false)
      }
    }
    if (clinicId) fetchDoctors()
  }, [clinicId])

  const availableDoctors = useMemo(() => {
    return allUsers.filter(
      (user) => user.role === "doctor" && doctorsAtClinic.includes(user.id)
    )
  }, [allUsers, doctorsAtClinic])

  useEffect(() => {
    if (!loadingDoctors && availableDoctors.length > 0) {
      const isSelectedDoctorAvailable = availableDoctors.some(
        (doc) => doc.id === selectedDoctorId
      )
      if (!isSelectedDoctorAvailable) {
        if (currentUser.role === "doctor" && doctorsAtClinic.includes(currentUser.id)) {
          onDoctorChange(currentUser.id)
        } else {
          onDoctorChange(availableDoctors[0].id)
        }
      }
    }
  }, [clinicId, availableDoctors, selectedDoctorId, loadingDoctors, currentUser, doctorsAtClinic, onDoctorChange])

  const show = currentUser.role !== "doctor" || availableDoctors.length > 1
  if (!show) return null

  if (loadingDoctors) {
    return <span className={className ?? "text-sm text-gray-500 dark:text-gray-400"}>Loading...</span>
  }
  if (availableDoctors.length === 0) {
    return <span className={className ?? "text-sm text-gray-500 dark:text-gray-400"}>No doctors</span>
  }

  return (
    <Select
      id="doctor-select"
      value={selectedDoctorId || availableDoctors[0]?.id || DEMO_DOCTOR_ID}
      onChange={(e) => onDoctorChange(e.target.value)}
      className={className ?? "w-40 sm:w-48"}
    >
      {availableDoctors.map((doctor) => (
        <option key={doctor.id} value={doctor.id}>
          {doctor.full_name} {doctor.specialization ? `– ${doctor.specialization}` : ""}
        </option>
      ))}
    </Select>
  )
}

interface AppointmentsHeaderProps {
  activeTab: "appointments" | "waitlist"
  onTabChange: (tab: "appointments" | "waitlist") => void
}

export function AppointmentsHeader({
  activeTab,
  onTabChange,
}: AppointmentsHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="border-b border-gray-200 dark:border-gray-800">
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
      </div>
    </div>
  )
}
