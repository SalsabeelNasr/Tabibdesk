"use client"

import React from "react"
import {
  Area,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { AvailableChartColorsKeys, getColorClassName } from "@/lib/chartUtils"
import { cx } from "@/lib/utils"

interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any[]
  index: string
  categories: string[]
  colors?: AvailableChartColorsKeys[]
  showXAxis?: boolean
  showYAxis?: boolean
  showGridLines?: boolean
  showTooltip?: boolean
  showLegend?: boolean
}

const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      data,
      index,
      categories,
      colors = ["blue"],
      showXAxis = false,
      showYAxis = false,
      showTooltip = false,
      className,
      ...other
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cx("h-10 w-full", className)} {...other}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data}>
            <defs>
              {categories.map((category, idx) => {
                const color = colors[idx] || colors[0]
                return (
                  <linearGradient
                    key={category}
                    id={`gradient-${category}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      className={getColorClassName(color, "fill")}
                      style={{ stopOpacity: 0.3 }}
                    />
                    <stop
                      offset="95%"
                      className={getColorClassName(color, "fill")}
                      style={{ stopOpacity: 0 }}
                    />
                  </linearGradient>
                )
              })}
            </defs>
            {showXAxis && <XAxis dataKey={index} hide />}
            {showYAxis && <YAxis hide />}
            {showTooltip && <Tooltip />}
            {categories.map((category) => {
              return (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke="none"
                  fill={`url(#gradient-${category})`}
                  isAnimationActive={false}
                />
              )
            })}
            {categories.map((category, idx) => {
              const color = colors[idx] || colors[0]
              return (
                <Area
                  key={`line-${category}`}
                  type="monotone"
                  dataKey={category}
                  strokeWidth={2}
                  className={getColorClassName(color, "stroke")}
                  fill="none"
                  isAnimationActive={false}
                />
              )
            })}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    )
  },
)

AreaChart.displayName = "AreaChart"

export { AreaChart }
