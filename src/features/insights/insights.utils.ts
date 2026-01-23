import type { TimeRange } from "./insights.types"

export function getTimeRangeDates(timeRange: TimeRange): { start: Date; end: Date } {
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  
  const start = new Date()
  
  switch (timeRange) {
    case "today":
      start.setHours(0, 0, 0, 0)
      break
    case "7d":
      start.setDate(start.getDate() - 7)
      start.setHours(0, 0, 0, 0)
      break
    case "30d":
      start.setDate(start.getDate() - 30)
      start.setHours(0, 0, 0, 0)
      break
    case "custom":
      start.setDate(start.getDate() - 30)
      start.setHours(0, 0, 0, 0)
      break
  }
  
  return { start, end }
}

export function formatRecordCount(count: number): string {
  if (count === 0) return "0 records"
  if (count === 1) return "1 record"
  return `${count} records`
}

export function calculatePercentageChange(current: number, previous: number): {
  value: string
  type: "positive" | "negative" | "neutral"
} {
  if (previous === 0) {
    return current > 0 ? { value: "+100%", type: "positive" } : { value: "0%", type: "neutral" }
  }
  
  const change = ((current - previous) / previous) * 100
  const sign = change >= 0 ? "+" : ""
  
  return {
    value: `${sign}${change.toFixed(1)}%`,
    type: change > 0 ? "positive" : change < 0 ? "negative" : "neutral",
  }
}
