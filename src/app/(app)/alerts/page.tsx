"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card"
import { Badge } from "@/components/Badge"
import { PageHeader } from "@/components/shared/PageHeader"
import { FeatureGate } from "@/components/guards/FeatureGate"
import {
  RiAlertLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiTestTubeLine,
  RiQuestionLine,
  RiCheckLine,
} from "@remixicon/react"
import { useDemo } from "@/contexts/demo-context"
import { mockData } from "@/data/mock/mock-data"

interface UrgentAlert {
  id: string
  type: "question" | "lab"
  severity: "critical" | "warning" | "info"
  patient_id: string
  patient_name: string
  title: string
  message: string
  created_at: string
  is_reviewed: boolean
  lab_result_id?: string
  lab_test_name?: string
}

export default function AlertsPage() {
  return (
    <FeatureGate feature="alerts">
      <AlertsContent />
    </FeatureGate>
  )
}

function AlertsContent() {
  const { isDemoMode } = useDemo()
  const [loading, setLoading] = useState(true)
  const [urgentAlerts, setUrgentAlerts] = useState<UrgentAlert[]>([])
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all")

  useEffect(() => {
    fetchAlerts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode, filter])

  const fetchAlerts = async () => {
    setLoading(true)

    if (isDemoMode) {
      // Get urgent alerts sorted by severity
      let alerts = mockData.urgentAlerts.filter((alert) => !alert.is_reviewed)

      // Apply filter
      if (filter !== "all") {
        alerts = alerts.filter((alert) => alert.severity === filter)
      }

      // Sort by severity and date
      const sortedAlerts = alerts.sort((a, b) => {
        const severityOrder = { critical: 0, warning: 1, info: 2 }
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
          return severityOrder[a.severity] - severityOrder[b.severity]
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })

      setUrgentAlerts(sortedAlerts)
      setLoading(false)
      return
    }

    // TODO: Fetch from Supabase when integrated
    setLoading(false)
  }

  const getSeverityIcon = (severity: UrgentAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return <RiAlertLine className="size-5" />
      case "warning":
        return <RiErrorWarningLine className="size-5" />
      case "info":
        return <RiInformationLine className="size-5" />
    }
  }

  const getSeverityColor = (severity: UrgentAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
      case "warning":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "info":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
    }
  }

  const getTypeIcon = (type: UrgentAlert["type"]) => {
    return type === "lab" ? (
      <RiTestTubeLine className="size-4" />
    ) : (
      <RiQuestionLine className="size-4" />
    )
  }

  const getTimeAgo = (dateString: string) => {
    const now = Date.now()
    const then = new Date(dateString).getTime()
    const diffMs = now - then
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    return "Just now"
  }

  const getSeverityCount = (severity: UrgentAlert["severity"]) => {
    return mockData.urgentAlerts.filter(
      (alert) => !alert.is_reviewed && alert.severity === severity
    ).length
  }

  return (
    <div className="space-y-6">
      {/* PageHeader */}
      <PageHeader
        title="Urgent Alerts"
        subtitle="Review and manage urgent patient alerts and notifications"
      />

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filter === "all"
              ? "bg-primary-600 text-white dark:bg-primary-500"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          All ({mockData.urgentAlerts.filter((a) => !a.is_reviewed).length})
        </button>
        <button
          onClick={() => setFilter("critical")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filter === "critical"
              ? "bg-red-600 text-white dark:bg-red-500"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Critical ({getSeverityCount("critical")})
        </button>
        <button
          onClick={() => setFilter("warning")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filter === "warning"
              ? "bg-yellow-600 text-white dark:bg-yellow-500"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Warning ({getSeverityCount("warning")})
        </button>
        <button
          onClick={() => setFilter("info")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filter === "info"
              ? "bg-blue-600 text-white dark:bg-blue-500"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Info ({getSeverityCount("info")})
        </button>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {filter === "all" ? "All Alerts" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Alerts`}
            </CardTitle>
            {urgentAlerts.length > 0 && <Badge variant="error">{urgentAlerts.length}</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded bg-gray-100 dark:bg-gray-800"></div>
              ))}
            </div>
          ) : urgentAlerts.length > 0 ? (
            <div className="space-y-3">
              {urgentAlerts.map((alert) => (
                <Link key={alert.id} href={`/patients/${alert.patient_id}`}>
                  <div className="rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900">
                    <div className="flex items-start gap-3">
                      {/* Severity Icon */}
                      <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${getSeverityColor(alert.severity)}`}>
                        {getSeverityIcon(alert.severity)}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            {getTypeIcon(alert.type)}
                          </div>
                          <p className="font-medium text-gray-900 dark:text-gray-50">
                            {alert.patient_name}
                          </p>
                          <Badge variant={alert.severity === "critical" ? "error" : alert.severity === "warning" ? "warning" : "default"}>
                            {alert.severity}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {getTimeAgo(alert.created_at)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-50">
                          {alert.title}
                        </p>
                        <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                          {alert.message}
                        </p>
                        {alert.lab_test_name && (
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                            Lab Test: {alert.lab_test_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-600 dark:text-gray-400">
              <RiCheckLine className="mx-auto size-12 text-gray-400" />
              <p className="mt-2 text-lg font-medium">No urgent alerts</p>
              <p className="mt-1 text-sm">All caught up! No {filter !== "all" ? filter : ""} alerts to review.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
