export type TaskType = "follow_up" | "appointment" | "labs" | "scan" | "billing" | "other"

export type TaskStatus = "pending" | "done" | "snoozed" | "cancelled"

export type TaskPriority = "low" | "normal" | "high"

export interface Task {
  id: string
  title: string
  description?: string
  type: TaskType
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  createdAt: string
  createdByUserId: string
  assignedToUserId?: string
  patientId?: string
  clinicId: string
}

export interface TaskListItem extends Task {
  patientName?: string
  assignedToName?: string
  createdByName?: string
}

export interface ListTasksParams {
  clinicId: string
  assignedToUserId?: string
  createdByUserId?: string
  status?: TaskStatus | "all"
  type?: TaskType | "all"
  priority?: TaskPriority | "all"
  query?: string
  page: number
  pageSize: number
}

export interface ListTasksResponse {
  tasks: TaskListItem[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface CreateTaskPayload {
  title: string
  description?: string
  type: TaskType
  priority?: TaskPriority
  dueDate?: string
  assignedToUserId?: string
  patientId?: string
  clinicId: string
  createdByUserId: string
}

export interface UpdateTaskStatusPayload {
  id: string
  status: TaskStatus
}

export interface AssignTaskPayload {
  id: string
  assignedToUserId?: string
}

export interface SnoozeTaskPayload {
  id: string
  nextDueDate: string
}
