import { mockData } from "@/data/mock/mock-data"
import type { AskInsightParams, InsightResponse } from "./insights.types"
import { getTimeRangeDates, formatRecordCount } from "./insights.utils"

export async function askInsight({ question, clinicId: _clinicId, timeRange }: AskInsightParams): Promise<InsightResponse> {
  const { start, end } = getTimeRangeDates(timeRange)
  
  const delay = Math.random() * 300 + 600
  await new Promise((resolve) => setTimeout(resolve, delay))
  
  const lowerQuestion = question.toLowerCase()
  
  if (lowerQuestion.includes("no-show") || lowerQuestion.includes("no show")) {
    return handleNoShowsQuestion(start, end, timeRange)
  }
  
  if (lowerQuestion.includes("empty slot") || lowerQuestion.includes("losing money") || lowerQuestion.includes("empty slots")) {
    return handleEmptySlotsQuestion(start, end, timeRange)
  }
  
  if (lowerQuestion.includes("lead source") || lowerQuestion.includes("best source") || lowerQuestion.includes("which lead")) {
    return handleLeadSourceQuestion(start, end, timeRange)
  }
  
  if (lowerQuestion.includes("follow up") || lowerQuestion.includes("who should") || lowerQuestion.includes("fill slots")) {
    return handleFollowUpQuestion(start, end, timeRange)
  }
  
  return {
    summary: "I can help you analyze appointments, leads, and performance metrics. Try asking about no-shows, empty slots, lead sources, or follow-ups.",
    metrics: [],
    actions: [],
    basedOn: formatRecordCount(0),
  }
}

function handleNoShowsQuestion(start: Date, end: Date, timeRange: string): InsightResponse {
  const appointmentsInRange = mockData.appointments.filter(
    (apt) => new Date(apt.scheduled_at) >= start && new Date(apt.scheduled_at) <= end
  )
  
  const noShows = appointmentsInRange.filter((apt) => apt.status === "no_show")
  const totalAppointments = appointmentsInRange.length
  const noShowRate = totalAppointments > 0 ? ((noShows.length / totalAppointments) * 100).toFixed(1) : "0"
  
  const previousStart = new Date(start)
  previousStart.setDate(previousStart.getDate() - (timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 1))
  const previousEnd = new Date(start)
  
  const previousAppointments = mockData.appointments.filter(
    (apt) => new Date(apt.scheduled_at) >= previousStart && new Date(apt.scheduled_at) < previousEnd
  )
  const previousNoShows = previousAppointments.filter((apt) => apt.status === "no_show")
  const previousRate = previousAppointments.length > 0 ? ((previousNoShows.length / previousAppointments.length) * 100).toFixed(1) : "0"
  
  const isHigher = parseFloat(noShowRate) > parseFloat(previousRate)
  
  return {
    summary: isHigher
      ? `No-show rate is ${noShowRate}% this period, up from ${previousRate}% last period. This may be due to insufficient confirmation reminders or scheduling issues.`
      : `No-show rate is ${noShowRate}% this period, down from ${previousRate}% last period. Your confirmation process is working well.`,
    metrics: [
      { label: "No-shows", value: noShows.length },
      { label: "Total appointments", value: totalAppointments },
      { label: "No-show rate", value: `${noShowRate}%` },
    ],
    actions: [
      {
        label: "View list",
        route: `/app/appointments?status=no_show&range=${timeRange}`,
        type: "primary",
      },
    ],
    basedOn: formatRecordCount(totalAppointments),
  }
}

