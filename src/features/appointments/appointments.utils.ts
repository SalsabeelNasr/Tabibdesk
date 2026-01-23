import type { AppointmentListItem } from "./appointments.types"

export function getStatusBadgeVariant(
  status: AppointmentListItem["status"]
): "default" | "success" | "warning" | "error" | "neutral" {
  switch (status) {
    case "scheduled":
      return "default"
    case "confirmed":
      return "default"
    case "in_progress":
      return "warning"
    case "completed":
      return "success"
    case "cancelled":
      return "error"
    case "no_show":
      return "error"
    default:
      return "neutral"
  }
}

export function getStatusLabel(status: AppointmentListItem["status"]): string {
  switch (status) {
    case "scheduled":
      return "Scheduled"
    case "confirmed":
      return "Confirmed"
    case "in_progress":
      return "In Progress"
    case "completed":
      return "Completed"
    case "cancelled":
      return "Cancelled"
    case "no_show":
      return "No Show"
    default:
      return "Unknown"
  }
}

export function formatAppointmentDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatAppointmentTime(timeString: string): string {
  return timeString
}
