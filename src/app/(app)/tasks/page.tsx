"use client"

import { TasksPage } from "@/features/tasks/TasksPage"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { FeatureGate } from "@/components/guards/FeatureGate"

export default function TasksPageRoute() {
  const { currentUser, currentClinic } = useUserClinic()

  return (
    <FeatureGate feature="tasks">
      <TasksPage
        role={currentUser.role}
        currentUserId={currentUser.id}
        clinicId={currentClinic.id}
      />
    </FeatureGate>
  )
}
