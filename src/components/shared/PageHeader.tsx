// Tremor Raw PageHeader [v0.0.0]

import React from "react"
import { cx } from "@/lib/utils"

interface PageHeaderProps {
  title: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, actions }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cx(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{title}</h1>
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  ),
)

PageHeader.displayName = "PageHeader"

export { PageHeader, type PageHeaderProps }
