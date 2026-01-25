"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog"
import { Button } from "@/components/Button"
import { Label } from "@/components/Label"
import { Select } from "@/components/Select"
import { mockUsers } from "@/data/mock/users-clinics"
import type { TaskListItem } from "./tasks.types"

interface AssignModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (assignedToUserId: string | undefined) => Promise<void>
  task: TaskListItem | null
}

export function AssignModal({
  isOpen,
  onClose,
  onSubmit,
  task,
}: AssignModalProps) {
  const [assignedToUserId, setAssignedToUserId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableUsers = mockUsers

  useEffect(() => {
    if (isOpen && task) {
      setAssignedToUserId(task.assignedToUserId || "")
    } else if (!isOpen) {
      // Reset form when modal closes
      setAssignedToUserId("")
      setIsSubmitting(false)
    }
  }, [isOpen, task])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(assignedToUserId || undefined)
      onClose()
    } catch (error) {
      // Error handling would go here
      console.error("Failed to assign task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "doctor":
        return "Doctor"
      case "assistant":
        return "Assistant"
      case "manager":
        return "Manager"
      default:
        return role
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
          {task && (
            <DialogDescription className="mt-1">
              {task.patientName
                ? `Assign "${task.description || task.title}" for ${task.patientName}`
                : `Assign "${task.description || task.title}"`}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assign To</Label>
            <Select
              id="assignedTo"
              value={assignedToUserId}
              onChange={(e) => setAssignedToUserId(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Unassigned</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name} ({getRoleLabel(user.role)})
                </option>
              ))}
            </Select>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
