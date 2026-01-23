// Tremor Metric Component Wrapper

import { Metric, MetricProps } from "@tremor/react"
import React from "react"

interface MetricCardProps extends Omit<MetricProps, "children"> {
  title: string
  value: string | number
  icon?: React.ComponentType<{ className?: string }>
  description?: string
  trend?: {
    value: string
    isPositive: boolean
  }
  iconColor?: string
  iconTextColor?: string
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      title,
      value,
      icon: Icon,
      description,
      trend,
      iconColor,
      iconTextColor,
      ...props
    },
    forwardedRef,
  ) => {
    return (
      <Metric {...props} ref={forwardedRef}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              {title}
            </p>
            <p className="mt-2 text-3xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {value}
            </p>
            {description && (
              <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                {description}
              </p>
            )}
            {trend && (
              <p
                className={`mt-1 flex items-center text-tremor-default ${
                  trend.isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                <span className="mr-1">{trend.isPositive ? "↑" : "↓"}</span>
                {trend.value}
              </p>
            )}
          </div>
          {Icon && (
            <div className={`rounded-full p-3 ${iconColor || "bg-tremor-background-subtle"}`}>
              <Icon className={`size-6 ${iconTextColor || "text-tremor-content"}`} />
            </div>
          )}
        </div>
      </Metric>
    )
  },
)

MetricCard.displayName = "MetricCard"

export { MetricCard, type MetricCardProps }
