"use client"

import { Card, ProgressBar, Text, Title } from "@tremor/react"
import { useAppTranslations } from "@/lib/useAppTranslations"

/**
 * Route-level loading UI for patient profile. Shown immediately when
 * navigating to /patients/[id] while the page segment and data load.
 * Uses Tremor Card, Title, Text, and ProgressBar for consistency.
 */
export default function PatientProfileLoading() {
  const t = useAppTranslations()

  return (
    <div className="space-y-6">
      {/* Header placeholder */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="h-9 w-48 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800" />
        <div className="h-9 w-32 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800" />
      </div>

      {/* Tremor loading card */}
      <Card className="flex flex-col items-center justify-center gap-4 py-12">
        <Title className="text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
          {t.common.loading}
        </Title>
        <Text className="text-tremor-content-subtle dark:text-dark-tremor-content-subtle">
          {t.patients.title}
        </Text>
        <div className="w-full max-w-xs">
          <ProgressBar value={40} showAnimation color="indigo" />
        </div>
      </Card>

      {/* Content block placeholder */}
      <Card>
        <div className="h-64 animate-pulse rounded-tremor-default bg-gray-50 dark:bg-gray-800/50" />
      </Card>
    </div>
  )
}
