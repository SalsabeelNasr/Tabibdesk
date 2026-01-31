import { describe, it, expect } from "vitest"
import {
  calculateAge,
  computePatientStatus,
  searchPatients,
  getStatusBadgeVariant,
  getStatusLabel,
} from "./patients.utils"
import type { Patient } from "./patients.types"

const createPatient = (overrides: Partial<Patient> = {}): Patient => ({
  id: "p1",
  first_name: "John",
  last_name: "Doe",
  date_of_birth: null,
  age: null,
  gender: "male",
  phone: "+201234567890",
  email: "john@example.com",
  address: null,
  height: null,
  complaint: null,
  job: null,
  doctor_id: null,
  status: "active",
  first_visit_at: null,
  last_visit_at: null,
  created_at: "",
  updated_at: "",
  ...overrides,
})

describe("patients.utils", () => {
  describe("calculateAge", () => {
    it("returns ageFromDb when provided", () => {
      expect(calculateAge("1990-01-01", 35)).toBe(35)
    })

    it("returns N/A when no dateOfBirth and no ageFromDb", () => {
      expect(calculateAge(null, null)).toBe("N/A")
    })

    it("calculates age from dateOfBirth", () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 30)
      const dob = birthDate.toISOString().split("T")[0]
      const age = calculateAge(dob, null)
      expect(age).toBe(30)
    })
  })

  describe("computePatientStatus", () => {
    it("returns patient status when present", () => {
      expect(computePatientStatus(createPatient({ status: "active" }), null)).toBe("active")
      expect(computePatientStatus(createPatient({ status: "inactive" }), null)).toBe("inactive")
      expect(computePatientStatus(createPatient({ status: "lost" }), null)).toBe("lost")
    })

    it("returns inactive when status is missing", () => {
      expect(computePatientStatus(createPatient({ status: undefined as any }), null)).toBe("inactive")
    })
  })

  describe("searchPatients", () => {
    const patients = [
      createPatient({ first_name: "John", last_name: "Doe", phone: "123", email: "john@x.com" }),
      createPatient({ first_name: "Jane", last_name: "Smith", phone: "456", email: "jane@x.com" }),
    ]

    it("returns all patients when query is empty", () => {
      expect(searchPatients(patients, "")).toEqual(patients)
      expect(searchPatients(patients, "   ")).toEqual(patients)
    })

    it("filters by first name", () => {
      expect(searchPatients(patients, "John")).toHaveLength(1)
      expect(searchPatients(patients, "john")[0].first_name).toBe("John")
    })

    it("filters by last name", () => {
      expect(searchPatients(patients, "Smith")).toHaveLength(1)
    })

    it("filters by phone", () => {
      expect(searchPatients(patients, "123")).toHaveLength(1)
    })

    it("filters by email", () => {
      expect(searchPatients(patients, "jane@x")).toHaveLength(1)
    })
  })

  describe("getStatusBadgeVariant", () => {
    it("returns correct variant for each status", () => {
      expect(getStatusBadgeVariant("inactive")).toBe("neutral")
      expect(getStatusBadgeVariant("active")).toBe("success")
      expect(getStatusBadgeVariant("lost")).toBe("error")
    })

    it("returns neutral for unknown status", () => {
      expect(getStatusBadgeVariant("unknown" as any)).toBe("neutral")
    })
  })

  describe("getStatusLabel", () => {
    it("returns correct label for each status", () => {
      expect(getStatusLabel("inactive")).toBe("Inactive")
      expect(getStatusLabel("active")).toBe("Active")
      expect(getStatusLabel("lost")).toBe("Lost")
    })

    it("returns Unknown for unknown status", () => {
      expect(getStatusLabel("unknown" as any)).toBe("Unknown")
    })
  })
})
