"use client"

import { useState } from "react"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
} from "@/components/Drawer"
import { Button } from "@/components/Button"
import { Label } from "@/components/Label"
import { DatePicker } from "@/components/DatePicker"
import { RiCapsuleLine } from "@remixicon/react"
import { MedicationFormFields } from "@/features/prescriptions/MedicationFormFields"
import type { CreatePastMedicationPayload } from "@/features/prescriptions/prescriptions.types"

interface AddPastMedicationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreatePastMedicationPayload) => Promise<void>
  patientId: string
}

export function AddPastMedicationDrawer({
  open,
  onOpenChange,
  onSubmit,
  patientId,
}: AddPastMedicationDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    strength: "",
    form: "",
    duration: "",
    notes: "",
    takenFrom: new Date(),
    takenTo: undefined as Date | undefined,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setIsSubmitting(true)
    try {
      const nameWithDetails = formData.name +
        (formData.strength ? ` ${formData.strength}` : "") +
        (formData.form ? ` (${formData.form})` : "")

      await onSubmit({
        patientId,
        name: nameWithDetails,
        duration: formData.duration,
        takenFrom: formData.takenFrom.toISOString(),
        takenTo: formData.takenTo?.toISOString() || null,
        notes: formData.notes,
      })
      onOpenChange(false)
      setFormData({
        name: "",
        strength: "",
        form: "",
        duration: "",
        notes: "",
        takenFrom: new Date(),
        takenTo: undefined,
      })
    } catch (error) {
      console.error("Failed to add past medication:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="right" className="w-full sm:max-w-xl">
        <DrawerHeader>
          <DrawerHeaderTitle
            icon={<RiCapsuleLine className="size-5 text-primary-600 dark:text-primary-400" />}
            title="Add Past Medication"
          />
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <DrawerBody>
            <div className="space-y-6">
              <MedicationFormFields
                data={formData}
                onChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
                showInstructions={false}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Started Taking</Label>
                  <DatePicker
                    value={formData.takenFrom}
                    onChange={(date) => date && setFormData((prev) => ({ ...prev, takenFrom: date }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stopped Taking (Optional)</Label>
                  <DatePicker
                    value={formData.takenTo}
                    onChange={(date) => setFormData((prev) => ({ ...prev, takenTo: date }))}
                    placeholder="Still taking (Ongoing)"
                  />
                </div>
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={!formData.name.trim()}
            >
              Add Medication
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