function handleEmptySlotsQuestion(start: Date, end: Date, _timeRange: string): InsightResponse {
  const appointmentsInRange = mockData.appointments.filter(
    (apt) => new Date(apt.scheduled_at) >= start && new Date(apt.scheduled_at) <= end
  )
  
  const completed = appointmentsInRange.filter((apt) => apt.status === "completed")
  const scheduled = appointmentsInRange.filter((apt) => ["scheduled", "confirmed"].includes(apt.status))
  
  const totalSlots = completed.length + scheduled.length
  const emptySlots = Math.max(0, totalSlots - completed.length - scheduled.length)
  
  const avgSlotValue = 500
  const estimatedLoss = emptySlots * avgSlotValue
  
  return {
    summary: `You have ${emptySlots} empty slots in the next 3 days, potentially losing ${estimatedLoss.toLocaleString()} EGP in revenue. Focus on filling morning slots (9-11 AM) which have the highest no-show rates.`,
    metrics: [
      { label: "Empty slots", value: emptySlots },
      { label: "Potential loss", value: `${estimatedLoss.toLocaleString()} EGP` },
      { label: "Booked slots", value: scheduled.length },
    ],
    actions: [
      {
        label: "Fill slots",
        route: `/app/appointments?openSlots=1&range=7d`,
        type: "primary",
      },
    ],
    basedOn: formatRecordCount(totalSlots),
  }
}

function handleLeadSourceQuestion(start: Date, end: Date, _timeRange: string): InsightResponse {
  const leadsInRange = mockData.leads.filter(
    (lead) => new Date(lead.created_at) >= start && new Date(lead.created_at) <= end
  )
  
  const sourceCounts: Record<string, { total: number; converted: number }> = {}
  
  leadsInRange.forEach((lead) => {
    if (!sourceCounts[lead.source]) {
      sourceCounts[lead.source] = { total: 0, converted: 0 }
    }
    sourceCounts[lead.source].total++
    if (lead.status === "converted") {
      sourceCounts[lead.source].converted++
    }
  })
  
  const sourceRates = Object.entries(sourceCounts).map(([source, counts]) => ({
    source,
    rate: counts.total > 0 ? (counts.converted / counts.total) * 100 : 0,
    total: counts.total,
    converted: counts.converted,
  }))
  
  sourceRates.sort((a, b) => b.rate - a.rate)
  
  const bestSource = sourceRates[0]
  
  return {
    summary: `${bestSource.source} brings the best patients with a ${bestSource.rate.toFixed(1)}% conversion rate (${bestSource.converted}/${bestSource.total} leads converted). Focus your marketing efforts here.`,
    metrics: [
      { label: "Best source", value: bestSource.source },
      { label: "Conversion rate", value: `${bestSource.rate.toFixed(1)}%` },
      { label: "Converted leads", value: bestSource.converted },
    ],
    actions: [
      {
        label: "View leads",
        route: `/app/assistant/leads?source=${encodeURIComponent(bestSource.source)}`,
        type: "primary",
      },
    ],
    basedOn: formatRecordCount(leadsInRange.length),
  }
}

function handleFollowUpQuestion(_start: Date, _end: Date, _timeRange: string): InsightResponse {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(23, 59, 59, 999)
  
  const hotLeads = mockData.leads.filter(
    (lead) =>
      lead.quality === "hot" &&
      lead.status !== "converted" &&
      lead.status !== "lost" &&
      lead.next_action_due &&
      new Date(lead.next_action_due) <= tomorrow
  )
  
  const unconfirmedAppointments = mockData.appointments.filter(
    (apt) =>
      apt.status === "scheduled" &&
      new Date(apt.scheduled_at) >= now &&
      new Date(apt.scheduled_at) <= tomorrow
  )
  
  return {
    summary: `You have ${hotLeads.length} hot leads waiting for follow-up today and ${unconfirmedAppointments.length} unconfirmed appointments tomorrow. Prioritize confirming tomorrow's appointments first, then reach out to hot leads.`,
    metrics: [
      { label: "Hot leads waiting", value: hotLeads.length },
      { label: "Unconfirmed tomorrow", value: unconfirmedAppointments.length },
      { label: "Total actions needed", value: hotLeads.length + unconfirmedAppointments.length },
    ],
    actions: [
      {
        label: "Open leads",
        route: `/app/assistant/leads?quality=hot&due=today`,
        type: "primary",
      },
      {
        label: "Confirm appointments",
        route: `/app/appointments?status=scheduled&range=today`,
        type: "secondary",
      },
    ],
    basedOn: formatRecordCount(hotLeads.length + unconfirmedAppointments.length),
  }
}
