import { Badge } from "@/components/Badge"
import { Card, CardContent } from "@/components/Card"
import React from "react"

export type MetricCardProps = {
  title: string
  value: string | number
  description?: string
  change?: string
  changeType?: "success" | "error" | "warning" | "neutral"
  icon?: React.ComponentType<{ className?: string }>
  iconColor?: string
}

export function MetricCard({
  title,
  value,
  description,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor,
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <dt className="font-bold text-gray-900 sm:text-sm dark:text-gray-50">
                {title}
              </dt>
              {change && (
                <Badge variant={changeType}>{change}</Badge>
              )}
            </div>
            <dd className="mt-2 flex items-baseline gap-2">
              <span className="text-xl text-gray-900 dark:text-gray-50">
                {value}
              </span>
              {description && (
                <span className="text-sm text-gray-500">{description}</span>
              )}
            </dd>
          </div>
          {Icon && (
            <div className={`ml-4 flex size-12 shrink-0 items-center justify-center rounded-full ${iconColor || "bg-gray-100 dark:bg-gray-800"}`}>
              <Icon className="size-6 text-gray-600 dark:text-gray-400" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
