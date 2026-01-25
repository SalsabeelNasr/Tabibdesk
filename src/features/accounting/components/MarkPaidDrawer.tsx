"use client"

import { useState, useEffect } from "react"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { Select } from "@/components/Select"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { useToast } from "@/hooks/useToast"
import { createPayment } from "@/api/payments.api"
import { markInvoicePaid } from "@/api/invoices.api"
import { uploadFile } from "@/api/files.api"
import { mockData, mockDoctor } from "@/data/mock/mock-data"
import type { Invoice } from "@/types/invoice"
import type { PaymentMethod } from "@/types/payment"
import { RiUploadLine, RiFileLine, RiUserLine, RiStethoscopeLine, RiCalendarLine } from "@remixicon/react"

interface MarkPaidDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  onSuccess: () => void
}

export function MarkPaidDrawer({
  open,
  onOpenChange,
  invoice,
  onSuccess,
}: MarkPaidDrawerProps) {
  const { currentClinic, currentUser } = useUserClinic()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [method, setMethod] = useState<PaymentMethod>("cash")
  const [amount, setAmount] = useState("")
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofFileId, setProofFileId] = useState<string | undefined>(undefined)
  const [uploadingProof, setUploadingProof] = useState(false)

  // Initialize amount when invoice changes
  useEffect(() => {
    if (invoice && open) {
      setAmount(invoice.amount.toString())
      setMethod("cash")
      setProofFile(null)
      setProofFileId(undefined)
    }
  }, [invoice, open])

  // Reset form when drawer closes
  const handleClose = () => {
    if (!loading) {
      setMethod("cash")
      setAmount("")
      setProofFile(null)
      setProofFileId(undefined)
      onOpenChange(false)
    }
  }

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !invoice) return

    setProofFile(file)
    setUploadingProof(true)

    try {
      const result = await uploadFile({
        clinicId: currentClinic.id,
        entityType: "payment",
        entityId: invoice.id,
        file,
      })
      setProofFileId(result.fileId)
    } catch (error) {
      console.error("Failed to upload proof:", error)
      showToast("Failed to upload proof", "error")
      setProofFile(null)
    } finally {
      setUploadingProof(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!invoice || !currentClinic) return

    // Validate Visa and InstaPay require proof
    if ((method === "visa" || method === "instapay") && !proofFileId) {
      showToast("Proof upload is required for Visa and InstaPay payments", "error")
      return
    }

    setLoading(true)
    try {
      // Create payment
      await createPayment({
        clinicId: currentClinic.id,
        invoiceId: invoice.id,
        patientId: invoice.patientId,
        appointmentId: invoice.appointmentId,
        amount: parseFloat(amount),
        method,
        proofFileId,
        createdByUserId: currentUser.id,
      })

      // Mark invoice as paid
      await markInvoicePaid(invoice.id)

      showToast("Payment recorded successfully", "success")
      onSuccess()
      handleClose()
    } catch (error) {
      console.error("Failed to record payment:", error)
      showToast(error instanceof Error ? error.message : "Failed to record payment", "error")
    } finally {
      setLoading(false)
    }
  }

  // Cash doesn't require proof, Visa and InstaPay do
  const canSave = method === "cash" || ((method === "visa" || method === "instapay") && proofFileId !== undefined)

  // Get patient and appointment details for summary
  const getPatientName = (patientId: string) => {
    const patient = mockData.patients.find((p) => p.id === patientId)
    return patient ? `${patient.first_name} ${patient.last_name}` : "Unknown Patient"
  }

  const getDoctorName = (doctorId: string) => {
    // In real app, fetch from API
    return mockDoctor.full_name || "Dr. Unknown"
  }

  const getAppointmentData = (appointmentId: string) => {
    const appointment = mockData.appointments.find((a) => a.id === appointmentId)
    if (!appointment) return null
    const date = new Date(appointment.scheduled_at)
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    }
  }

  if (!invoice) return null

  const patientName = getPatientName(invoice.patientId)
  const doctorName = getDoctorName(invoice.doctorId)
  const appointmentData = getAppointmentData(invoice.appointmentId)

  return (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent side="right" className="w-full sm:max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>Mark Invoice as Paid</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          {/* Summary Section */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-50">Appointment Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <RiUserLine className="size-5 shrink-0 text-gray-600 dark:text-gray-400" />
                <div className="flex-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Patient</div>
                  <div className="font-medium text-gray-900 dark:text-gray-50">{patientName}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RiStethoscopeLine className="size-5 shrink-0 text-gray-600 dark:text-gray-400" />
                <div className="flex-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Doctor</div>
                  <div className="font-medium text-gray-900 dark:text-gray-50">{doctorName}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RiStethoscopeLine className="size-5 shrink-0 text-gray-600 dark:text-gray-400" />
                <div className="flex-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Appointment Type</div>
                  <div className="font-medium text-gray-900 dark:text-gray-50 capitalize">{invoice.appointmentType}</div>
                </div>
              </div>

              {appointmentData && (
                <div className="flex items-center gap-3">
                  <RiCalendarLine className="size-5 shrink-0 text-gray-600 dark:text-gray-400" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Date & Time</div>
                    <div className="font-medium text-gray-900 dark:text-gray-50">
                      {appointmentData.date} at {appointmentData.time}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <RiFileLine className="size-5 shrink-0 text-gray-600 dark:text-gray-400" />
                <div className="flex-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Invoice Amount</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-50">{invoice.amount.toFixed(2)} EGP</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  Amount (EGP) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Invoice amount: {invoice.amount} EGP
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">
                  Payment Method <span className="text-red-500">*</span>
                </Label>
                <Select
                  id="method"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                >
                  <option value="cash">Cash</option>
                  <option value="visa">Visa</option>
                  <option value="instapay">InstaPay</option>
                </Select>
              </div>

              {(method === "visa" || method === "instapay") && (
                <div className="space-y-2">
                  <Label htmlFor="proof">
                    Proof of Payment <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-2">
                    <label
                      htmlFor="proof"
                      className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm ${
                        (method === "visa" || method === "instapay") && !proofFileId
                          ? "border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <RiUploadLine className="size-4" />
                      {proofFile ? proofFile.name : "Upload proof"}
                    </label>
                    <input
                      id="proof"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleProofUpload}
                      className="hidden"
                      disabled={uploadingProof}
                      required={method === "visa" || method === "instapay"}
                    />
                    {uploadingProof && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">Uploading...</p>
                    )}
                    {proofFileId && (
                      <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                        <RiFileLine className="size-4" />
                        Proof uploaded successfully
                      </div>
                    )}
                    {!proofFileId && (method === "visa" || method === "instapay") && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Proof upload is required for {method === "visa" ? "Visa" : "InstaPay"} payments
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Proof upload is mandatory for Visa and InstaPay payments
                  </p>
                </div>
              )}
              
              {method === "cash" && (
                <div className="space-y-2">
                  <Label htmlFor="proof">
                    Proof of Payment <span className="text-gray-500">(Optional)</span>
                  </Label>
                  <div className="space-y-2">
                    <label
                      htmlFor="proof-cash"
                      className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <RiUploadLine className="size-4" />
                      {proofFile ? proofFile.name : "Upload proof"}
                    </label>
                    <input
                      id="proof-cash"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleProofUpload}
                      className="hidden"
                      disabled={uploadingProof}
                    />
                    {uploadingProof && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">Uploading...</p>
                    )}
                    {proofFileId && (
                      <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                        <RiFileLine className="size-4" />
                        Proof uploaded successfully
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Upload proof of payment (optional but recommended)
                  </p>
                </div>
              )}
            </div>

            <DrawerFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 sm:flex-initial"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !canSave}
                isLoading={loading}
                className="flex-1 sm:flex-initial"
              >
                Mark as Paid
              </Button>
            </DrawerFooter>
          </form>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
