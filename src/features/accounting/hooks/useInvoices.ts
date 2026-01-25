import { useState, useEffect } from "react"
import { listInvoices, type ListInvoicesParams, type ListInvoicesResponse } from "@/api/invoices.api"

export function useInvoices(params: ListInvoicesParams) {
  const [data, setData] = useState<ListInvoicesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchInvoices() {
      setLoading(true)
      setError(null)

      try {
        const result = await listInvoices(params)
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to fetch invoices"))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchInvoices()

    return () => {
      cancelled = true
    }
  }, [
    params.clinicId,
    params.status,
    params.from,
    params.to,
    params.query,
    params.page,
    params.pageSize,
    params.patientId,
  ])

  return { data, loading, error, refetch: () => {
    const fetchInvoices = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await listInvoices(params)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch invoices"))
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  } }
}
