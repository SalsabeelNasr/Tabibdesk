"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Badge } from "@/components/Badge"
import { useWaitlist } from "../hooks/useWaitlist"
import { createAppointmentFromWaitlist } from "../appointments.api"
import { remove as removeWaitlistEntry } from "../waitlist/waitingList.api"
import { RiUserLine, RiPhoneLine, RiCalendarLine } from "@remixicon/react"
import { cx } from "@/lib/utils"
import type { WaitlistEntry } from "../types"
import type { Slot } from "../types"

interface WaitlistTabProps {
  clinicId: string
  doctorId?: string
  onBook?: (entry: WaitlistEntry) => void
}

function WaitlistTable({
  entries,
  loading,
  onBook,
}: {
  entries: WaitlistEntry[]
  loading: boolean
  onBook: (entry: WaitlistEntry) => void
}) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600 dark:border-gray-800 dark:border-t-primary-400"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading waitlist...</p>
        </div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-12 text-center dark:border-gray-800 dark:bg-gray-950">
        <p className="text-sm text-gray-500 dark:text-gray-400">No patients in waiting list</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={cx(
            "group relative flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 transition-colors bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 shadow-sm"
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/patients/${entry.patientId}`}
                  className="text-sm font-semibold text-gray-900 hover:text-primary-600 dark:text-gray-50 dark:hover:text-primary-400"
                >
                  {entry.patientName}
                </Link>
                {entry.appointmentType && (
                  <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4 uppercase font-bold tracking-wider">
                    {entry.appointmentType}
                  </Badge>
                )}
              </div>
              
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
                <div className="flex items-center gap-1">
                  <RiPhoneLine className="size-3" />
                  {entry.patientPhone}
                </div>
                {entry.preferredTimeWindow && entry.preferredTimeWindow !== "any" && (
                  <div className="flex items-center gap-1">
                    <RiCalendarLine className="size-3" />
                    Prefers: {entry.preferredTimeWindow}
                  </div>
                )}
                {entry.preferredDays && entry.preferredDays.length > 0 && (
                  <span>Days: {entry.preferredDays.join(", ")}</span>
                )}
              </div>
              
              {entry.notes && (
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-1 italic">
                  &quot;{entry.notes}&quot;
                </p>
              )}
            </div>
            
            <div className="mt-2 sm:mt-0 flex justify-end">
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => onBook(entry)} 
                className="text-[11px] h-8 px-4 bg-primary-600 shadow-md shadow-primary-500/10 active:scale-[0.98] transition-all"
              >
                Book
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function WaitlistTab({ clinicId, doctorId, onBook }: WaitlistTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  
  const { entries, loading } = useWaitlist({
    clinicId,
    status: "active", // Always show only active entries
    query: searchQuery,
  })
  
  const handleBook = (entry: WaitlistEntry) => {
    if (onBook) {
      onBook(entry)
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex-1 w-full">
        <Input
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      
      <WaitlistTable 
        entries={entries} 
        loading={loading} 
        onBook={handleBook} 
      />
    </div>
  )
}
