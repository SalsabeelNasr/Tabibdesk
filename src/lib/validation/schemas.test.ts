import { describe, it, expect } from "vitest"
import {
  loginSchema,
  registerSchema,
  patientSchema,
  appointmentSchema,
} from "./schemas"

describe("validation schemas", () => {
  describe("loginSchema", () => {
    it("validates correct login input", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "secret",
      })
      expect(result.success).toBe(true)
    })

    it("rejects invalid email", () => {
      const result = loginSchema.safeParse({
        email: "invalid",
        password: "secret",
      })
      expect(result.success).toBe(false)
    })

    it("rejects empty password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "",
      })
      expect(result.success).toBe(false)
    })
  })

  describe("registerSchema", () => {
    it("validates correct register input", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        password: "SecurePass1!",
        confirmPassword: "SecurePass1!",
        clinicName: "My Clinic",
        fullName: "John Doe",
      })
      expect(result.success).toBe(true)
    })

    it("rejects when passwords don't match", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        password: "SecurePass1!",
        confirmPassword: "DifferentPass1!",
        clinicName: "My Clinic",
        fullName: "John Doe",
      })
      expect(result.success).toBe(false)
    })

    it("rejects weak password", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        password: "weak",
        confirmPassword: "weak",
        clinicName: "My Clinic",
        fullName: "John Doe",
      })
      expect(result.success).toBe(false)
    })
  })

  describe("patientSchema", () => {
    it("validates minimal patient", () => {
      const result = patientSchema.safeParse({
        first_name: "John",
        last_name: "Doe",
      })
      expect(result.success).toBe(true)
    })

    it("rejects empty first name", () => {
      const result = patientSchema.safeParse({
        first_name: "",
        last_name: "Doe",
      })
      expect(result.success).toBe(false)
    })

    it("accepts optional email", () => {
      const result = patientSchema.safeParse({
        first_name: "John",
        last_name: "Doe",
        email: "",
      })
      expect(result.success).toBe(true)
    })
  })

  describe("appointmentSchema", () => {
    it("validates appointment with defaults", () => {
      const result = appointmentSchema.safeParse({
        patient_id: "patient-123",
        scheduled_at: "2024-06-15T10:00:00Z",
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe("scheduled")
      }
    })
  })
})
