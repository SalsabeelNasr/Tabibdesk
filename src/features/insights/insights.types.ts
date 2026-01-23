export type TimeRange = "today" | "7d" | "30d" | "custom"

export interface InsightMetric {
  label: string
  value: string | number
}

export interface InsightAction {
  label: string
  route: string
  type?: "primary" | "secondary"
}

export interface InsightResponse {
  summary: string
  metrics: InsightMetric[]
  actions: InsightAction[]
  basedOn: string
}

export interface AskInsightParams {
  question: string
  clinicId: string
  timeRange: TimeRange
}

export interface RiskCard {
  id: string
  title: string
  number: number
  explanation: string
  ctaText: string
  ctaRoute: string
  ctaVariant?: "primary" | "ghost"
}

export interface KpiMetric {
  id: string
  label: string
  value: string | number
  change: string
  changeType: "positive" | "negative" | "neutral"
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  response?: InsightResponse
  timestamp: Date
}
