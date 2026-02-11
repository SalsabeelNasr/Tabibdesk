/**
 * Supabase appointments repository - real implementation.
 */

import { createClient } from "@/lib/supabase/client"
import type {
  IAppointmentsRepository,
  AppointmentRow,
  AppointmentInsert,
  AppointmentUpdate,
} from "../../interfaces/appointments.interface"
import { NotFoundError, translateError } from "../../errors"

function rowToAppointmentRow(row: Record<string, unknown>): AppointmentRow {
  return {
    id: row.id as string,
    clinic_id: row.clinic_id as string,
    patient_id: row.patient_id as string,
    scheduled_at: row.scheduled_at as string,
    status: row.status as string,
    notes: (row.notes as string | null) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    deleted_at: (row.deleted_at as string | null) ?? null,
    doctor_id: (row.doctor_id as string | null) ?? null,
    type: row.type as string | undefined,
    patient_name: (row.patient_name as string | null) ?? undefined,
  }
}

export class SupabaseAppointmentsRepository implements IAppointmentsRepository {
  async getAppointments(clinicId: string): Promise<AppointmentRow[]> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("clinic_id", clinicId)
        .is("deleted_at", null)
        .order("scheduled_at", { ascending: true })

      if (error) throw error
      return (data ?? []).map((r) => rowToAppointmentRow(r as Record<string, unknown>))
    } catch (error) {
      throw translateError(error)
    }
  }

  async getAppointment(id: string, clinicId: string): Promise<AppointmentRow> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("id", id)
        .eq("clinic_id", clinicId)
        .is("deleted_at", null)
        .single()

      if (error) {
        if (error.code === "PGRST116") throw new NotFoundError("Appointment", id)
        throw error
      }
      return rowToAppointmentRow(data as Record<string, unknown>)
    } catch (error) {
      throw translateError(error)
    }
  }

  async getById(id: string): Promise<AppointmentRow | null> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("id", id)
        .is("deleted_at", null)
        .maybeSingle()

      if (error) throw error
      return data ? rowToAppointmentRow(data as Record<string, unknown>) : null
    } catch (error) {
      throw translateError(error)
    }
  }

  async createAppointment(insert: AppointmentInsert): Promise<AppointmentRow> {
    try {
      const supabase = createClient()
      const row: Record<string, unknown> = {
        clinic_id: insert.clinic_id,
        patient_id: insert.patient_id,
        scheduled_at: insert.scheduled_at,
        status: insert.status ?? "scheduled",
        notes: insert.notes ?? null,
        doctor_id: insert.doctor_id ?? null,
        type: insert.type ?? null,
        patient_name: insert.patient_name ?? null,
      }

      const { data, error } = await supabase
        .from("appointments")
        .insert(row)
        .select()
        .single()

      if (error) throw error
      return rowToAppointmentRow(data as Record<string, unknown>)
    } catch (error) {
      throw translateError(error)
    }
  }

  async updateAppointment(id: string, updates: AppointmentUpdate): Promise<AppointmentRow> {
    try {
      const supabase = createClient()
      const payload: Record<string, unknown> = {
        ...updates,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from("appointments")
        .update(payload)
        .eq("id", id)
        .select()
        .single()

      if (error) {
        if (error.code === "PGRST116") throw new NotFoundError("Appointment", id)
        throw error
      }
      return rowToAppointmentRow(data as Record<string, unknown>)
    } catch (error) {
      throw translateError(error)
    }
  }

  async deleteAppointment(id: string, clinicId: string): Promise<void> {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("appointments")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id)
        .eq("clinic_id", clinicId)

      if (error) throw error
    } catch (error) {
      throw translateError(error)
    }
  }
}
