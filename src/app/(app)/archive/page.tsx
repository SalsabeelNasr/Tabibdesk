"use client"

import { Suspense } from "react"
import { ArchivePage } from "@/features/archive/ArchivePage"
import { useUserClinic } from "@/contexts/user-clinic-context"

function ArchivePageContent() {
  const { currentClinic } = useUserClinic()

  return <ArchivePage clinicId={currentClinic.id} />
}

export default function ArchivePageRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArchivePageContent />
    </Suspense>
  )
}
