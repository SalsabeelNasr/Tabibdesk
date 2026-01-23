import { mockUsers } from "@/data/mock/users-clinics"
import { mockData } from "@/data/mock/mock-data"
import type {
  ListTasksParams,
  ListTasksResponse,
  Task,
  TaskListItem,
  CreateTaskPayload,
  UpdateTaskStatusPayload,
  AssignTaskPayload,
  SnoozeTaskPayload,
} from "./tasks.types"

// In-memory store for tasks (demo mode only)
let tasksStore: Task[] = []

// Initialize with some mock tasks
function initializeMockTasks() {
  if (tasksStore.length === 0) {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + 7)

    tasksStore = [
      {
        id: "task-001",
        title: "Follow up with patient Ahmed",
        description: "Check on recovery progress",
        type: "follow_up",
        status: "pending",
        priority: "high",
        dueDate: tomorrow.toISOString(),
        createdAt: now.toISOString(),
        createdByUserId: "user-001",
        assignedToUserId: "user-003",
        patientId: mockData.patients[0]?.id,
        clinicId: "clinic-001",
      },
      {
        id: "task-002",
        title: "Review lab results",
        description: "Patient Fatima - blood work results",
        type: "labs",
        status: "pending",
        priority: "normal",
        dueDate: nextWeek.toISOString(),
        createdAt: now.toISOString(),
        createdByUserId: "user-001",
        assignedToUserId: "user-001",
        patientId: mockData.patients[1]?.id,
        clinicId: "clinic-001",
      },
      {
        id: "task-003",
        title: "Schedule appointment",
        description: "Book follow-up for patient",
        type: "appointment",
        status: "pending",
        priority: "normal",
        dueDate: tomorrow.toISOString(),
        createdAt: now.toISOString(),
        createdByUserId: "user-001",
        assignedToUserId: "user-003",
        clinicId: "clinic-001",
      },
      {
        id: "task-004",
        title: "Process billing",
        description: "Invoice for last visit",
        type: "billing",
        status: "done",
        priority: "low",
        dueDate: now.toISOString(),
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdByUserId: "user-001",
        assignedToUserId: "user-003",
        clinicId: "clinic-001",
      },
      {
        id: "task-005",
        title: "Review scan results",
        description: "X-ray review needed",
        type: "scan",
        status: "snoozed",
        priority: "high",
        dueDate: nextWeek.toISOString(),
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdByUserId: "user-001",
        assignedToUserId: "user-001",
        clinicId: "clinic-001",
      },
    ]
  }
}

initializeMockTasks()

function enrichTaskWithNames(task: Task): TaskListItem {
  const patient = task.patientId ? mockData.patients.find((p) => p.id === task.patientId) : undefined
  const assignedTo = task.assignedToUserId ? mockUsers.find((u) => u.id === task.assignedToUserId) : undefined
  const createdBy = mockUsers.find((u) => u.id === task.createdByUserId)

  return {
    ...task,
    patientName: patient ? `${patient.first_name} ${patient.last_name}` : undefined,
    assignedToName: assignedTo?.full_name,
    createdByName: createdBy?.full_name,
  }
}

export async function listTasks(params: ListTasksParams): Promise<ListTasksResponse> {
  const { clinicId, assignedToUserId, createdByUserId, status, type, priority, query, page, pageSize } = params

  let filteredTasks = tasksStore.filter((task) => task.clinicId === clinicId)

  // Filter by assigned user
  if (assignedToUserId !== undefined) {
    if (assignedToUserId === null) {
      filteredTasks = filteredTasks.filter((task) => !task.assignedToUserId)
    } else {
      filteredTasks = filteredTasks.filter((task) => task.assignedToUserId === assignedToUserId)
    }
  }

  // Filter by created by user
  if (createdByUserId) {
    filteredTasks = filteredTasks.filter((task) => task.createdByUserId === createdByUserId)
  }

  // Filter by status
  if (status && status !== "all") {
    filteredTasks = filteredTasks.filter((task) => task.status === status)
  }

  // Filter by type
  if (type && type !== "all") {
    filteredTasks = filteredTasks.filter((task) => task.type === type)
  }

  // Filter by priority
  if (priority && priority !== "all") {
    filteredTasks = filteredTasks.filter((task) => task.priority === priority)
  }

  // Filter by query (search in title, description, patient name)
  if (query && query.trim()) {
    const lowerQuery = query.toLowerCase().trim()
    filteredTasks = filteredTasks.filter((task) => {
      const titleMatch = task.title.toLowerCase().includes(lowerQuery)
      const descriptionMatch = task.description?.toLowerCase().includes(lowerQuery) || false
      const patient = task.patientId ? mockData.patients.find((p) => p.id === task.patientId) : undefined
      const patientNameMatch = patient
        ? `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(lowerQuery)
        : false

      return titleMatch || descriptionMatch || patientNameMatch
    })
  }

  // Sort by due date (overdue first, then by date), then by priority
  filteredTasks.sort((a, b) => {
    // Overdue tasks first
    const aOverdue = a.dueDate ? new Date(a.dueDate) < new Date() && a.status === "pending" : false
    const bOverdue = b.dueDate ? new Date(b.dueDate) < new Date() && b.status === "pending" : false

    if (aOverdue && !bOverdue) return -1
    if (!aOverdue && bOverdue) return 1

    // Then by due date
    if (a.dueDate && b.dueDate) {
      const dateDiff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      if (dateDiff !== 0) return dateDiff
    } else if (a.dueDate) return -1
    else if (b.dueDate) return 1

    // Then by priority
    const priorityOrder: Record<string, number> = { high: 0, normal: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  // Paginate
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex)
  const total = filteredTasks.length
  const hasMore = endIndex < total

  // Enrich with names
  const enrichedTasks = paginatedTasks.map(enrichTaskWithNames)

  return {
    tasks: enrichedTasks,
    total,
    page,
    pageSize,
    hasMore,
  }
}

export async function createTask(payload: CreateTaskPayload): Promise<TaskListItem> {
  const newTask: Task = {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: payload.title,
    description: payload.description,
    type: payload.type,
    status: "pending",
    priority: payload.priority || "normal",
    dueDate: payload.dueDate,
    createdAt: new Date().toISOString(),
    createdByUserId: payload.createdByUserId,
    assignedToUserId: payload.assignedToUserId,
    patientId: payload.patientId,
    clinicId: payload.clinicId,
  }

  tasksStore.push(newTask)
  return enrichTaskWithNames(newTask)
}

export async function updateTaskStatus(payload: UpdateTaskStatusPayload): Promise<TaskListItem> {
  const task = tasksStore.find((t) => t.id === payload.id)
  if (!task) {
    throw new Error("Task not found")
  }

  task.status = payload.status
  return enrichTaskWithNames(task)
}

export async function assignTask(payload: AssignTaskPayload): Promise<TaskListItem> {
  const task = tasksStore.find((t) => t.id === payload.id)
  if (!task) {
    throw new Error("Task not found")
  }

  task.assignedToUserId = payload.assignedToUserId || undefined
  return enrichTaskWithNames(task)
}

export async function snoozeTask(payload: SnoozeTaskPayload): Promise<TaskListItem> {
  const task = tasksStore.find((t) => t.id === payload.id)
  if (!task) {
    throw new Error("Task not found")
  }

  task.status = "snoozed"
  task.dueDate = payload.nextDueDate
  return enrichTaskWithNames(task)
}
