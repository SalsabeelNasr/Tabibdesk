"use client"

import { Button } from "@/components/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog"
import { useState } from "react"
import type { CreatePatientInput } from "./patients.types"
import { PatientFormFields, type PatientFormData } from "./PatientFormFields"

interface AddPatientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreatePatientInput) => Promise<void>
}

export function AddPatientModal({ open, onOpenChange, onSubmit }: AddPatientModalProps) {
  const [formData, setFormData] = useState<PatientFormData>({
    first_name: "",
    last_name: "",
    phone: "",
    gender: "",
    date_of_birth: undefined,
    age: undefined,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof CreatePatientInput, string>>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Partial<Record<keyof CreatePatientInput, string>> = {}
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required"
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      // Convert PatientFormData to CreatePatientInput
      const submitData: CreatePatientInput = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        gender: formData.gender || undefined,
        date_of_birth: formData.date_of_birth,
        age: formData.age,
      }
      await onSubmit(submitData)
      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        gender: "",
        date_of_birth: undefined,
        age: undefined,
      })
      setErrors({})
      onOpenChange(false)
    } catch (error) {
      // Error handling would go here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>Enter basic information for the new patient.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <PatientFormFields
              formData={formData}
              onChange={setFormData}
              errors={errors}
              showGender={true}
              showDateOfBirth={true}
              showAge={true}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Add Patient
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
