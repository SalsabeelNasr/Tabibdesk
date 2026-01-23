"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Dialog"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { Select } from "@/components/Select"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { useToast } from "@/hooks/useToast"
import { createPayment } from "@/api/accounting.api"
import type { PaymentMethod, CashierRow } from "../accounting.types"

interface CollectPaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cashierRow: CashierRow | null
  onSuccess: () => void
}

export function CollectPaymentModal({
  open,
  onOpenChange,
  cashierRow,
  onSuccess,
}: CollectPaymentModalProps) {
  const { currentClinic, currentUser } = useUserClinic()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState<PaymentMethod>("cash")
  const [reference, setReference] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (cashierRow) {
      setAmount(cashierRow.feeAmount.toString())
    }
  }, [cashierRow])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cashierRow) return

    setLoading(true)
    try {
      await createPayment({
        clinicId: currentClinic.id,
        patientId: cashierRow.patientId,
        patientName: cashierRow.patientName,
        appointmentId: cashierRow.appointmentId,
        amount: parseFloat(amount),
        method,
        status: "paid",
        reference: reference || undefined,
        notes: notes || undefined,
        createdByUserId: currentUser.id,
      })

      showToast("Payment collected successfully", "success")
      onSuccess()
      onOpenChange(false)
      
      // Reset form
      setAmount("")
      setMethod("cash")
      setReference("")
      setNotes("")
    } catch (error) {
      console.error("Failed to create payment:", error)
      showToast("Failed to collect payment", "error")
    } finally {
      setLoading(false)
    }
  }

  if (!cashierRow) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Collect Payment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Patient: <span className="font-medium text-gray-900 dark:text-gray-50">{cashierRow.patientName}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (EGP)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            >
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="instapay">Instapay</option>
              <option value="bank_transfer">Bank Transfer</option>
            </Select>
          </div>

          {(method === "instapay" || method === "bank_transfer" || method === "credit_card") && (
            <div className="space-y-2">
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Transaction ref or last 4 digits"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Collecting..." : "Collect Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
