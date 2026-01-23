"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent } from "@/components/Card"
import { Button } from "@/components/Button"
import { Skeleton } from "@/components/Skeleton"
import { RiTaskLine, RiAddLine } from "@remixicon/react"
import { useDebounce } from "@/lib/useDebounce"
import { TasksToolbar } from "./TasksToolbar"
import { TasksTable } from "./TasksTable"
import { TasksCards } from "./TasksCards"
import { NewTaskModal, SnoozeModal, AssignModal } from "./TaskModals"
import {
  listTasks,
  createTask,
  updateTaskStatus,
  assignTask,
  snoozeTask,
} from "./tasks.api"
import type {
  TaskListItem,
  TaskStatus,
  CreateTaskPayload,
} from "./tasks.types"

interface TasksPageProps {
  role: "doctor" | "assistant" | "manager"
  currentUserId: string
  clinicId: string
}

export function TasksPage({ role, currentUserId, clinicId }: TasksPageProps) {
  const [tasks, setTasks] = useState<TaskListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 250)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("pending")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [snoozeTaskData, setSnoozeTaskData] = useState<TaskListItem | null>(null)
  const [assignTaskData, setAssignTaskData] = useState<TaskListItem | null>(null)

  const pageSize = 20

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await listTasks({
        clinicId,
        status: statusFilter,
        query: debouncedSearch,
        page,
        pageSize,
      })
      setTasks(response.tasks)
      setTotal(response.total)
      setHasMore(response.hasMore)
    } catch (error) {
      // Error handling would go here
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter, page, clinicId])

  const handleCreateTask = async (payload: CreateTaskPayload) => {
    await createTask(payload)
    await fetchTasks()
  }

  const handleMarkDone = async (task: TaskListItem) => {
    await updateTaskStatus({ id: task.id, status: "done" })
    await fetchTasks()
  }

  const handleSnooze = async (nextDueDate: string) => {
    if (!snoozeTaskData) return
    await snoozeTask({ id: snoozeTaskData.id, nextDueDate })
    await fetchTasks()
  }

  const handleAssign = async (assignedToUserId: string | undefined) => {
    if (!assignTaskData) return
    await assignTask({ id: assignTaskData.id, assignedToUserId })
    await fetchTasks()
  }

  const defaultAssignedTo = role === "assistant" ? currentUserId : undefined

  const filteredCount = searchQuery ? tasks.length : total

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        subtitle={
          searchQuery
            ? `${filteredCount} task${filteredCount !== 1 ? "s" : ""} found`
            : `${total} total task${total !== 1 ? "s" : ""}`
        }
      />

      <TasksToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onNewTask={() => setShowNewTaskModal(true)}
        totalTasks={total}
        filteredCount={filteredCount}
      />

      {loading && tasks.length === 0 ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <RiTaskLine className="mx-auto size-12 text-gray-400" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {searchQuery ? "No tasks found matching your filters." : "No tasks yet."}
            </p>
            {!searchQuery && (
              <Button className="mt-4" onClick={() => setShowNewTaskModal(true)}>
                <RiAddLine className="mr-2 size-4" />
                Create First Task
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:block">
            <TasksTable
              tasks={tasks}
              onMarkDone={handleMarkDone}
              onSnooze={(task) => setSnoozeTaskData(task)}
              onAssign={(task) => setAssignTaskData(task)}
              role={role}
              currentUserId={currentUserId}
            />
          </div>
          
          {/* Mobile View */}
          <div className="md:hidden">
            <TasksCards
              tasks={tasks}
              onMarkDone={handleMarkDone}
              onSnooze={(task) => setSnoozeTaskData(task)}
              onAssign={(task) => setAssignTaskData(task)}
              role={role}
              currentUserId={currentUserId}
            />
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <Button
                variant="secondary"
                onClick={() => setPage((p) => p + 1)}
                disabled={loading}
                isLoading={loading}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <NewTaskModal
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        onSubmit={handleCreateTask}
        defaultAssignedToUserId={defaultAssignedTo}
        currentUserId={currentUserId}
        clinicId={clinicId}
        role={role}
      />

      <SnoozeModal
        isOpen={!!snoozeTaskData}
        onClose={() => setSnoozeTaskData(null)}
        onSubmit={handleSnooze}
        task={snoozeTaskData}
      />

      <AssignModal
        isOpen={!!assignTaskData}
        onClose={() => setAssignTaskData(null)}
        onSubmit={handleAssign}
        task={assignTaskData}
        currentUserId={currentUserId}
        role={role}
      />
    </div>
  )
}
