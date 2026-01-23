"use client"

import { Button } from "@/components/Button"
import { Card, CardContent } from "@/components/Card"
import { RiUserAddLine } from "@remixicon/react"

interface EmptyPatientsStateProps {
  hasSearchQuery: boolean
  onAddPatient: () => void
}

export function EmptyPatientsState({ hasSearchQuery, onAddPatient }: EmptyPatientsStateProps) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          {hasSearchQuery
            ? "No patients found matching your search."
            : "No patients yet. Add your first patient to get started."}
        </p>
        {!hasSearchQuery && (
          <Button variant="primary" onClick={onAddPatient} className="mt-4">
            <RiUserAddLine className="mr-2 size-4" />
            Add Your First Patient
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
