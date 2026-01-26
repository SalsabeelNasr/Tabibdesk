"use client"

import { useState, useEffect, useMemo } from "react"
import { Badge } from "@/components/Badge"
import { RiCalendarLine, RiTimeLine, RiHistoryLine } from "@remixicon/react"
import { format } from "date-fns"
import { cx } from "@/lib/utils"
import { getStatusBadgeVariant, getStatusLabel } from "@/features/appointments/appointments.utils"

interface Appointment {
  id: string
  patient_id: string
  patient_name: string
  scheduled_at: string
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show"
  type: string
  notes: string | null
  created_at: string
  online_call_link?: string
}

interface PatientHistoryTabProps {
  clinicId: string
  patientId: string
  appointments: Appointment[]
}

type HistoryItem = {
  id: string
  type: "activity" | "appointment"
  date: Date
  data: any
}

export function PatientHistoryTab({ clinicId, patientId, appointments }: PatientHistoryTabProps) {
  const [activityEvents, setActivityEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { listActivities } = await import("@/api/activity.api")
        const response = await listActivities({
          clinicId,
          entityId: patientId,
          entityType: "patient",
          pageSize: 50,
        })
        setActivityEvents(response.events)
      } catch (error) {
        console.error("Failed to fetch activity feed:", error)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [clinicId, patientId])

  // Combine and sort all history items
  const historyItems = useMemo(() => {
    const items: HistoryItem[] = []

    // Add activity events
    activityEvents.forEach((event) => {
      items.push({
        id: event.id,
        type: "activity",
        date: new Date(event.createdAt),
        data: event,
      })
    })

    // Add appointments (only past/completed ones for history)
    appointments
      .filter((apt) => {
        const aptDate = new Date(apt.scheduled_at)
        const now = new Date()
        // Include past appointments or completed ones
        return aptDate < now || apt.status === "completed" || apt.status === "cancelled" || apt.status === "no_show"
      })
      .forEach((apt) => {
        items.push({
          id: apt.id,
          type: "appointment",
          date: new Date(apt.scheduled_at),
          data: apt,
        })
      })

    // Sort by date (newest first)
    return items.sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [activityEvents, appointments])

  if (loading && historyItems.length === 0) {
    return (
      <div className="space-y-3">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
        Patient History
      </h3>

      {historyItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
          <RiHistoryLine className="size-8 text-gray-300" />
          <p className="mt-2 text-xs text-gray-500">No history recorded for this patient.</p>
        </div>
      ) : (
        <div className="relative space-y-4">
          {/* Vertical line */}
          <div className="absolute left-2.5 top-0 h-full w-px bg-gray-100 dark:bg-gray-800" />

          {historyItems.map((item) => (
            <div key={item.id} className="relative pl-8">
              {/* Dot */}
              <div className="absolute left-0 top-1.5 size-5 rounded-full bg-white ring-2 ring-gray-100 dark:bg-gray-950 dark:ring-gray-800 flex items-center justify-center">
                <div
                  className={cx(
                    "size-2 rounded-full",
                    item.type === "appointment"
                      ? item.data.status === "completed"
                        ? "bg-green-500"
                        : item.data.status === "cancelled" || item.data.status === "no_show"
                        ? "bg-red-500"
                        : "bg-blue-500"
                      : item.data.action === "create"
                      ? "bg-green-500"
                      : item.data.action === "delete"
                      ? "bg-red-500"
                      : "bg-primary-500"
                  )}
                />
              </div>

              <div className="space-y-1">
                {item.type === "appointment" ? (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <RiCalendarLine className="size-4 text-gray-400 shrink-0" />
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Appointment - {item.data.type}
                          </p>
                          <Badge variant={getStatusBadgeVariant(item.data.status)} className="text-xs">
                            {getStatusLabel(item.data.status)}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                          {format(item.date, "MMM d, yyyy 'at' h:mm a")}
                        </p>
                        {item.data.notes && (
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{item.data.notes}</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{item.data.actorName}</span>
                      {" "}{item.data.message}
                    </p>
                  </>
                )}
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <RiTimeLine className="size-3" />
                  {format(item.date, "MMM d, h:mm a")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
