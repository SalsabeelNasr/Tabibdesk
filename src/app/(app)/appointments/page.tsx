"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { Card, CardContent } from "@/components/Card"
import { Button } from "@/components/Button"
import { PageHeader } from "@/components/shared/PageHeader"
import { RiCalendarLine, RiAddLine } from "@remixicon/react"
import Link from "next/link"
import { useDemo } from "@/contexts/demo-context"
import { mockData } from "@/data/mock/mock-data"
import { ConfirmationModal } from "@/components/ConfirmationModal"
import { RescheduleModal } from "@/components/RescheduleModal"
import { AppointmentActionsModal } from "@/components/AppointmentActionsModal"
import { useDebounce } from "@/lib/useDebounce"
import { listAppointments } from "@/features/appointments/appointments.api"
import type { AppointmentListItem } from "@/features/appointments/appointments.types"
import { AppointmentsToolbar } from "@/features/appointments/AppointmentsToolbar"
import { AppointmentsTable } from "@/features/appointments/AppointmentsTable"
import { AppointmentsCards } from "@/features/appointments/AppointmentsCards"

// Lazy load the calendar component
const AppointmentCalendar = lazy(() => import("@/components/AppointmentCalendar").then(mod => ({ default: mod.AppointmentCalendar })))

const PAGE_SIZE = 10

