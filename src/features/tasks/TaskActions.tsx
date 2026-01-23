"use client"

import { Button } from "@/components/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuIconWrapper,
} from "@/components/Dropdown"
import {
  RiMoreLine,
  RiCheckLine,
  RiTimeLine,
  RiUserLine,
} from "@remixicon/react"
import type { TaskListItem } from "./tasks.types"

interface TaskActionsProps {
  task: TaskListItem
  onMarkDone: () => void
  onSnooze: () => void
  onAssign: () => void
  role: "doctor" | "assistant" | "manager"
}

export function TaskActions({
  task,
  onMarkDone,
  onSnooze,
  onAssign,
  role,
}: TaskActionsProps) {
  const canMarkDone = task.status === "pending"
  const canSnooze = false
  const canAssign = role === "doctor"

  if (!canMarkDone && !canSnooze && !canAssign) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <RiMoreLine className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {canMarkDone && (
          <DropdownMenuItem onClick={onMarkDone}>
            <DropdownMenuIconWrapper>
              <RiCheckLine className="size-4" />
            </DropdownMenuIconWrapper>
            Mark Done
          </DropdownMenuItem>
        )}
        {canSnooze && (
          <DropdownMenuItem onClick={onSnooze}>
            <DropdownMenuIconWrapper>
              <RiTimeLine className="size-4" />
            </DropdownMenuIconWrapper>
            Snooze
          </DropdownMenuItem>
        )}
        {canAssign && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onAssign}>
              <DropdownMenuIconWrapper>
                <RiUserLine className="size-4" />
              </DropdownMenuIconWrapper>
              Assign
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
