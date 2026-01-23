import { mockData } from "@/data/mock/mock-data"
import type { ListAppointmentsParams, ListAppointmentsResponse, AppointmentListItem } from "./appointments.types"

// In-memory store for created/updated appointments (demo mode only)
let createdAppointments: AppointmentListItem[] = []

export function getCreatedAppointments(): AppointmentListItem[] {
  return createdAppointments
}

export async function listAppointments(params: ListAppointmentsParams): Promise<ListAppointmentsResponse> {
  const { page, pageSize, query, status, timeFilter } = params

  // Transform mock appointments to match AppointmentListItem format
  const allAppointments: AppointmentListItem[] = mockData.appointments.map((apt) => {
    const date = new Date(apt.scheduled_at)
    const patient = mockData.patients.find((p) => p.id === apt.patient_id)
    
    return {
      id: apt.id,
      patient_id: apt.patient_id,
      patient_name: apt.patient_name,
      patient_phone: patient?.phone || "",
      appointment_date: date.toISOString().split("T")[0],
      appointment_time: date.toTimeString().slice(0, 5),
      duration_minutes: 30, // Default duration
      status: apt.status,
      type: apt.type,
      scheduled_at: apt.scheduled_at,
      notes: apt.notes,
      created_at: apt.created_at,
    }
  })

  // Combine with created appointments
  const combinedAppointments = [...allAppointments, ...createdAppointments]

  // Filter by query if provided
  let filteredAppointments = combinedAppointments
  if (query && query.trim()) {
    const lowerQuery = query.toLowerCase().trim()
    filteredAppointments = combinedAppointments.filter((apt) => {
      const patientName = apt.patient_name.toLowerCase()
      const phone = apt.patient_phone.toLowerCase()
      const type = apt.type.toLowerCase()

      return (
        patientName.includes(lowerQuery) ||
        phone.includes(lowerQuery) ||
        type.includes(lowerQuery)
      )
    })
  }

  // Filter by status
  if (status && status !== "all") {
    filteredAppointments = filteredAppointments.filter((apt) => apt.status === status)
  }

  // Filter by time (upcoming/past)
  if (timeFilter && timeFilter !== "all") {
    const now = new Date()
    filteredAppointments = filteredAppointments.filter((apt) => {
      const appointmentDateTime = new Date(`${apt.appointment_date} ${apt.appointment_time}`)
      if (timeFilter === "upcoming") {
        return appointmentDateTime >= now
      } else if (timeFilter === "past") {
        return appointmentDateTime < now
      }
      return true
    })
  }

  // Sort by date and time (earliest first)
  filteredAppointments.sort((a, b) => {
    const dateA = new Date(`${a.appointment_date} ${a.appointment_time}`)
    const dateB = new Date(`${b.appointment_date} ${b.appointment_time}`)
    return dateA.getTime() - dateB.getTime()
  })

  // Paginate
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex)
  const total = filteredAppointments.length
  const hasMore = endIndex < total

  return {
    appointments: paginatedAppointments,
    total,
    page,
    pageSize,
    hasMore,
  }
}