export default function AppointmentsPage() {
  const { isDemoMode } = useDemo()
  const [appointments, setAppointments] = useState<AppointmentListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past" | "all">("upcoming")
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<AppointmentListItem | null>(null)
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentListItem | null>(null)

  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    setPage(1)
    fetchAppointments(1, debouncedSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, timeFilter, isDemoMode])

  const fetchAppointments = async (pageNum: number, query?: string) => {
    setLoading(true)
    try {
      const response = await listAppointments({
        page: pageNum,
        pageSize: PAGE_SIZE,
        query: query || undefined,
        status: "all",
        timeFilter: timeFilter,
      })
      if (pageNum === 1) {
        setAppointments(response.appointments)
      } else {
        setAppointments((prev) => [...prev, ...response.appointments])
      }
      setHasMore(response.hasMore)
      setTotal(response.total)
      setPage(pageNum)
    } catch (error) {
      console.error("Failed to fetch appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchAppointments(page + 1, debouncedSearch)
    }
  }

  const handleCancelClick = (appointmentId: string) => {
    setAppointmentToCancel(appointmentId)
    setShowCancelModal(true)
  }

  const handleCancelConfirm = async () => {
    if (!appointmentToCancel) return

    setIsCancelling(true)

    try {
      if (isDemoMode) {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        // Update appointment status in state
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentToCancel ? { ...apt, status: "cancelled" as const } : apt
          )
        )
        // Refresh the list
        await fetchAppointments(1, debouncedSearch)
      } else {
        // TODO: Actual API call to cancel appointment
        // await cancelAppointment(appointmentToCancel)
      }

      setShowCancelModal(false)
      setAppointmentToCancel(null)
    } catch (error) {
      console.error("Failed to cancel appointment:", error)
    } finally {
      setIsCancelling(false)
    }
  }

  const handleCancelModalClose = () => {
    if (!isCancelling) {
      setShowCancelModal(false)
      setAppointmentToCancel(null)
    }
  }

  const handleRescheduleClick = (appointment: AppointmentListItem) => {
    setAppointmentToReschedule(appointment)
    setShowRescheduleModal(true)
  }

  const handleRescheduleConfirm = async (appointmentId: string, newDate: string, newTime: string) => {
    setIsRescheduling(true)

    try {
      if (isDemoMode) {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        // Update appointment in state and propagate to mock data
        setAppointments((prev) => {
          const updated = prev.map((apt) =>
            apt.id === appointmentId
              ? { ...apt, appointment_date: newDate, appointment_time: newTime }
              : apt
          )
          
          // Update mock data source (mock uses scheduled_at, not appointment_date/time)
          const appointmentIndex = mockData.appointments.findIndex((a) => a.id === appointmentId)
          if (appointmentIndex !== -1) {
            const newScheduledAt = new Date(`${newDate}T${newTime}:00`).toISOString()
            mockData.appointments[appointmentIndex] = {
              ...mockData.appointments[appointmentIndex],
              scheduled_at: newScheduledAt,
            }
          }
          
          return updated
        })
        // Refresh the list
        await fetchAppointments(1, debouncedSearch)
      } else {
        // TODO: Actual API call to reschedule appointment
        // await rescheduleAppointment(appointmentId, newDate, newTime)
      }

      setShowRescheduleModal(false)
      setAppointmentToReschedule(null)
    } catch (error) {
      console.error("Failed to reschedule appointment:", error)
    } finally {
      setIsRescheduling(false)
    }
  }

  const handleRescheduleModalClose = () => {
    if (!isRescheduling) {
      setShowRescheduleModal(false)
      setAppointmentToReschedule(null)
    }
  }

  const filteredCount = searchQuery ? appointments.length : total

  // Transform appointments for calendar view
  const calendarAppointments = appointments.map((apt) => ({
    id: apt.id,
    patient_name: apt.patient_name,
    patient_phone: apt.patient_phone,
    date: apt.appointment_date,
    time: apt.appointment_time,
    status: apt.status as "scheduled" | "completed" | "cancelled" | "confirmed" | "in_progress" | "no_show",
    type: apt.type,
  }))

  return (
    <div className="space-y-6">
      {/* PageHeader */}
      <PageHeader
        title="Appointments"
      />

      <AppointmentsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalAppointments={total}
        filteredCount={filteredCount}
      />

      {/* Conditional Rendering Based on View Mode */}
      {viewMode === "calendar" ? (
        /* Calendar View */
        <Suspense fallback={
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto size-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600 dark:border-gray-800 dark:border-t-primary-400"></div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading calendar...</p>
            </div>
          </div>
        }>
          <AppointmentCalendar 
            appointments={calendarAppointments}
            onAppointmentClick={(calendarAppointment) => {
              const fullAppointment = appointments.find(apt => apt.id === calendarAppointment.id)
              if (fullAppointment) {
                setSelectedAppointment(fullAppointment)
                setShowActionsModal(true)
              }
            }}
          />
        </Suspense>
      ) : (
        /* List/Table View */
        <>
          {loading && appointments.length === 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"></div>
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <RiCalendarLine className="mx-auto size-12 text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {searchQuery
                    ? "No appointments found matching your filters."
                    : "No appointments scheduled yet."}
                </p>
                {!searchQuery && (
                  <Link href="/appointments/book">
                    <Button className="mt-4">
                      <RiAddLine className="mr-2 size-4" />
                      Schedule First Appointment
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <AppointmentsTable
                  appointments={appointments}
                  onReschedule={handleRescheduleClick}
                  onCancel={handleCancelClick}
                  onViewDetails={(appointment) => {
                    setSelectedAppointment(appointment)
                    setShowActionsModal(true)
                  }}
                />
              </div>
              {/* Mobile Cards View */}
              <div className="md:hidden">
                <AppointmentsCards
                  appointments={appointments}
                  onReschedule={handleRescheduleClick}
                  onCancel={handleCancelClick}
                />
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="secondary"
                    onClick={handleLoadMore}
                    disabled={loading}
                    isLoading={loading}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={handleCancelModalClose}
        onConfirm={handleCancelConfirm}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmText="Yes, Cancel"
        cancelText="Keep Appointment"
        variant="danger"
        isLoading={isCancelling}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={handleRescheduleModalClose}
        onConfirm={handleRescheduleConfirm}
        appointment={appointmentToReschedule ? {
          id: appointmentToReschedule.id,
          patient_id: appointmentToReschedule.patient_id,
          patient_name: appointmentToReschedule.patient_name,
          appointment_date: appointmentToReschedule.appointment_date,
          appointment_time: appointmentToReschedule.appointment_time,
          duration_minutes: appointmentToReschedule.duration_minutes,
          status: appointmentToReschedule.status,
          type: appointmentToReschedule.type,
        } : null}
        isLoading={isRescheduling}
      />

      {/* Appointment Actions Modal (from calendar) */}
      <AppointmentActionsModal
        isOpen={showActionsModal}
        onClose={() => {
          setShowActionsModal(false)
          setSelectedAppointment(null)
        }}
        appointment={selectedAppointment ? {
          id: selectedAppointment.id,
          patient_id: selectedAppointment.patient_id,
          patient_name: selectedAppointment.patient_name,
          patient_phone: selectedAppointment.patient_phone,
          appointment_date: selectedAppointment.appointment_date,
          appointment_time: selectedAppointment.appointment_time,
          duration_minutes: selectedAppointment.duration_minutes,
          status: selectedAppointment.status,
          type: selectedAppointment.type,
          online_call_link: selectedAppointment.online_call_link,
        } : null}
        onReschedule={() => {
          if (selectedAppointment) {
            handleRescheduleClick(selectedAppointment)
          }
        }}
        onCancel={() => {
          if (selectedAppointment) {
            handleCancelClick(selectedAppointment.id)
          }
        }}
      />
    </div>
  )
}
