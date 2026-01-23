"use client"

import { Badge } from "@/components/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card"
import { RiPhoneLine, RiStethoscopeLine } from "@remixicon/react"
import Link from "next/link"
import type { PatientListItem } from "./patients.types"
import { calculateAge, getStatusBadgeVariant, getStatusLabel } from "./patients.utils"

interface PatientsCardsProps {
  patients: PatientListItem[]
}

export function PatientsCards({ patients }: PatientsCardsProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {patients.map((patient) => {
        const age = calculateAge(patient.date_of_birth, patient.age)
        const ageDisplay = typeof age === "number" ? `${age}y` : age

        return (
          <Card
            key={patient.id}
            className="cursor-pointer transition-shadow hover:shadow-lg"
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <Link href={`/patients/${patient.id}`}>
                    <CardTitle className="text-lg text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                      {patient.first_name} {patient.last_name}
                    </CardTitle>
                  </Link>
                  <CardDescription className="mt-1 text-xs">
                    {ageDisplay} • {patient.gender || "—"}
                  </CardDescription>
                </div>
                <Badge variant={getStatusBadgeVariant(patient.status)} className="text-xs shrink-0">
                  {getStatusLabel(patient.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {patient.complaint && (
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <RiStethoscopeLine className="mt-0.5 size-4 shrink-0" />
                  <span className="line-clamp-2 overflow-hidden text-ellipsis">{patient.complaint}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <RiPhoneLine className="size-3.5 shrink-0" />
                  <span>{patient.phone}</span>
                </div>
                {patient.lastAppointmentDate && (
                  <>
                    <span className="text-gray-400 dark:text-gray-500">•</span>
                    <span>Last visit: {formatDate(patient.lastAppointmentDate)}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
