import Link from "next/link"
import { Button } from "@/components/Button"
import {
  RiUserLine,
  RiCheckLine,
  RiCheckboxBlankCircleLine,
  RiUserSharedLine,
  RiWhatsappLine,
} from "@remixicon/react"
import { Badge } from "@/components/Badge"
import {
  formatTaskDate,
  isOverdue,
  getStatusLabel,
  getStatusBadgeVariant,
} from "./tasks.utils"
import type { TaskListItem } from "./tasks.types"
import { cx } from "@/lib/utils"

interface TasksCardsProps {
  tasks: TaskListItem[]
  onMarkDone: (task: TaskListItem) => void
  onAssign: (task: TaskListItem) => void
  role: "doctor" | "assistant" | "manager"
}

export function TasksCards({
  tasks,
  onMarkDone,
  onAssign,
  role,
}: TasksCardsProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const overdue = isOverdue(task.dueDate)
        const isDone = task.status === "done"
        const canAssign = role === "doctor" || role === "assistant" || role === "manager"
        const waPhone = task.patientPhone ? task.patientPhone.replace(/[^\d]/g, "") : undefined
        const waHref = waPhone
          ? `https://wa.me/${waPhone}?text=${encodeURIComponent("Hello, this is TabibDesk clinic following up. When is a good time to talk?")}`
          : undefined
        
        return (
          <div
            key={task.id}
            className={cx(
              "group relative flex flex-col p-3 transition-colors bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 shadow-sm",
              isDone && "opacity-75"
            )}
          >
            {/* Status Accent Line */}
            <div className={cx(
              "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-colors",
              isDone ? "bg-green-500" : 
              overdue ? "bg-red-500" :
              "bg-gray-200 dark:bg-gray-700"
            )} />

            <div className="flex items-start justify-between gap-3 ml-1">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Status Circle / Mark Done Action */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isDone) onMarkDone(task);
                  }}
                  disabled={isDone}
                  className={cx(
                    "flex size-9 shrink-0 items-center justify-center rounded-full transition-all group/done cursor-pointer mt-0.5",
                    isDone 
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-gray-50 text-gray-400 hover:bg-green-500 hover:text-white dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-green-600"
                  )}
                >
                  <div className={cx(isDone ? "block" : "group-hover/done:hidden")}>
                    {isDone ? (
                      <RiCheckLine className="size-5" />
                    ) : (
                      <RiCheckboxBlankCircleLine className="size-5" />
                    )}
                  </div>
                  {!isDone && (
                    <div className="hidden group-hover/done:block">
                      <RiCheckLine className="size-5" />
                    </div>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={cx(
                    "text-sm text-gray-900 dark:text-white",
                    isDone && "text-gray-400 line-through decoration-gray-400/50"
                  )}>
                    {task.patientName ? (
                      <>
                        Patient: <Link href={`/patients/${task.patientId}`} className="font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{task.patientName}</Link> → {task.description || task.title}
                      </>
                    ) : (
                      task.description || task.title
                    )}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    {task.createdByName && (
                      <span>by: {task.createdByName}</span>
                    )}
                    <Badge variant={getStatusBadgeVariant(task.status)} className="text-[10px] px-1.5 py-0">
                      {getStatusLabel(task.status)}
                    </Badge>
                    {task.dueDate && (
                      <Badge 
                        variant={isDone ? "neutral" : overdue ? "error" : "default"} 
                        className="text-[9px] px-1.5 py-0 font-bold uppercase tracking-widest"
                      >
                        {formatTaskDate(task.dueDate)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Actions Only */}
              <div className="flex items-center gap-2 shrink-0">
                {waHref && (
                  <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0" title="Contact on WhatsApp">
                    <a href={waHref} target="_blank" rel="noreferrer">
                      <RiWhatsappLine className="size-4" />
                      <span className="sr-only">Contact on WhatsApp</span>
                    </a>
                  </Button>
                )}
                {canAssign && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onAssign(task)}
                    title="Assign / Reassign"
                  >
                    <RiUserSharedLine className="size-4" />
                    <span className="sr-only">Assign</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
