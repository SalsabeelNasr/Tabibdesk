"use client"

import { Badge } from "@/components/Badge"
import { RiCapsuleLine } from "@remixicon/react"

interface Medication {
  id: string
  patient_id: string
  name: string
  status: string
  notes: string | null
  created_at: string
}

interface MedicationsTabProps {
  medications: Medication[]
}

export function MedicationsTab({ medications }: MedicationsTabProps) {
  const activeMedications = medications.filter((m) => m.status === "active")
  const inactiveMedications = medications.filter((m) => m.status !== "active")

  return (
    <div className="p-4">
      {activeMedications.length > 0 ? (
        <div className="space-y-2">
          {activeMedications.map((medication) => (
            <div
              key={medication.id}
              className="flex items-start justify-between rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 transition hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900/20">
                  <RiCapsuleLine className="size-5 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">{medication.name}</h4>
                  {medication.notes && (
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{medication.notes}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    Started: {new Date(medication.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <RiCapsuleLine className="mx-auto size-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">No active medications</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Get started by adding a medication.</p>
        </div>
      )}

      {inactiveMedications.length > 0 && (
        <div className="mt-6 space-y-2">
          {inactiveMedications.map((medication) => (
            <div
              key={medication.id}
              className="flex items-start justify-between rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 opacity-60"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <RiCapsuleLine className="size-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">{medication.name}</h4>
                  {medication.notes && (
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{medication.notes}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    Started: {new Date(medication.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge variant="default">{medication.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

