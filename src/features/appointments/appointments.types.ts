export interface AppointmentListItem {
  id: string
  patient_id: string
  patient_name: string
  patient_phone: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  status: "scheduled" | "completed" | "cancelled" | "confirmed" | "in_progress" | "no_show" | "arrived"
  type: string
  online_call_link?: string
  scheduled_at: string
  notes: string | null
  created_at: string
  rescheduled?: boolean
  reschedule_count?: number
  original_scheduled_at?: string
}

export interface ListAppointmentsParams {
  clinicId?: string
  page: number
  pageSize: number
  query?: string
  status?: "all" | "scheduled" | "completed" | "cancelled" | "confirmed" | "in_progress" | "no_show" | "arrived"
  timeFilter?: "upcoming" | "past" | "all"
}

export interface ListAppointmentsResponse {
  appointments: AppointmentListItem[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
