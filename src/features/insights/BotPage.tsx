"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { ChatBox } from "./ChatBox"
import { askInsight } from "./insights.api"
import type { TimeRange, ChatMessage } from "./insights.types"
import { useUserClinic } from "@/contexts/user-clinic-context"

export function BotPage() {
  const t = useAppTranslations()
  const { currentClinic } = useUserClinic()
  const [question, setQuestion] = useState("")
  const timeRange: TimeRange = "30d"
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
    } catch {
      setError(t.insights.failedToGetInsight)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    handleSubmit(prompt)
  }

  return (
    <div className="page-content">
      <PageHeader title={t.nav.bot} />

      <div className="w-full max-w-6xl mx-auto">
        <div className="space-y-4">
          <ChatBox
            messages={messages}
            question={question}
            onQuestionChange={setQuestion}
            onSubmit={() => handleSubmit()}
            isLoading={isLoading}
            quickPrompts={[t.insights.quickPrompt1, t.insights.quickPrompt2, t.insights.quickPrompt3, t.insights.quickPrompt4]}
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
  )
}
