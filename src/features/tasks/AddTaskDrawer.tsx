"use client"

import { useState, useEffect } from "react"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { Select } from "@/components/Select"
import { Textarea } from "@/components/Textarea"
import { DatePicker } from "@/components/DatePicker"
import { mockUsers } from "@/data/mock/users-clinics"
import { mockData } from "@/data/mock/mock-data"
import type { CreateTaskPayload, TaskType } from "./tasks.types"

interface AddTaskDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreateTaskPayload) => Promise<void>
  defaultAssignedToUserId?: string
  defaultPatientId?: string
  currentUserId: string
  clinicId: string
}

export function AddTaskDrawer({
  open,
  onOpenChange,
  onSubmit,
  defaultAssignedToUserId,
  defaultPatientId,
  currentUserId,
  clinicId,
}: AddTaskDrawerProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<TaskType>("follow_up")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [assignedToUserId, setAssignedToUserId] = useState<string>(defaultAssignedToUserId || "")
  const [patientId, setPatientId] = useState<string>(defaultPatientId || "")
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
    if (open) {
      setTitle("")
      setDescription("")
      setType("follow_up")
      setDueDate(undefined)
      setAssignedToUserId(defaultAssignedToUserId || "")
      setPatientId(defaultPatientId || "")
      setPatientSearch("")
    }
  }, [open, defaultAssignedToUserId, defaultPatientId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        dueDate: dueDate?.toISOString(),
        assignedToUserId: assignedToUserId || undefined,
        patientId: patientId || undefined,
        clinicId,
        createdByUserId: currentUserId,
      })
      onOpenChange(false)
    } catch (error) {
      // Error handling would go here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="right" className="w-full sm:max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>New Task</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="patient">Patient {defaultPatientId ? "(Pre-filled)" : "(Optional)"}</Label>
                <div className="space-y-2">
                  {defaultPatientId ? (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      {(() => {
                        const patient = mockData.patients.find((p) => p.id === defaultPatientId)
                        return patient ? (
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {patient.first_name} {patient.last_name} - {patient.phone}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">Patient selected</p>
                        )
                      })()}
                    </div>
                  ) : (
                    <>
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
                    </>
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

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={!title.trim()} className="flex-[2]">
                Create Task
              </Button>
            </div>
          </form>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
