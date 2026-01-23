"use client"

import { Card, CardContent } from "@/components/Card"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { useRouter } from "next/navigation"
import { RiArrowRightLine } from "@remixicon/react"
import { mockData } from "@/data/mock/mock-data"
import { calculatePercentageChange } from "./insights.utils"
import { AreaChart } from "@/components/AreaChart"

export function MetricCards() {
  const router = useRouter()
  const now = new Date()
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  thirtyDaysAgo.setHours(0, 0, 0, 0)

  const sixtyDaysAgo = new Date(thirtyDaysAgo)
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 30)

  // Data calculations
  const currentAppointments = mockData.appointments.filter(
    (apt) => new Date(apt.scheduled_at) >= thirtyDaysAgo && new Date(apt.scheduled_at) <= now
  )

  const previousAppointments = mockData.appointments.filter(
    (apt) => new Date(apt.scheduled_at) >= sixtyDaysAgo && new Date(apt.scheduled_at) < thirtyDaysAgo
  )

  const currentScheduled = currentAppointments.filter((apt) =>
    ["scheduled", "confirmed", "completed"].includes(apt.status)
  ).length
  const previousScheduled = previousAppointments.filter((apt) =>
    ["scheduled", "confirmed", "completed"].includes(apt.status)
  ).length
  const bookedSlotsPercent = (currentScheduled / 100) * 100
  const bookedChange = calculatePercentageChange(bookedSlotsPercent, (previousScheduled / 100) * 100)

  const currentNoShows = currentAppointments.filter((apt) => apt.status === "no_show").length
  const previousNoShows = previousAppointments.filter((apt) => apt.status === "no_show").length
  const noShowRate = currentAppointments.length > 0 ? (currentNoShows / currentAppointments.length) * 100 : 0
  const noShowChange = calculatePercentageChange(noShowRate, previousAppointments.length > 0 ? (previousNoShows / previousAppointments.length) * 100 : 0)

  const currentLeads = mockData.leads.filter(
    (lead) => new Date(lead.created_at) >= thirtyDaysAgo && new Date(lead.created_at) <= now
  )
  const previousLeads = mockData.leads.filter(
    (lead) => new Date(lead.created_at) >= sixtyDaysAgo && new Date(lead.created_at) < thirtyDaysAgo
  )
  const currentConverted = currentLeads.filter((lead) => lead.status === "converted").length
  const conversionRate = currentLeads.length > 0 ? (currentConverted / currentLeads.length) * 100 : 0
  const previousConversionRate = previousLeads.length > 0 ? (previousLeads.filter(l => l.status === "converted").length / previousLeads.length) * 100 : 0
  const conversionChange = calculatePercentageChange(conversionRate, previousConversionRate)

  const completedAppointments = currentAppointments.filter((apt) => apt.status === "completed").length
  const previousCompleted = previousAppointments.filter((apt) => apt.status === "completed").length
  const completedChange = calculatePercentageChange(completedAppointments, previousCompleted)

  const threeDaysLater = new Date(now)
  threeDaysLater.setDate(threeDaysLater.getDate() + 3)
  const scheduledInNext3Days = mockData.appointments.filter(
    (apt) => ["scheduled", "confirmed"].includes(apt.status) && new Date(apt.scheduled_at) >= now && new Date(apt.scheduled_at) <= threeDaysLater
  ).length
  const emptySlots = Math.max(0, 20 - scheduledInNext3Days)

  // Mock Sparkline Data
  const generateSparkline = (base: number) => {
    return Array.from({ length: 10 }, (_, i) => ({
      date: i,
      value: base + Math.floor(Math.random() * 20) - 10,
    }))
  }

  const metrics = [
    {
      id: "booked-slots",
      label: "Booked slots %",
      value: `${bookedSlotsPercent.toFixed(1)}%`,
      change: bookedChange.value,
      changeType: bookedChange.type,
      data: generateSparkline(bookedSlotsPercent),
      color: "blue" as const,
    },
    {
      id: "no-show-rate",
      label: "No-show rate",
      value: `${noShowRate.toFixed(1)}%`,
      change: noShowChange.value,
      changeType: noShowChange.type === "positive" ? "negative" : noShowChange.type === "negative" ? "positive" : "neutral",
      data: generateSparkline(noShowRate),
      color: "red" as const,
    },
    {
      id: "lead-conversion",
      label: "Lead → Booked",
      value: `${conversionRate.toFixed(1)}%`,
      change: conversionChange.value,
      changeType: conversionChange.type,
      data: generateSparkline(conversionRate),
      color: "emerald" as const,
    },
    {
      id: "completed",
      label: "Completed",
      value: completedAppointments,
      change: completedChange.value,
      changeType: completedChange.type,
      data: generateSparkline(completedAppointments),
      color: "indigo" as const,
    },
    {
      id: "empty-slots",
      label: "Empty slots (3d)",
      value: emptySlots,
      isRisk: true,
      explanation: "Potential loss",
      ctaText: "Fill slots",
      ctaRoute: "/app/appointments?openSlots=1&range=7d",
      data: generateSparkline(emptySlots),
      color: "amber" as const,
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.id} className="overflow-hidden">
          <CardContent className="p-4 flex flex-col h-full justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {metric.label}
                </p>
                {metric.change && (
                  <Badge
                    variant={
                      metric.changeType === "positive"
                        ? "success"
                        : metric.changeType === "negative"
                        ? "error"
                        : "neutral"
                    }
                    className="text-[10px] h-4 px-1"
                  >
                    {metric.change}
                  </Badge>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{metric.value}</p>
                {metric.explanation && (
                  <span className="text-[10px] text-gray-500">{metric.explanation}</span>
                )}
              </div>
            </div>

            <div className="h-10 w-full -mx-4 -mb-2">
              <AreaChart
                data={metric.data}
                index="date"
                categories={["value"]}
                colors={[metric.color]}
                showXAxis={false}
                showYAxis={false}
                showTooltip={false}
                className="h-full w-full"
              />
            </div>

            {metric.isRisk && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push(metric.ctaRoute)}
                className="mt-2 w-full"
              >
                {metric.ctaText}
                <RiArrowRightLine className="ml-2 size-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
