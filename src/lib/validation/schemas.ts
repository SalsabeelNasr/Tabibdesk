// Validation schemas using Zod
// To use: npm install zod

/*
import { z } from "zod"

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// Patient schemas
export const patientSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
})

// Appointment schemas
export const appointmentSchema = z.object({
  patient_id: z.string().uuid("Invalid patient ID"),
  scheduled_at: z.string().datetime("Invalid date/time"),
  status: z.enum(["scheduled", "confirmed", "in_progress", "completed", "cancelled"]).default("scheduled"),
  notes: z.string().optional(),
})

// Visit schemas
export const visitSchema = z.object({
  patient_id: z.string().uuid("Invalid patient ID"),
  appointment_id: z.string().uuid().optional(),
  visit_date: z.string().datetime("Invalid date/time"),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type PatientInput = z.infer<typeof patientSchema>
export type AppointmentInput = z.infer<typeof appointmentSchema>
export type VisitInput = z.infer<typeof visitSchema>
*/

// Placeholder type definitions until Zod is installed
export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
}

export type PatientInput = {
  first_name: string
  last_name: string
  email?: string | null
  phone?: string
  date_of_birth?: string
  gender?: "male" | "female" | "other"
}

export type AppointmentInput = {
  patient_id: string
  scheduled_at: string
  status?: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled"
  notes?: string
}

export type VisitInput = {
  patient_id: string
  appointment_id?: string
  visit_date: string
  diagnosis?: string
  notes?: string
}
