// Validation schemas using Zod
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
    clinicName: z.string().min(1, "Clinic name is required"),
    fullName: z.string().min(1, "Full name is required"),
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
  patient_id: z.string().min(1, "Patient ID is required"),
  scheduled_at: z.string().min(1, "Invalid date/time"),
  status: z
    .enum(["scheduled", "confirmed", "in_progress", "completed", "cancelled"])
    .default("scheduled"),
  notes: z.string().optional(),
})

// Visit schemas
export const visitSchema = z.object({
  patient_id: z.string().min(1, "Patient ID is required"),
  appointment_id: z.string().optional(),
  visit_date: z.string().min(1, "Invalid date/time"),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type PatientInput = z.infer<typeof patientSchema>
export type AppointmentInput = z.infer<typeof appointmentSchema>
export type VisitInput = z.infer<typeof visitSchema>
