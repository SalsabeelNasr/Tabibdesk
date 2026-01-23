"use client"

import { InsightsPage } from "@/features/insights/InsightsPage"
import { FeatureGate } from "@/components/guards/FeatureGate"

export default function InsightsPageRoute() {
  return (
    <FeatureGate feature="insights">
      <InsightsPage />
    </FeatureGate>
  )
}
