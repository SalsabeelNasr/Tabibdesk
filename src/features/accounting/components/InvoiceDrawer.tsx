"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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
import { mockData, mockDoctor } from "@/data/mock/mock-data"
import {
  getClinicAppointmentTypes,
  getDoctorPricing,
  getPriceForAppointmentType,
} from "@/api/pricing.api"
import {
  updateInvoiceLineItems,
  markInvoicePaid,
  recordPartialPaymentWithOptionalDue,
  voidInvoice,
  createInvoiceForArrivedAppointment,
  createInvoiceWithAmount,
} from "@/api/invoices.api"
import { getOrCreateDraftDue, addOrUpdateCharges, clearDraftDue } from "@/api/draft-due.api"
import { createPayment as createInvoiceLinkedPayment } from "@/api/payments.api"
import { uploadFile } from "@/api/files.api"
import type { PaymentMethod } from "@/types/payment"
import type { Invoice } from "@/types/invoice"
import { PatientAutocomplete, type PatientOption } from "./PatientAutocomplete"
import {
  RiAddLine,
  RiDeleteBinLine,
  RiMoneyDollarCircleLine,
  RiUploadLine,
  RiFileLine,
  RiUserLine,
  RiStethoscopeLine,
  RiCalendarLine,
} from "@remixicon/react"

type AmountChangeReason = "payment_later" | "discount_applied"
type DrawerMode = "pay-only" | "invoice-and-pay" | "update-due-only" | "capture-only"

export interface PatientAppointment {
  id: string
  patient_id: string
  scheduled_at: string
  type: string
  status: string
  doctor_id: string | null
  clinic_id: string | null
}

interface InvoiceDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  mode: DrawerMode
  /** For pay-only and invoice-and-pay modes */
  invoice?: Invoice | null
  /** For update-due-only and invoice-and-pay (when no invoice) */
  patientId?: string
  patientAppointments?: PatientAppointment[]
  /** Pre-select this appointment when creating (dashboard create-invoice flow) */
  defaultAppointmentId?: string
}

interface ProcedureLine {
  id: string
  label: string
  amount: number
}

function formatAptLabel(apt: PatientAppointment) {
  const d = new Date(apt.scheduled_at)
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
  return `${date} ${time} • ${apt.type}`
}

function getPatientName(patientId: string) {
  const patient = mockData.patients.find((p) => p.id === patientId)
  return patient ? `${patient.first_name} ${patient.last_name}` : "Unknown Patient"
}

function getDoctorName(doctorId: string) {
  return mockDoctor?.full_name ?? "Dr. Unknown"
}

function getAppointmentData(appointmentId: string) {
  const appointment = mockData.appointments.find((a) => a.id === appointmentId)
  if (!appointment) return null
  const date = new Date(appointment.scheduled_at)
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
  }
}

