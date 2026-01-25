"use client"

import { Button } from "@/components/Button"
import { Badge } from "@/components/Badge"
import { formatSlotTime } from "../utils/slotFormatters"
import type { Slot } from "../types"

interface EmptySlotRowProps {
  slot: Slot
  onFillSlot: (slot: Slot) => void
}

export function EmptySlotRow({ slot, onFillSlot }: EmptySlotRowProps) {
  const startTime = formatSlotTime(slot.startAt)
  const endTime = formatSlotTime(slot.endAt)
  const timeRange = `${startTime} - ${endTime}`
  
  return (
    <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-2 transition-colors bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 shadow-sm">
      {/* Status Accent Line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gray-200 dark:bg-gray-700" />
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 min-w-0 ml-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">{timeRange}</span>
            <Badge variant="neutral" className="text-[10px] px-1.5 py-0 h-4 uppercase font-bold tracking-wider">Empty</Badge>
          </div>
        </div>
        
        <div className="mt-3 sm:mt-0 flex justify-end">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onFillSlot(slot)} 
            className="text-[11px] h-8 px-4 w-full sm:w-auto bg-primary-600 shadow-md shadow-primary-500/10 active:scale-[0.98] transition-all"
          >
            Fill Slot
          </Button>
        </div>
      </div>
    </div>
  )
}
