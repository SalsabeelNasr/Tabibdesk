// Tremor Raw PageHeader [v0.0.0]

import React from "react"
import { cx } from "@/lib/utils"

interface PageHeaderProps extends React.ComponentPropsWithoutRef<"div"> {
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, subtitle, actions, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cx(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
      {...props}
    >
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  ),
)

PageHeader.displayName = "PageHeader"

export { PageHeader, type PageHeaderProps }