export function InvoiceDrawer({
  open,
  onOpenChange,
  onSuccess,
  mode,
  invoice: invoiceProp = null,
  patientId,
  patientAppointments = [],
  defaultAppointmentId,
}: InvoiceDrawerProps) {
  const { currentClinic, currentUser } = useUserClinic()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  // Mark as paid checkbox (pay-only: always checked/hidden; invoice-and-pay: checked by default; update-due-only: unchecked)
  const [markAsPaid, setMarkAsPaid] = useState(false)

  // Line items (for invoice-and-pay and update-due-only)
  const [appointmentId, setAppointmentId] = useState<"unlinked" | string>("unlinked")
  const [waiveConsultation, setWaiveConsultation] = useState(false)
  const [consultationAmount, setConsultationAmount] = useState(0)
  const [procedureLines, setProcedureLines] = useState<ProcedureLine[]>([])
  const [discountPercent, setDiscountPercent] = useState<0 | 10 | 20 | 30>(0)
  const [serviceTypes, setServiceTypes] = useState<string[]>([])
  const [pricing, setPricing] = useState<Record<string, number>>({})
  const [procedureInput, setProcedureInput] = useState("")
  const [procedureAmount, setProcedureAmount] = useState("")
  const [showProcedureSuggestions, setShowProcedureSuggestions] = useState(false)
  const procedureAutocompleteRef = useRef<HTMLDivElement>(null)

  // Payment fields (when markAsPaid is checked)
  const [amountToCollect, setAmountToCollect] = useState("")
  const [method, setMethod] = useState<PaymentMethod>("cash")
  const [createDueForRemainder, setCreateDueForRemainder] = useState(true)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofFileId, setProofFileId] = useState<string | undefined>(undefined)
  const [uploadingProof, setUploadingProof] = useState(false)

  // Capture-only (Income tab): patient + appointment, then pay
  const [capturePatient, setCapturePatient] = useState<PatientOption | null>(null)
  const [capturePatientDisplay, setCapturePatientDisplay] = useState("")
  const [captureAppointmentId, setCaptureAppointmentId] = useState("")
  const [captureServiceAmount, setCaptureServiceAmount] = useState<number | null>(null)
  const [captureReason, setCaptureReason] = useState<AmountChangeReason | "">("")

  const sortedAppointments = useMemo(
    () =>
      [...patientAppointments].sort(
        (a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
      ),
    [patientAppointments]
  )

  const selectedApt = useMemo(
    () => sortedAppointments.find((a) => a.id === appointmentId) ?? null,
    [sortedAppointments, appointmentId]
  )

  const captureAppointments = useMemo(() => {
    if (mode !== "capture-only" || !currentClinic?.id || !capturePatient?.id) return []
    return mockData.appointments
      .filter(
        (a) =>
          (a.clinic_id || "") === currentClinic.id && a.patient_id === capturePatient.id
      )
      .slice()
      .sort((a, b) => b.scheduled_at.localeCompare(a.scheduled_at))
  }, [mode, currentClinic?.id, capturePatient?.id])

  const captureSelectedApt = useMemo(
    () => captureAppointments.find((a) => a.id === captureAppointmentId) ?? null,
    [captureAppointments, captureAppointmentId]
  )

  const procedureSuggestions = useMemo(() => {
    const q = procedureInput.trim().toLowerCase()
    const list = serviceTypes.filter((t) => t.toLowerCase() !== "consultation")
    if (!q) return list.map((t) => ({ label: t, amount: pricing[t] ?? 0 }))
    return list
      .filter((t) => t.toLowerCase().includes(q))
      .map((t) => ({ label: t, amount: pricing[t] ?? 0 }))
  }, [procedureInput, serviceTypes, pricing])

  const showLineItems = mode === "invoice-and-pay" || mode === "update-due-only"
  const showPaymentSection = (markAsPaid && mode !== "pay-only") || mode === "capture-only"
  const payOnlyMode = mode === "pay-only"
  const captureOnlyMode = mode === "capture-only"

  // Load service types and pricing (for invoice-and-pay, update-due-only)
  useEffect(() => {
    if (!open || payOnlyMode || mode === "capture-only") return
    const clinicId = currentClinic?.id || (invoiceProp?.clinicId ?? "clinic-001")
    const doctorId = currentUser?.id || (invoiceProp?.doctorId ?? "user-001")
    let cancelled = false
    Promise.all([
      getClinicAppointmentTypes(clinicId),
      getDoctorPricing({ clinicId, doctorId }),
    ]).then(([types, pr]) => {
      if (cancelled) return
      setServiceTypes(types)
      setPricing(pr)
    })
    return () => { cancelled = true }
  }, [open, payOnlyMode, mode, currentClinic?.id, currentUser?.id, invoiceProp])

  // Reset form when opening
  useEffect(() => {
    if (!open) return
    const clinicId = currentClinic?.id || (invoiceProp?.clinicId ?? "clinic-001")
    const doctorId = currentUser?.id || (invoiceProp?.doctorId ?? "user-001")
    setLoading(false)
    setProofFile(null)
    setProofFileId(undefined)
    setUploadingProof(false)

    if (mode === "pay-only" && invoiceProp) {
      // Dues: pay-only, mark as paid (no checkbox)
      setMarkAsPaid(true)
      setAmountToCollect(String(invoiceProp.amount))
      setMethod("cash")
      setCreateDueForRemainder(true)
      return
    }

    if (mode === "invoice-and-pay" && invoiceProp) {
      // Dashboard: mark as paid checked by default, editable line items from invoice (or start fresh)
      setMarkAsPaid(true)
      setAppointmentId(invoiceProp.appointmentId || "unlinked")
      setWaiveConsultation(false)
      setProcedureLines([])
      setDiscountPercent(0)
      setProcedureInput("")
      setProcedureAmount("")
      setMethod("cash")
      setCreateDueForRemainder(true)

      // If invoice has line items, pre-fill them; otherwise load consultation from pricing
      let cancelled = false
      if (invoiceProp.lineItems && invoiceProp.lineItems.length > 0) {
        const consultation = invoiceProp.lineItems.find((i) => i.type === "consultation")
        const waived = consultation?.amount === 0
        setWaiveConsultation(waived)
        setConsultationAmount(waived ? 0 : (consultation?.amount ?? 500))
        setProcedureLines(
          invoiceProp.lineItems
            .filter((i) => i.type === "procedure")
            .map((i) => ({ id: i.id, label: i.label, amount: i.amount }))
        )
        const discountLine = invoiceProp.lineItems.find((i) => i.type === "discount")
        const discAmt = discountLine ? -discountLine.amount : 0
        const st =
          (invoiceProp.lineItems.find((i) => i.type === "consultation")?.amount ?? 0) +
          invoiceProp.lineItems
            .filter((i) => i.type === "procedure")
            .reduce((s, i) => s + i.amount, 0)
        const pct = st > 0 && discAmt > 0 ? Math.round((100 * discAmt) / st) : 0
        const snapped = (pct <= 5 ? 0 : pct <= 15 ? 10 : pct <= 25 ? 20 : 30) as 0 | 10 | 20 | 30
        setDiscountPercent(snapped)
        setAmountToCollect(String(invoiceProp.amount))
      } else {
        // No line items: load consultation price
        getPriceForAppointmentType({ clinicId, doctorId, appointmentType: "Consultation" })
          .then((price) => {
            if (cancelled) return
            setConsultationAmount(price ?? 500)
            setAmountToCollect(String(price ?? 500))
          })
      }
      return () => { cancelled = true }
    }

    if (mode === "invoice-and-pay" && !invoiceProp && patientAppointments.length > 0) {
      // Dashboard create-invoice: default to selected appointment, mark as paid on by default
      setMarkAsPaid(true)
      const first = defaultAppointmentId ?? sortedAppointments[0]?.id ?? "unlinked"
      setAppointmentId(first === "unlinked" ? "unlinked" : first)
      setWaiveConsultation(false)
      setProcedureLines([])
      setDiscountPercent(0)
      setProcedureInput("")
      setProcedureAmount("")
      setMethod("cash")
      setCreateDueForRemainder(true)
      let cancelled = false
      const apt = sortedAppointments[0]
      const clinicIdFinal = apt?.clinic_id || currentClinic?.id || "clinic-001"
      const doctorIdFinal = apt?.doctor_id || currentUser?.id || "user-001"
      getPriceForAppointmentType({ clinicId: clinicIdFinal, doctorId: doctorIdFinal, appointmentType: "Consultation" })
        .then((price) => {
          if (cancelled) return
          const p = price ?? 500
          setConsultationAmount(p)
          setAmountToCollect(String(p))
        })
      return () => { cancelled = true }
    }

    if (mode === "update-due-only") {
      // Profile: mark as paid unchecked, editable line items
      setMarkAsPaid(false)
      const mostRecent = sortedAppointments[0]
      setAppointmentId(mostRecent?.id ?? "unlinked")
      setWaiveConsultation(false)
      setProcedureLines([])
      setDiscountPercent(0)
      setProcedureInput("")
      setProcedureAmount("")
      setMethod("cash")
      setCreateDueForRemainder(true)
      let cancelled = false
      const clinicIdFinal = currentClinic?.id || "clinic-001"
      const doctorIdFinal = currentUser?.id || "user-001"
      getPriceForAppointmentType({ clinicId: clinicIdFinal, doctorId: doctorIdFinal, appointmentType: "Consultation" })
        .then((price) => {
          if (cancelled) return
          setConsultationAmount(price ?? 500)
        })
      return () => { cancelled = true }
    }

    if (mode === "capture-only") {
      setCapturePatient(null)
      setCapturePatientDisplay("")
      setCaptureAppointmentId("")
      setCaptureServiceAmount(null)
      setAmountToCollect("")
      setCaptureReason("")
      setMethod("cash")
      setCreateDueForRemainder(true)
    }
  }, [open, mode, invoiceProp, currentClinic?.id, currentUser?.id, sortedAppointments, patientAppointments.length, defaultAppointmentId])

  useEffect(() => {
    if (mode !== "capture-only") return
    setCaptureAppointmentId("")
    setCaptureServiceAmount(null)
    setAmountToCollect("")
    setCaptureReason("")
  }, [mode, capturePatient?.id])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (procedureAutocompleteRef.current && !procedureAutocompleteRef.current.contains(e.target as Node)) {
        setShowProcedureSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    let cancelled = false
    if (!open || mode !== "capture-only" || !captureSelectedApt || !currentClinic?.id) return
    getPriceForAppointmentType({
      clinicId: currentClinic.id,
      doctorId: captureSelectedApt.doctor_id || "user-001",
      appointmentType: captureSelectedApt.type,
    }).then((price) => {
      if (cancelled) return
      const next = price ?? 0
      setCaptureServiceAmount(next)
      setAmountToCollect(next ? String(next) : "")
    })
    return () => { cancelled = true }
  }, [open, mode, captureSelectedApt, currentClinic?.id])

  const addFromService = (type: string) => {
    const amount = pricing[type] ?? 0
    if (amount <= 0) return
    setProcedureLines((prev) => [
      ...prev,
      { id: `proc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`, label: type, amount },
    ])
    setProcedureInput("")
    setShowProcedureSuggestions(false)
  }

  const addCustom = () => {
    const n = Number(procedureAmount)
    if (!procedureInput.trim() || !Number.isFinite(n) || n <= 0) return
    setProcedureLines((prev) => [
      ...prev,
      {
        id: `proc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        label: procedureInput.trim(),
        amount: n,
      },
    ])
    setProcedureInput("")
    setProcedureAmount("")
    setShowProcedureSuggestions(false)
  }

  const removeProcedure = (id: string) => {
    setProcedureLines((prev) => prev.filter((p) => p.id !== id))
  }

  const subTotal = useMemo(() => {
    const consult = waiveConsultation ? 0 : consultationAmount
    const procs = procedureLines.reduce((s, p) => s + p.amount, 0)
    return consult + procs
  }, [waiveConsultation, consultationAmount, procedureLines])

  const discountAmount = subTotal * (discountPercent / 100)
  const total = Math.max(0, subTotal - discountAmount)

  const parsedAmount = amountToCollect ? Number(amountToCollect) : NaN
  const hasAmountChanged = total > 0 && Number.isFinite(parsedAmount) && Math.abs(parsedAmount - total) > 0.0001

  const captureEffectiveService = captureServiceAmount ?? 0
  const captureHasAmountChanged =
    captureEffectiveService > 0 &&
    Number.isFinite(parsedAmount) &&
    Math.abs(parsedAmount - captureEffectiveService) > 0.0001

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentClinic) return
    setUploadingProof(true)
    try {
      const uploaded = await uploadFile({
        clinicId: currentClinic.id,
        entityType: "payment",
        entityId: invoiceProp?.id ?? `temp_${Date.now()}`,
        file,
      })
      setProofFileId(uploaded.fileId)
      setProofFile(file)
      showToast("Proof uploaded", "success")
    } catch (error) {
      showToast("Failed to upload proof", "error")
    } finally {
      setUploadingProof(false)
    }
  }

  const handleSubmit = async () => {
    if (captureOnlyMode && captureSelectedApt && currentClinic?.id && currentUser?.id) {
      const clinicId = captureSelectedApt.clinic_id || currentClinic.id
      const doctorId = captureSelectedApt.doctor_id || "user-001"
      const patientId = captureSelectedApt.patient_id
      const aptId = captureSelectedApt.id
      const appointmentType = captureSelectedApt.type
      const svc = captureServiceAmount ?? 0

      if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
        showToast("Please enter a valid amount", "error")
        return
      }
      if (captureHasAmountChanged && !captureReason) {
        showToast("Please select a reason for changing the amount", "error")
        return
      }

      setLoading(true)
      try {
        const isFullPayment = !captureHasAmountChanged
        const isPaymentLater = captureReason === "payment_later"
        const remainder = svc - parsedAmount
        const shouldCreateDue = isPaymentLater && createDueForRemainder && remainder > 0.01

        if (isFullPayment) {
          const invoice = await createInvoiceForArrivedAppointment({
            id: aptId,
            clinic_id: clinicId,
            doctor_id: doctorId,
            patient_id: patientId,
            type: appointmentType,
          })
          await createInvoiceLinkedPayment({
            clinicId: invoice.clinicId,
            invoiceId: invoice.id,
            patientId: invoice.patientId,
            appointmentId: invoice.appointmentId,
            amount: parsedAmount,
            method: "cash",
            createdByUserId: currentUser?.id ?? "user-001",
          })
          await markInvoicePaid(invoice.id)
          showToast("Payment captured successfully", "success")
        } else if (isPaymentLater) {
          const { dueInvoice } = await recordPartialPaymentWithOptionalDue({
            clinicId,
            doctorId,
            patientId,
            appointmentId: aptId,
            appointmentType,
            amountPaid: parsedAmount,
            serviceAmount: svc,
            createDueForRemainder: shouldCreateDue,
            createdByUserId: currentUser?.id ?? "user-001",
          })
          if (dueInvoice) {
            showToast(`Payment captured. Due record created for ${dueInvoice.amount.toFixed(2)} EGP.`, "success")
          } else {
            showToast("Payment captured successfully", "success")
          }
        } else {
          const invoice = await createInvoiceWithAmount({
            clinicId,
            doctorId,
            patientId,
            appointmentId: aptId,
            appointmentType,
            amount: parsedAmount,
          })
          await createInvoiceLinkedPayment({
            clinicId: invoice.clinicId,
            invoiceId: invoice.id,
            patientId: invoice.patientId,
            appointmentId: invoice.appointmentId,
            amount: parsedAmount,
            method: "cash",
            createdByUserId: currentUser?.id ?? "user-001",
          })
          await markInvoicePaid(invoice.id)
          showToast("Payment captured successfully", "success")
        }
        onSuccess()
        onOpenChange(false)
      } catch (error) {
        showToast(error instanceof Error ? error.message : "Failed to capture payment", "error")
      } finally {
        setLoading(false)
      }
      return
    }

    if (payOnlyMode && invoiceProp) {
      // Dues: pay-only mode
      setLoading(true)
      try {
        const isFullPayment = !hasAmountChanged
        const remainder = invoiceProp.amount - parsedAmount
        const shouldCreateDue = createDueForRemainder && remainder > 0.01

        if (isFullPayment) {
          await createInvoiceLinkedPayment({
            clinicId: invoiceProp.clinicId,
            invoiceId: invoiceProp.id,
            patientId: invoiceProp.patientId,
            appointmentId: invoiceProp.appointmentId,
            amount: parsedAmount,
            method,
            proofFileId: method !== "cash" ? proofFileId : undefined,
            createdByUserId: currentUser?.id ?? "user-001",
          })
          await markInvoicePaid(invoiceProp.id)
          showToast("Payment recorded successfully", "success")
        } else {
          await voidInvoice(invoiceProp.id)
          const { dueInvoice } = await recordPartialPaymentWithOptionalDue({
            clinicId: invoiceProp.clinicId,
            doctorId: invoiceProp.doctorId,
            patientId: invoiceProp.patientId,
            appointmentId: invoiceProp.appointmentId,
            appointmentType: invoiceProp.appointmentType,
            amountPaid: parsedAmount,
            serviceAmount: invoiceProp.amount,
            createDueForRemainder: shouldCreateDue,
            createdByUserId: currentUser?.id ?? "user-001",
          })
          if (dueInvoice) {
            showToast(`Payment recorded. Due record created for ${dueInvoice.amount.toFixed(2)} EGP.`, "success")
          } else {
            showToast("Payment recorded successfully", "success")
          }
        }
        onSuccess()
        onOpenChange(false)
      } catch (error) {
        showToast("Failed to record payment", "error")
      } finally {
        setLoading(false)
      }
      return
    }

    if (mode === "invoice-and-pay" && !invoiceProp && selectedApt && patientId) {
      // Dashboard create-invoice: create new invoice, set line items, then optionally pay
      setLoading(true)
      try {
        const clinicId = selectedApt.clinic_id || currentClinic?.id || "clinic-001"
        const doctorId = selectedApt.doctor_id || currentUser?.id || "user-001"
        const inv = await createInvoiceWithAmount({
          clinicId,
          doctorId,
          patientId,
          appointmentId: selectedApt.id,
          appointmentType: selectedApt.type || "Consultation",
          amount: total,
        })
        const updated = await updateInvoiceLineItems({
          invoiceId: inv.id,
          consultationWaived: waiveConsultation,
          consultationAmount: waiveConsultation ? 0 : consultationAmount,
          procedureLines: procedureLines.map((p) => ({ id: p.id, label: p.label, amount: p.amount })),
          discountAmount,
        })

        if (markAsPaid) {
          const isFullPayment = !hasAmountChanged
          const remainder = total - parsedAmount
          const shouldCreateDue = createDueForRemainder && remainder > 0.01
          if (isFullPayment) {
            await createInvoiceLinkedPayment({
              clinicId: updated.clinicId,
              invoiceId: updated.id,
              patientId: updated.patientId,
              appointmentId: updated.appointmentId,
              amount: parsedAmount,
              method,
              proofFileId: method !== "cash" ? proofFileId : undefined,
              createdByUserId: currentUser?.id ?? "user-001",
            })
            await markInvoicePaid(updated.id)
            showToast("Payment recorded successfully", "success")
          } else {
            await voidInvoice(updated.id)
            const { dueInvoice } = await recordPartialPaymentWithOptionalDue({
              clinicId: updated.clinicId,
              doctorId: updated.doctorId,
              patientId: updated.patientId,
              appointmentId: updated.appointmentId ?? "",
              appointmentType: updated.appointmentType ?? "Consultation",
              amountPaid: parsedAmount,
              serviceAmount: total,
              createDueForRemainder: shouldCreateDue,
              createdByUserId: currentUser?.id ?? "user-001",
            })
            if (dueInvoice) {
              showToast(`Payment recorded. Due record created for ${dueInvoice.amount.toFixed(2)} EGP.`, "success")
            } else {
              showToast("Payment recorded successfully", "success")
            }
          }
        } else {
          showToast(`Invoice created: ${total.toFixed(2)} EGP`, "success")
        }
        onSuccess()
        onOpenChange(false)
      } catch (error) {
        showToast("Failed to create invoice", "error")
      } finally {
        setLoading(false)
      }
      return
    }

    if (mode === "invoice-and-pay" && invoiceProp) {
      // Dashboard: update existing invoice line items, then optionally pay
      setLoading(true)
      try {
        await updateInvoiceLineItems({
          invoiceId: invoiceProp.id,
          consultationWaived: waiveConsultation,
          consultationAmount: waiveConsultation ? 0 : consultationAmount,
          procedureLines: procedureLines.map((p) => ({ id: p.id, label: p.label, amount: p.amount })),
          discountAmount,
        })

        if (markAsPaid) {
          // Pay full or partial
          const isFullPayment = !hasAmountChanged
          const remainder = total - parsedAmount
          const shouldCreateDue = createDueForRemainder && remainder > 0.01

          if (isFullPayment) {
            await createInvoiceLinkedPayment({
              clinicId: invoiceProp.clinicId,
              invoiceId: invoiceProp.id,
              patientId: invoiceProp.patientId,
              appointmentId: invoiceProp.appointmentId,
              amount: parsedAmount,
              method,
              proofFileId: method !== "cash" ? proofFileId : undefined,
              createdByUserId: currentUser?.id ?? "user-001",
            })
            await markInvoicePaid(invoiceProp.id)
            showToast("Payment recorded successfully", "success")
          } else {
            await voidInvoice(invoiceProp.id)
            const { dueInvoice } = await recordPartialPaymentWithOptionalDue({
              clinicId: invoiceProp.clinicId,
              doctorId: invoiceProp.doctorId,
              patientId: invoiceProp.patientId,
              appointmentId: invoiceProp.appointmentId,
              appointmentType: invoiceProp.appointmentType,
              amountPaid: parsedAmount,
              serviceAmount: total,
              createDueForRemainder: shouldCreateDue,
              createdByUserId: currentUser?.id ?? "user-001",
            })
            if (dueInvoice) {
              showToast(`Payment recorded. Due record created for ${dueInvoice.amount.toFixed(2)} EGP.`, "success")
            } else {
              showToast("Payment recorded successfully", "success")
            }
          }
        } else {
          showToast(`Invoice updated: ${total.toFixed(2)} EGP`, "success")
        }
        onSuccess()
        onOpenChange(false)
      } catch (error) {
        showToast("Failed to update invoice", "error")
      } finally {
        setLoading(false)
      }
      return
    }

    if (mode === "update-due-only") {
      setLoading(true)
      try {
        const draft = await getOrCreateDraftDue({
          patientId: patientId!,
          clinicId: currentClinic?.id || "clinic-001",
          doctorId: currentUser?.id || "user-001",
          appointmentId: appointmentId === "unlinked" ? null : appointmentId,
        })
        const draftUpdated = await addOrUpdateCharges({
          draftDueId: draft.id,
          consultationWaived: waiveConsultation,
          consultationAmount: waiveConsultation ? 0 : consultationAmount,
          procedureLines: procedureLines.map((p) => ({ id: p.id, label: p.label, amount: p.amount })),
          discountAmount,
        })
        if (markAsPaid && total > 0) {
          // Create real invoice + payment in single store, then clear draft
          const clinicId = currentClinic?.id || "clinic-001"
          const doctorId = currentUser?.id || "user-001"
          const aptId = appointmentId === "unlinked" ? "" : appointmentId
          const inv = await createInvoiceWithAmount({
            clinicId,
            doctorId,
            patientId: patientId!,
            appointmentId: aptId,
            appointmentType: "Consultation",
            amount: total,
          })
          const updated = await updateInvoiceLineItems({
            invoiceId: inv.id,
            consultationWaived: waiveConsultation,
            consultationAmount: waiveConsultation ? 0 : consultationAmount,
            procedureLines: procedureLines.map((p) => ({ id: p.id, label: p.label, amount: p.amount })),
            discountAmount,
          })
          const isFullPayment = !hasAmountChanged
          const remainder = total - parsedAmount
          const shouldCreateDue = createDueForRemainder && remainder > 0.01
          if (isFullPayment) {
            await createInvoiceLinkedPayment({
              clinicId: updated.clinicId,
              invoiceId: updated.id,
              patientId: updated.patientId,
              appointmentId: updated.appointmentId,
              amount: parsedAmount,
              method,
              proofFileId: method !== "cash" ? proofFileId : undefined,
              createdByUserId: currentUser?.id ?? "user-001",
            })
            await markInvoicePaid(updated.id)
            showToast("Payment recorded successfully", "success")
          } else {
            await voidInvoice(updated.id)
            const { dueInvoice } = await recordPartialPaymentWithOptionalDue({
              clinicId: updated.clinicId,
              doctorId: updated.doctorId,
              patientId: updated.patientId,
              appointmentId: updated.appointmentId ?? "",
              appointmentType: updated.appointmentType ?? "Consultation",
              amountPaid: parsedAmount,
              serviceAmount: total,
              createDueForRemainder: shouldCreateDue,
              createdByUserId: currentUser?.id ?? "user-001",
            })
            if (dueInvoice) {
              showToast(`Payment recorded. Due created for ${dueInvoice.amount.toFixed(2)} EGP.`, "success")
            } else {
              showToast("Payment recorded successfully", "success")
            }
          }
          await clearDraftDue(draftUpdated.id)
        } else {
          showToast(`Due updated: ${total.toFixed(2)} EGP`, "success")
        }
        onSuccess()
        onOpenChange(false)
      } catch (error) {
        showToast("Failed to update due", "error")
      } finally {
        setLoading(false)
      }
      return
    }
  }

  const appointmentData = payOnlyMode && invoiceProp ? getAppointmentData(invoiceProp.appointmentId) : null

  const canSubmit = payOnlyMode
    ? Number.isFinite(parsedAmount) && parsedAmount > 0
    : captureOnlyMode
    ? !!capturePatient &&
      !!captureSelectedApt &&
      Number.isFinite(parsedAmount) &&
      parsedAmount >= 0 &&
      (!captureHasAmountChanged || !!captureReason)
    : showLineItems
    ? (total > 0 || waiveConsultation) &&
      !(mode === "invoice-and-pay" && !invoiceProp && !selectedApt)
    : false

  const title = "Create invoice"
  const submitLabel = payOnlyMode
    ? "Mark as Paid"
    : captureOnlyMode
    ? "Capture"
    : markAsPaid
    ? "Save & Mark as Paid"
    : "Update due"

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="right" className="w-full sm:max-w-2xl">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <RiMoneyDollarCircleLine className="size-5 text-primary-600" />
            {title}
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <div className="space-y-5">
            {/* Pay-only: invoice summary */}
            {payOnlyMode && invoiceProp && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-50">Appointment Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <RiUserLine className="size-5 shrink-0 text-gray-600 dark:text-gray-400" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 dark:text-gray-400">Patient</div>
                      <div className="font-medium text-gray-900 dark:text-gray-50">
                        {getPatientName(invoiceProp.patientId)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RiStethoscopeLine className="size-5 shrink-0 text-gray-600 dark:text-gray-400" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 dark:text-gray-400">Doctor</div>
                      <div className="font-medium text-gray-900 dark:text-gray-50">
                        {getDoctorName(invoiceProp.doctorId)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RiStethoscopeLine className="size-5 shrink-0 text-gray-600 dark:text-gray-400" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 dark:text-gray-400">Appointment Type</div>
                      <div className="font-medium text-gray-900 dark:text-gray-50 capitalize">
                        {invoiceProp.appointmentType}
                      </div>
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
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-50">
                        {invoiceProp.amount.toFixed(2)} EGP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pay-only: payment form (amount, method, proof) */}
            {payOnlyMode && invoiceProp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="amount-payonly">
                    Amount to collect (EGP) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="amount-payonly"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amountToCollect}
                    onChange={(e) => setAmountToCollect(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                  {(() => {
                    const partial = Number.isFinite(parsedAmount) && Math.abs(parsedAmount - invoiceProp.amount) > 0.0001
                    return partial ? (
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Collecting {parsedAmount.toFixed(2)} of {invoiceProp.amount.toFixed(2)} EGP (partial payment)
                      </p>
                    ) : null
                  })()}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method-payonly">
                    Payment method <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    id="method-payonly"
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
                    <Label htmlFor="proof-payonly">
                      Payment proof <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="proof-payonly"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploadingProof}
                        className="flex-1"
                      />
                      {proofFile && (
                        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <RiFileLine className="size-4" />
                          {proofFile.name}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {Number.isFinite(parsedAmount) &&
                  Math.abs(parsedAmount - invoiceProp.amount) > 0.0001 &&
                  parsedAmount < invoiceProp.amount && (
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
                      <input
                        type="checkbox"
                        id="create-due-payonly"
                        checked={createDueForRemainder}
                        onChange={(e) => setCreateDueForRemainder(e.target.checked)}
                        className="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 dark:border-gray-700"
                      />
                      <Label htmlFor="create-due-payonly" className="flex-1 cursor-pointer text-sm">
                        Create due for remainder ({(invoiceProp.amount - parsedAmount).toFixed(2)} EGP)
                      </Label>
                    </div>
                  )}
              </>
            )}

            {/* Capture-only (Income tab): patient + appointment, then pay */}
            {captureOnlyMode && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="capture-patient">
                    Patient <span className="text-red-500">*</span>
                  </Label>
                  <PatientAutocomplete
                    value={capturePatientDisplay}
                    onChange={(v) => {
                      setCapturePatientDisplay(v)
                      if (!v.trim()) setCapturePatient(null)
                    }}
                    onSelect={(p) => {
                      setCapturePatient(p)
                      setCapturePatientDisplay(p.displayName)
                    }}
                    placeholder="Search by name or phone"
                  />
                </div>
                {capturePatient && (
                  <div className="space-y-2">
                    <Label htmlFor="capture-appointment">
                      Appointment <span className="text-red-500">*</span>
                    </Label>
                    {captureAppointments.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No appointments found for this patient.
                      </p>
                    ) : (
                      <Select
                        id="capture-appointment"
                        value={captureAppointmentId}
                        onChange={(e) => setCaptureAppointmentId(e.target.value)}
                      >
                        <option value="" disabled>
                          Select an appointment
                        </option>
                        {captureAppointments.map((apt) => (
                          <option key={apt.id} value={apt.id}>
                            {formatAptLabel(apt as PatientAppointment)}
                          </option>
                        ))}
                      </Select>
                    )}
                  </div>
                )}
                {captureSelectedApt && captureServiceAmount !== null && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Service ({captureSelectedApt.type})
                    </p>
                    <p className="mt-0.5 text-lg font-semibold text-gray-900 dark:text-gray-50">
                      {captureServiceAmount.toFixed(2)} EGP
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="capture-amount">
                    Amount to collect (EGP) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="capture-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amountToCollect}
                    onChange={(e) => setAmountToCollect(e.target.value)}
                    placeholder="0.00"
                    disabled={!captureSelectedApt}
                  />
                  {captureEffectiveService > 0 && captureHasAmountChanged && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Collecting {parsedAmount.toFixed(2)} of {captureEffectiveService.toFixed(2)} EGP — select a
                      reason below.
                    </p>
                  )}
                </div>
                {captureHasAmountChanged && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="capture-reason">
                        Reason for change <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        id="capture-reason"
                        value={captureReason}
                        onChange={(e) => setCaptureReason(e.target.value as AmountChangeReason)}
                      >
                        <option value="" disabled>
                          Select reason
                        </option>
                        <option value="payment_later">Pay the rest later</option>
                        <option value="discount_applied">Discount applied</option>
                      </Select>
                    </div>
                    {captureReason === "payment_later" &&
                      captureEffectiveService > 0 &&
                      parsedAmount < captureEffectiveService && (
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            checked={createDueForRemainder}
                            onChange={(e) => setCreateDueForRemainder(e.target.checked)}
                            className="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 dark:border-gray-700"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Create due record for remaining{" "}
                            {(captureEffectiveService - parsedAmount).toFixed(2)} EGP
                          </span>
                        </label>
                      )}
                  </>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Capture from this drawer supports cash only.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="capture-proof">Proof of payment (optional)</Label>
                  <Input
                    id="capture-proof"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    disabled={uploadingProof}
                    className="flex-1"
                  />
                  {proofFileId && (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <RiFileLine className="size-4" />
                      Proof uploaded
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Line items (invoice-and-pay, update-due-only) */}
            {showLineItems && (
              <>
                {/* Appointment dropdown (update-due-only or invoice-and-pay create mode) */}
                {(mode === "update-due-only" || (mode === "invoice-and-pay" && !invoiceProp)) && (
                  <div className="space-y-2">
                    <Label>Appointment</Label>
                    <Select value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)}>
                      {!(mode === "invoice-and-pay" && !invoiceProp) && (
                        <option value="unlinked">Unlinked</option>
                      )}
                      {sortedAppointments.map((apt) => (
                        <option key={apt.id} value={apt.id}>
                          {formatAptLabel(apt)}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}

                {/* Procedures: consultation first, then other lines */}
                <div className="space-y-3">
                  <Label>Procedures</Label>
                  <ul className="space-y-2">
                    {/* Consultation as first procedure */}
                    <li className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-950">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {waiveConsultation ? "Consultation — Waived" : "Consultation"}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {waiveConsultation ? "0.00" : consultationAmount.toFixed(2)} EGP
                        </span>
                        <label className="flex cursor-pointer items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={waiveConsultation}
                            onChange={(e) => setWaiveConsultation(e.target.checked)}
                            className="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 dark:border-gray-700"
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400">Waive</span>
                        </label>
                      </div>
                    </li>
                    {procedureLines.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-950"
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {p.label}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {p.amount.toFixed(2)} EGP
                          </span>
                          <button
                            type="button"
                            onClick={() => removeProcedure(p.id)}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800 dark:hover:text-red-400"
                            aria-label="Remove line"
                          >
                            <RiDeleteBinLine className="size-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div ref={procedureAutocompleteRef} className="flex flex-1 flex-wrap gap-2">
                    <div className="relative min-w-0 flex-1">
                      <Input
                        placeholder="Search or add procedure"
                        value={procedureInput}
                        onChange={(e) => {
                          setProcedureInput(e.target.value)
                          setShowProcedureSuggestions(true)
                        }}
                        onFocus={() => setShowProcedureSuggestions(true)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && procedureSuggestions.length > 0 && procedureInput.trim()) {
                            const match = procedureSuggestions.find(
                              (s) => s.label.toLowerCase() === procedureInput.trim().toLowerCase()
                            )
                            if (match && match.amount > 0) {
                              e.preventDefault()
                              addFromService(match.label)
                              return
                            }
                          }
                          if (e.key === "Enter" && procedureInput.trim() && Number(procedureAmount) > 0) {
                            e.preventDefault()
                            addCustom()
                          }
                        }}
                        className="min-w-0"
                        autoComplete="off"
                      />
                      {showProcedureSuggestions && (
                        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                          {procedureSuggestions.length > 0 ? (
                            procedureSuggestions.map((s) => (
                              <button
                                key={s.label}
                                type="button"
                                onClick={() => addFromService(s.label)}
                                className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm text-gray-900 hover:bg-gray-50 dark:text-gray-50 dark:hover:bg-gray-800"
                              >
                                <span className="font-medium">{s.label}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {(s.amount ?? 0).toFixed(0)} EGP
                                </span>
                              </button>
                            ))
                          ) : procedureInput.trim() ? (
                            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                              No saved services match. Type amount and tap Add for custom.
                            </div>
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                              Type to search saved services, or enter a custom label.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Amount"
                      value={procedureAmount}
                      onChange={(e) => setProcedureAmount(e.target.value)}
                      className="w-24"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={addCustom}
                      disabled={
                        !procedureInput.trim() ||
                        !Number(procedureAmount) ||
                        Number(procedureAmount) <= 0
                      }
                    >
                      <RiAddLine className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Mark as paid: simple checkbox (no banner) */}
                {!payOnlyMode && !captureOnlyMode && (
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      id="mark-as-paid"
                      checked={markAsPaid}
                      onChange={(e) => {
                        setMarkAsPaid(e.target.checked)
                        if (e.target.checked && total > 0) setAmountToCollect(String(total))
                      }}
                      className="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 dark:border-gray-700"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Mark as paid</span>
                  </label>
                )}

                {/* Payment section: below checkbox, before total (only when mark as paid checked) */}
                {!captureOnlyMode && (showPaymentSection || payOnlyMode) && markAsPaid && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="amount">
                        Amount collected (EGP) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={amountToCollect}
                        onChange={(e) => setAmountToCollect(e.target.value)}
                        placeholder="0.00"
                        required
                      />
                      {hasAmountChanged && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Collecting {parsedAmount.toFixed(2)} of {total.toFixed(2)} EGP (partial payment)
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="method">
                        Payment method <span className="text-red-500">*</span>
                      </Label>
                      <Select id="method" value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
                        <option value="cash">Cash</option>
                        <option value="visa">Visa</option>
                        <option value="instapay">InstaPay</option>
                      </Select>
                    </div>

                    {(method === "visa" || method === "instapay") && (
                      <div className="space-y-2">
                        <Label htmlFor="proof">
                          Payment proof <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="proof"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploadingProof}
                            className="flex-1"
                          />
                          {proofFile && (
                            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                              <RiFileLine className="size-4" />
                              {proofFile.name}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {hasAmountChanged && (
                      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
                        <input
                          type="checkbox"
                          id="create-due"
                          checked={createDueForRemainder}
                          onChange={(e) => setCreateDueForRemainder(e.target.checked)}
                          className="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 dark:border-gray-700"
                        />
                        <Label htmlFor="create-due" className="flex-1 cursor-pointer text-sm">
                          Create due for remainder ({(total - parsedAmount).toFixed(2)} EGP)
                        </Label>
                      </div>
                    )}
                  </>
                )}

                {/* Total */}
                {showLineItems && (
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/30">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Total</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {total.toFixed(2)} EGP
                    </span>
                  </div>
                )}

                {/* Discount chips (below total); none selected = no discount */}
                {showLineItems && (
                  <div className="space-y-2">
                    <Label>Discount</Label>
                    <div className="flex flex-wrap gap-2">
                      {([10, 20, 30] as const).map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setDiscountPercent(discountPercent === val ? 0 : val)}
                          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                            discountPercent === val
                              ? "bg-primary-600 text-white dark:bg-primary-500"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                          }`}
                        >
                          {val}%
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
            {loading ? "Processing…" : submitLabel}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
