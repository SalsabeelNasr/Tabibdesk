import { useState, useEffect } from "react"
import { listExpenses, type ListExpensesParams, type ListExpensesResponse } from "@/api/expenses.api"

export function useExpenses(params: ListExpensesParams) {
  const [data, setData] = useState<ListExpensesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchExpenses() {
      setLoading(true)
      setError(null)

      try {
        const result = await listExpenses(params)
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to fetch expenses"))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchExpenses()

    return () => {
      cancelled = true
    }
  }, [
    params.clinicId,
    params.from,
    params.to,
    params.query,
    params.category,
    params.method,
    params.vendorName,
    params.page,
    params.pageSize,
  ])

  return { data, loading, error, refetch: () => {
    const fetchExpenses = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await listExpenses(params)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch expenses"))
      } finally {
        setLoading(false)
      }
    }
    fetchExpenses()
  } }
}
