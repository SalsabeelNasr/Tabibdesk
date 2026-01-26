"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card"
import { Badge } from "@/components/Badge"
import { RiCapsuleLine, RiAddLine } from "@remixicon/react"
import { Button } from "@/components/Button"
import type { PastMedication } from "@/features/prescriptions/prescriptions.types"

interface PastMedicationsProps {
  medications: PastMedication[]
  onAddMedication?: () => void
}

export function PastMedications({ medications, onAddMedication }: PastMedicationsProps) {
  const sortedMedications = [...medications].sort(
    (a, b) => new Date(b.takenFrom).getTime() - new Date(a.takenFrom).getTime()
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RiCapsuleLine className="size-5 text-secondary-600 dark:text-secondary-400" />
            <CardTitle>Past Medications</CardTitle>
          </div>
          {onAddMedication && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddMedication}
              className="h-8 gap-2"
            >
              <RiAddLine className="size-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {sortedMedications.length === 0 ? (
          <div className="py-8 text-center">
            <RiCapsuleLine className="mx-auto size-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">No past medications recorded</p>
            {onAddMedication && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddMedication}
                className="mt-3"
              >
                Add Past Medication
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedMedications.map((medication) => (
              <div
                key={medication.id}
                className="flex items-start justify-between rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3 transition hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900/20 shrink-0">
                      <RiCapsuleLine className="size-4 text-secondary-600 dark:text-secondary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        {medication.name}
                      </h4>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span>Duration: {medication.duration}</span>
                        <span>•</span>
                        <span>
                          From: {formatDate(medication.takenFrom)}
                        </span>
                        {medication.takenTo && (
                          <>
                            <span>•</span>
                            <span>To: {formatDate(medication.takenTo)}</span>
                          </>
                        )}
                        {!medication.takenTo && (
                          <Badge variant="success" className="text-xs">Ongoing</Badge>
                        )}
                      </div>
                      {medication.notes && (
                        <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400">
                          {medication.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
