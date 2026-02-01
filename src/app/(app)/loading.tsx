"use client"

import { Card, ProgressBar, Title } from "@tremor/react"
import { useAppTranslations } from "@/lib/useAppTranslations"

/**
 * App-wide loading UI for the (app) segment. Shown immediately when
 * navigating between any app routes (dashboard, patients, appointments,
 * tasks, etc.) while the destination page segment loads.
 * Uses Tremor Card, Title, and ProgressBar for consistency.
 */
export default function AppLoading() {
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
