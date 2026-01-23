"use client"

import { Card, CardContent } from "@/components/Card"
import { Badge } from "@/components/Badge"
import {
  RiCalendarLine,
  RiVideoLine,
} from "@remixicon/react"
import { getStatusBadgeVariant, getStatusLabel, formatAppointmentDate } from "@/features/appointments/appointments.utils"

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

interface AppointmentsTabProps {
  appointments: Appointment[]
}

export function AppointmentsTab({ appointments }: AppointmentsTabProps) {
  // Filter to show only booked appointments (exclude cancelled)
  const bookedAppointments = appointments.filter(
    (apt) => apt.status !== "cancelled"
  )

  // Sort appointments by date (newest first)
  const sortedAppointments = [...bookedAppointments].sort(
    (a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
  )

  const formatTime = (scheduledAt: string) => {
    return new Date(scheduledAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (sortedAppointments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <RiCalendarLine className="mx-auto size-12 text-gray-400" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">No appointments booked</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-50">
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-50">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-50">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
            {sortedAppointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-900 dark:text-gray-50">
                    <RiCalendarLine className="size-4 shrink-0 text-gray-500 dark:text-gray-400" />
                    <span>
                      {formatAppointmentDate(appointment.scheduled_at)} • {formatTime(appointment.scheduled_at)}
                    </span>
                  </div>
                  {appointment.online_call_link && (
                    <a
                      href={appointment.online_call_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center gap-1.5 text-sm text-primary-600 hover:underline dark:text-primary-400"
                    >
                      <RiVideoLine className="size-4 shrink-0" />
                      Join Online Call
                    </a>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-50">
                  {appointment.type}
                </td>
                <td className="px-4 py-4">
                  <Badge variant={getStatusBadgeVariant(appointment.status)}>
                    {getStatusLabel(appointment.status)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

