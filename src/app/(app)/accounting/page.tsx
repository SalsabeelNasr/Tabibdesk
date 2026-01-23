"use client"

import { FeatureGate } from "@/components/guards/FeatureGate"
import { AccountingPage } from "@/features/accounting/AccountingPage"

export default function AccountingRoute() {
  return (
    <FeatureGate feature="accounting">
      <AccountingPage />
    </FeatureGate>
  )
}
