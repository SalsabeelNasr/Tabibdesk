"use client"

import { Button } from "@/components/Button"
import { PageHeader } from "@/components/shared/PageHeader"
import { useDebounce } from "@/lib/useDebounce"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createPatient, listPatients } from "./patients.api"
import { AddPatientModal } from "./AddPatientModal"
import { EmptyPatientsState } from "./EmptyPatientsState"
import { PatientsCards } from "./PatientsCards"
import { PatientsSkeleton } from "./PatientsSkeleton"
import { PatientsTable } from "./PatientsTable"
import { PatientsToolbar } from "./PatientsToolbar"
import type { CreatePatientInput, PatientListItem, PatientStatus } from "./patients.types"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { useToast } from "@/hooks/useToast"

const PAGE_SIZE = 10

export function PatientsPage() {
  const router = useRouter()
  const { role } = useUserClinic()
  const { showToast } = useToast()
  const [patients, setPatients] = useState<PatientListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  // Default status filter: Doctor = Active, Assistant = Inactive
  const [statusFilter, setStatusFilter] = useState<PatientStatus | "all">(
    role === "doctor" ? "active" : "inactive"
  )

  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    setPage(1)
    fetchPatients(1, debouncedSearch, statusFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter])

  const fetchPatients = async (pageNum: number, query?: string, status?: PatientStatus | "all") => {
    setLoading(true)
    try {
      const response = await listPatients({
        page: pageNum,
        pageSize: PAGE_SIZE,
        query: query || undefined,
        status: status === "all" ? undefined : status,
      })
      if (pageNum === 1) {
        setPatients(response.patients)
      } else {
        setPatients((prev) => [...prev, ...response.patients])
      }
      setHasMore(response.hasMore)
      setTotal(response.total)
      setPage(pageNum)
    } catch (error) {
      showToast("Failed to load patients", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPatients(page + 1, debouncedSearch, statusFilter)
    }
  }

  const handleAddPatient = async (data: CreatePatientInput) => {
    try {
      const newPatient = await createPatient(data)
      showToast("Patient created successfully", "success")
      // Refresh the list
      setSearchQuery("")
      await fetchPatients(1, "", statusFilter)
      // Navigate to the new patient profile
      router.push(`/patients/${newPatient.id}`)
    } catch (error) {
      showToast("Failed to create patient", "error")
    }
  }

  const filteredCount = searchQuery ? patients.length : total

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        subtitle={
          searchQuery
            ? `${filteredCount} patient${filteredCount !== 1 ? "s" : ""} found`
            : `${total} total patient${total !== 1 ? "s" : ""}`
        }
      />

      <PatientsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddPatient={() => setShowAddModal(true)}
        totalPatients={total}
        filteredCount={filteredCount}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        role={role}
      />

      {loading && patients.length === 0 ? (
        <PatientsSkeleton />
      ) : patients.length === 0 ? (
        <EmptyPatientsState
          hasSearchQuery={!!searchQuery}
          onAddPatient={() => setShowAddModal(true)}
        />
      ) : (
        <>
          {viewMode === "table" ? (
            <PatientsTable patients={patients} />
          ) : (
            <PatientsCards patients={patients} />
          )}

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="secondary"
                onClick={handleLoadMore}
                disabled={loading}
                isLoading={loading}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}

      <AddPatientModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleAddPatient}
      />
    </div>
  )
}
