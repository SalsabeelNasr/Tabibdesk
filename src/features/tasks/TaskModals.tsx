"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/Dialog"
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
    }
  }, [isOpen, task])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(assignedToUserId || undefined)
      onClose()
    } catch (error) {
      // Error handling would go here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assign To</Label>
            <Select
              id="assignedTo"
              value={assignedToUserId}
              onChange={(e) => setAssignedToUserId(e.target.value)}
            >
              <option value="">Unassigned</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name} ({user.role === "doctor" ? "Doctor" : user.role === "assistant" ? "Assistant" : "Manager"})
                </option>
              ))}
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
