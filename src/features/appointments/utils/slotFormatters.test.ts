import { describe, it, expect } from "vitest"
import {
  formatSlotDate,
  formatSlotTime,
  formatSlotTime24,
  formatSlotDateTime,
  getSlotDuration,
  calculateBufferTime,
} from "./slotFormatters"
import type { Slot } from "../types"

// Use fixed locale for deterministic tests
const testDate = "2024-06-15T14:30:00.000Z"

describe("slotFormatters", () => {
  describe("formatSlotDate", () => {
    it("formats date with weekday, month, day, year", () => {
      const result = formatSlotDate(testDate)
      expect(result).toMatch(/^[A-Za-z]{3}, [A-Za-z]{3} \d{1,2}, 2024$/)
    })
  })

  describe("formatSlotTime", () => {
    it("formats time in 12-hour format", () => {
      const result = formatSlotTime(testDate)
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/)
    })
  })

  describe("formatSlotTime24", () => {
    it("formats time in 24-hour format", () => {
      const result = formatSlotTime24(testDate)
      expect(result).toMatch(/\d{2}:\d{2}/)
    })
  })

  describe("formatSlotDateTime", () => {
    it("combines date and time", () => {
      const result = formatSlotDateTime(testDate)
      expect(result).toContain("•")
      expect(result).toMatch(/[A-Za-z]{3}, [A-Za-z]{3} \d{1,2}, 2024/)
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/)
    })
  })

  describe("getSlotDuration", () => {
    it("returns duration in minutes between two times", () => {
      const start = "2024-06-15T10:00:00.000Z"
      const end = "2024-06-15T10:30:00.000Z"
      expect(getSlotDuration(start, end)).toBe(30)
    })

    it("rounds to nearest minute", () => {
      const start = "2024-06-15T10:00:00.000Z"
      const end = "2024-06-15T10:30:45.000Z"
      expect(getSlotDuration(start, end)).toBe(31)
    })
  })

  describe("calculateBufferTime", () => {
    it("returns buffer minutes between slots", () => {
      const slot1: Slot = {
        id: "s1",
        clinicId: "c1",
        doctorId: "d1",
        startAt: "2024-06-15T10:00:00.000Z",
        endAt: "2024-06-15T10:30:00.000Z",
        state: "empty",
      }
      const slot2: Slot = {
        id: "s2",
        clinicId: "c1",
        doctorId: "d1",
        startAt: "2024-06-15T10:35:00.000Z",
        endAt: "2024-06-15T11:00:00.000Z",
        state: "empty",
      }
      expect(calculateBufferTime(slot1, slot2)).toBe(5)
    })

    it("returns 0 when slots overlap or are back-to-back", () => {
      const slot1: Slot = {
        id: "s1",
        clinicId: "c1",
        doctorId: "d1",
        startAt: "2024-06-15T10:00:00.000Z",
        endAt: "2024-06-15T10:30:00.000Z",
        state: "empty",
      }
      const slot2: Slot = {
        id: "s2",
        clinicId: "c1",
        doctorId: "d1",
        startAt: "2024-06-15T10:30:00.000Z",
        endAt: "2024-06-15T11:00:00.000Z",
        state: "empty",
      }
      expect(calculateBufferTime(slot1, slot2)).toBe(0)
    })
  })
})
