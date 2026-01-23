"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/Dialog"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { Select } from "@/components/Select"
import { Textarea } from "@/components/Textarea"
import { DatePicker } from "@/components/DatePicker"
import { mockUsers } from "@/data/mock/users-clinics"
import { mockData } from "@/data/mock/mock-data"
import type { CreateTaskPayload, TaskListItem, TaskType, TaskPriority } from "./tasks.types"

interface NewTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: CreateTaskPayload) => Promise<void>
  defaultAssignedToUserId?: string
  currentUserId: string
  clinicId: string
}

export function NewTaskModal({
  isOpen,
  onClose,
  onSubmit,
  defaultAssignedToUserId,
  currentUserId,
  clinicId,
}: NewTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<TaskType>("follow_up")
  const [priority, setPriority] = useState<TaskPriority>("normal")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [assignedToUserId, setAssignedToUserId] = useState<string>(defaultAssignedToUserId || "")
  const [patientId, setPatientId] = useState<string>("")
  const [patientSearch, setPatientSearch] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredPatients = patientSearch
    ? mockData.patients.filter(
        (p) =>
          `${p.first_name} ${p.last_name}`.toLowerCase().includes(patientSearch.toLowerCase()) ||
          p.phone.includes(patientSearch)
      )
    : []

  const availableUsers = mockUsers

  useEffect(() => {
    if (isOpen) {
      setTitle("")
      setDescription("")
      setType("follow_up")
      setPriority("normal")
      setDueDate(undefined)
      setAssignedToUserId(defaultAssignedToUserId || "")
      setPatientId("")
      setPatientSearch("")
    }
  }, [isOpen, defaultAssignedToUserId])

  const handleSubmit = async () => {
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        priority,
        dueDate: dueDate?.toISOString(),
        assignedToUserId: assignedToUserId || undefined,
        patientId: patientId || undefined,
        clinicId,
        createdByUserId: currentUserId,
      })
      onClose()
    } catch (error) {
      // Error handling would go here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select id="type" value={type} onChange={(e) => setType(e.target.value as TaskType)}>
                <option value="follow_up">Follow Up</option>
                <option value="appointment">Appointment</option>
                <option value="labs">Labs</option>
                <option value="scan">Scan</option>
                <option value="billing">Billing</option>
                <option value="other">Other</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </Select>
            </div>
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="patient">Patient (Optional)</Label>
            <div className="space-y-2">
              <Input
                id="patient"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Search by name or phone"
              />
              {patientSearch && filteredPatients.length > 0 && (
                <Select
                  value={patientId}
                  onChange={(e) => {
                    setPatientId(e.target.value)
                    setPatientSearch("")
                  }}
                >
                  <option value="">Select patient</option>
                  {filteredPatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name} - {patient.phone}
                    </option>
                  ))}
                </Select>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <DatePicker
              value={dueDate}
              onChange={setDueDate}
              placeholder="Select due date"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting || !title.trim()}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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
