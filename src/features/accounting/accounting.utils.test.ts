import { describe, it, expect } from "vitest"
import {
  formatCurrency,
  getPaymentStatusVariant,
  getPaymentStatusLabel,
  getPaymentMethodLabel,
  getExpenseCategoryLabel,
  getExpenseCategoryVariant,
  formatDate,
  formatMonth,
  getCurrentMonth,
  getTodayDate,
  calculatePercentage,
  requiresApproval,
} from "./accounting.utils"

describe("accounting.utils", () => {
  describe("formatCurrency", () => {
    it("formats amount in EGP", () => {
      expect(formatCurrency(100)).toBe("100 EGP")
    })

    it("rounds to nearest integer", () => {
      expect(formatCurrency(99.7)).toBe("100 EGP")
      expect(formatCurrency(99.2)).toBe("99 EGP")
    })
  })

  describe("getPaymentStatusVariant", () => {
    it("returns correct variant for each status", () => {
      expect(getPaymentStatusVariant("paid")).toBe("success")
      expect(getPaymentStatusVariant("partial")).toBe("warning")
      expect(getPaymentStatusVariant("unpaid")).toBe("error")
      expect(getPaymentStatusVariant("pending_approval")).toBe("warning")
    })

    it("returns default for unknown status", () => {
      expect(getPaymentStatusVariant("unknown")).toBe("default")
    })
  })

  describe("getPaymentStatusLabel", () => {
    it("returns correct label for each status", () => {
      expect(getPaymentStatusLabel("paid")).toBe("Paid")
      expect(getPaymentStatusLabel("partial")).toBe("Partial")
      expect(getPaymentStatusLabel("unpaid")).toBe("Unpaid")
      expect(getPaymentStatusLabel("refunded")).toBe("Refunded")
      expect(getPaymentStatusLabel("cancelled")).toBe("Cancelled")
    })
  })

  describe("getPaymentMethodLabel", () => {
    it("returns correct label for each method", () => {
      expect(getPaymentMethodLabel("cash")).toBe("Cash")
      expect(getPaymentMethodLabel("instapay")).toBe("Instapay")
      expect(getPaymentMethodLabel("credit_card")).toBe("Credit Card")
      expect(getPaymentMethodLabel("bank_transfer")).toBe("Bank Transfer")
    })
  })

  describe("getExpenseCategoryLabel", () => {
    it("returns correct label for each category", () => {
      expect(getExpenseCategoryLabel("rent")).toBe("Rent")
      expect(getExpenseCategoryLabel("salaries")).toBe("Salaries")
      expect(getExpenseCategoryLabel("supplies")).toBe("Supplies")
    })
  })

  describe("getExpenseCategoryVariant", () => {
    it("returns correct variant for categories", () => {
      expect(getExpenseCategoryVariant("rent")).toBe("error")
      expect(getExpenseCategoryVariant("salaries")).toBe("warning")
      expect(getExpenseCategoryVariant("marketing")).toBe("success")
      expect(getExpenseCategoryVariant("other")).toBe("default")
    })
  })

  describe("formatDate", () => {
    it("formats ISO date string", () => {
      const result = formatDate("2024-06-15")
      expect(result).toMatch(/Jun.*15.*2024|June 15, 2024/)
    })
  })

  describe("formatMonth", () => {
    it("formats month string YYYY-MM", () => {
      const result = formatMonth("2024-06")
      expect(result).toMatch(/June.*2024|Jun.*2024/)
    })
  })

  describe("getCurrentMonth", () => {
    it("returns YYYY-MM format", () => {
      const result = getCurrentMonth()
      expect(result).toMatch(/^\d{4}-\d{2}$/)
    })
  })

  describe("getTodayDate", () => {
    it("returns YYYY-MM-DD format", () => {
      const result = getTodayDate()
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  describe("calculatePercentage", () => {
    it("calculates percentage correctly", () => {
      expect(calculatePercentage(50, 200)).toBe(25)
      expect(calculatePercentage(1, 3)).toBe(33)
    })

    it("returns 0 when total is 0", () => {
      expect(calculatePercentage(10, 0)).toBe(0)
    })
  })

  describe("requiresApproval", () => {
    it("returns true for instapay/bank_transfer/credit_card with evidence", () => {
      expect(requiresApproval("instapay", true)).toBe(true)
      expect(requiresApproval("bank_transfer", true)).toBe(true)
      expect(requiresApproval("credit_card", true)).toBe(true)
    })

    it("returns false for cash", () => {
      expect(requiresApproval("cash", true)).toBe(false)
    })

    it("returns false when no evidence", () => {
      expect(requiresApproval("instapay", false)).toBe(false)
    })
  })
})
