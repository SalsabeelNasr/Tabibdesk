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
import { RiAddLine, RiCloseLine } from "@remixicon/react"
import type { CreatePrescriptionPayload, PrescriptionItem } from "./prescriptions.types"

interface AddPrescriptionDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreatePrescriptionPayload) => Promise<void>
  patientId: string
  clinicId: string
  doctorId?: string
}

const MEDICATION_FORMS = ["Tablets", "Capsules", "Syrup", "Cream", "Ointment", "Injection", "Drops", "Inhaler", "Other"]
const COMMON_MEDICATIONS = [
  "Paracetamol 500mg",
  "Ibuprofen 400mg",
  "Amoxicillin 500mg",
  "Metformin 500mg",
  "Amlodipine 5mg",
  "Omeprazole 20mg",
  "Levothyroxine 50mcg",
  "Aspirin 81mg",
]

export function AddPrescriptionDrawer({
  open,
  onOpenChange,
  onSubmit,
  patientId,
  clinicId,
  doctorId,
}: AddPrescriptionDrawerProps) {
  const [notesToPatient, setNotesToPatient] = useState("")
  const [items, setItems] = useState<PrescriptionItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      // Reset form when drawer opens
      setNotesToPatient("")
      setItems([])
    }
  }, [open])

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `temp-${Date.now()}-${items.length}`,
        name: "",
        sig: "",
      },
    ])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, updates: Partial<PrescriptionItem>) => {
    setItems(
      items.map((item, i) => (i === index ? { ...item, ...updates } : item))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Require at least one medication item
    const validItems = items.map(({ id, ...rest }) => rest).filter((item) => item.name.trim() && item.sig.trim())
    if (validItems.length === 0) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        clinicId,
        patientId,
        doctorId,
        diagnosisText: "", // Empty since field is removed
        notesToPatient: notesToPatient.trim() || undefined,
        items: validItems,
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create prescription:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="right" className="w-full sm:max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>New Prescription</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Medications Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Medications</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addItem}
                    className="gap-2"
                  >
                    <RiAddLine className="size-4" />
                    Add Medication
                  </Button>
                </div>

                {items.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-8 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No medications added yet
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addItem}
                      className="mt-3"
                    >
                      Add First Medication
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 space-y-4"
                      >
                        {/* Medication Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                            Medication {index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="h-7 w-7 p-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                          >
                            <RiCloseLine className="size-4" />
                          </Button>
                        </div>

                        {/* Medication Details */}
                        <div className="space-y-4">
                          {/* Name */}
                          <div className="space-y-2">
                            <Label htmlFor={`item-name-${index}`}>
                              Medication Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`item-name-${index}`}
                              value={item.name}
                              onChange={(e) => updateItem(index, { name: e.target.value })}
                              placeholder="e.g., Paracetamol 500mg"
                              list={`medications-list-${index}`}
                              required
                            />
                            <datalist id={`medications-list-${index}`}>
                              {COMMON_MEDICATIONS.map((med) => (
                                <option key={med} value={med} />
                              ))}
                            </datalist>
                          </div>

                          {/* Strength and Form */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`item-strength-${index}`}>Strength</Label>
                              <Input
                                id={`item-strength-${index}`}
                                value={item.strength || ""}
                                onChange={(e) => updateItem(index, { strength: e.target.value })}
                                placeholder="e.g., 500mg"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`item-form-${index}`}>Form</Label>
                              <Select
                                id={`item-form-${index}`}
                                value={item.form || ""}
                                onChange={(e) => updateItem(index, { form: e.target.value })}
                              >
                                <option value="">Select form</option>
                                {MEDICATION_FORMS.map((form) => (
                                  <option key={form} value={form}>
                                    {form}
                                  </option>
                                ))}
                              </Select>
                            </div>
                          </div>

                          {/* Instructions */}
                          <div className="space-y-2">
                            <Label htmlFor={`item-sig-${index}`}>
                              Instructions (Sig) <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id={`item-sig-${index}`}
                              value={item.sig}
                              onChange={(e) => updateItem(index, { sig: e.target.value })}
                              placeholder="e.g., Take 1 tablet twice daily after meals"
                              rows={2}
                              required
                            />
                          </div>

                          {/* Duration */}
                          <div className="space-y-2">
                            <Label htmlFor={`item-duration-${index}`}>Duration</Label>
                            <Input
                              id={`item-duration-${index}`}
                              value={item.duration || ""}
                              onChange={(e) => updateItem(index, { duration: e.target.value })}
                              placeholder="e.g., 5 days"
                            />
                          </div>

                          {/* Notes */}
                          <div className="space-y-2">
                            <Label htmlFor={`item-notes-${index}`}>Notes (Optional)</Label>
                            <Input
                              id={`item-notes-${index}`}
                              value={item.notes || ""}
                              onChange={(e) => updateItem(index, { notes: e.target.value })}
                              placeholder="Additional notes"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes to Patient */}
              <div className="space-y-2">
                <Label htmlFor="notesToPatient">Notes to Patient</Label>
                <Textarea
                  id="notesToPatient"
                  value={notesToPatient}
                  onChange={(e) => setNotesToPatient(e.target.value)}
                  placeholder="Additional instructions or notes for the patient"
                  rows={3}
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
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={items.filter((item) => item.name.trim() && item.sig.trim()).length === 0}
                className="flex-[2]"
              >
                Save Prescription
              </Button>
            </div>
          </form>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
