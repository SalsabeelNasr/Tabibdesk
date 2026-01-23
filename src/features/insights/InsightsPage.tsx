"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Select } from "@/components/Select"
import { ChatBox } from "./ChatBox"
import { MetricCards } from "./MetricCards"
import { askInsight } from "./insights.api"
import type { InsightResponse, TimeRange, ChatMessage } from "./insights.types"
import { useUserClinic } from "@/contexts/user-clinic-context"

const QUICK_PROMPTS = [
  "Why are no-shows higher this month?",
  "What times are we losing money from empty slots?",
  "Which lead source brings the best patients?",
  "Who should we follow up with today to fill slots?",
]

export function InsightsPage() {
  const { currentClinic } = useUserClinic()
  const [question, setQuestion] = useState("")
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (overrideQuestion?: string) => {
    const activeQuestion = overrideQuestion || question
    if (!activeQuestion.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: activeQuestion,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setQuestion("")
    setIsLoading(true)
    setError(null)

    try {
      const result = await askInsight({
        question: activeQuestion.trim(),
        clinicId: currentClinic.id,
        timeRange,
      })

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.summary,
        response: result,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError("Failed to get insight. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    handleSubmit(prompt)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insights"
        subtitle="Ask TabibDesk anything about your clinic performance and get actionable insights"
        actions={
          <div className="flex items-center gap-2">
            <label htmlFor="time-range" className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Time range:
            </label>
            <Select
              id="time-range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              disabled={isLoading}
              className="w-32"
            >
              <option value="today">Today</option>
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
              <option value="custom">Custom</option>
            </Select>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <MetricCards />
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-6 space-y-4">
            <ChatBox
              messages={messages}
              question={question}
              onQuestionChange={setQuestion}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              quickPrompts={QUICK_PROMPTS}
              onQuickPrompt={handleQuickPrompt}
            />

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
