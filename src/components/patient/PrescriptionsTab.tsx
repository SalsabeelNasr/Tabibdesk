"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card"
import { Badge } from "@/components/Badge"
import { RiCapsuleLine, RiTimeLine } from "@remixicon/react"
import type { Prescription } from "@/features/prescriptions/prescriptions.types"

interface PrescriptionsTabProps {
  prescriptions: Prescription[]
}

export function PrescriptionsTab({ prescriptions }: PrescriptionsTabProps) {
  // Sort prescriptions by date (newest first)
  const sortedPrescriptions = [...prescriptions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return date.toLocaleDateString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (sortedPrescriptions.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <RiCapsuleLine className="mx-auto size-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">No prescriptions yet</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Get started by adding a prescription.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sortedPrescriptions.map((prescription) => (
        <Card key={prescription.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm">
                  {formatDate(prescription.createdAt)}
                </CardTitle>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <RiTimeLine className="size-4" />
                  <span>{formatRelativeTime(prescription.createdAt)}</span>
                  {prescription.visitType && (
                    <>
                      <span className="mx-1">•</span>
                      <Badge variant="neutral" className="text-xs">
                        {prescription.visitType === "in_clinic" ? "In Clinic" : "Online"}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Diagnosis */}
            {prescription.diagnosisText && (
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Diagnosis</p>
                <p className="text-sm text-gray-900 dark:text-gray-50">{prescription.diagnosisText}</p>
              </div>
            )}

            {/* Medications List */}
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Medications</p>
              <div className="space-y-3">
                {prescription.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30 p-3"
                  >
                    <div className="flex size-8 items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900/20 shrink-0">
                      <RiCapsuleLine className="size-4 text-secondary-600 dark:text-secondary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                            {item.name}
                            {item.strength && <span className="text-gray-600 dark:text-gray-400"> {item.strength}</span>}
                            {item.form && <span className="text-gray-500 dark:text-gray-500"> ({item.form})</span>}
                          </h4>
                          <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">{item.sig}</p>
                          {item.duration && (
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <span>Duration: {item.duration}</span>
                            </div>
                          )}
                          {item.notes && (
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 italic">{item.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes to Patient */}
            {prescription.notesToPatient && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Notes to Patient</p>
                <p className="text-sm text-gray-900 dark:text-gray-50">{prescription.notesToPatient}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

