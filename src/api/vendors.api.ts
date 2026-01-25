/**
 * Vendors API - Smart autocomplete with fuzzy matching
 * Mock implementation, backend-replaceable
 */

import type { Vendor } from "@/types/vendor"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// In-memory store
const vendorsStore: Vendor[] = []

/**
 * Initialize mock vendors
 */
function initializeMockVendors() {
  if (vendorsStore.length > 0) return // Already initialized

  const mockVendors: Vendor[] = [
    {
      id: "vendor_001",
      clinicId: "clinic-001",
      name: "Medical Supplies Co.",
      normalizedName: normalizeVendorName("Medical Supplies Co."),
      createdAt: new Date().toISOString(),
    },
    {
      id: "vendor_002",
      clinicId: "clinic-001",
      name: "Building Management",
      normalizedName: normalizeVendorName("Building Management"),
      createdAt: new Date().toISOString(),
    },
    {
      id: "vendor_003",
      clinicId: "clinic-001",
      name: "Electricity Company",
      normalizedName: normalizeVendorName("Electricity Company"),
      createdAt: new Date().toISOString(),
    },
    {
      id: "vendor_004",
      clinicId: "clinic-001",
      name: "Digital Marketing Agency",
      normalizedName: normalizeVendorName("Digital Marketing Agency"),
      createdAt: new Date().toISOString(),
    },
    {
      id: "vendor_005",
      clinicId: "clinic-001",
      name: "Pharmacy Supplies",
      normalizedName: normalizeVendorName("Pharmacy Supplies"),
      createdAt: new Date().toISOString(),
    },
  ]

  vendorsStore.push(...mockVendors)
}

// Initialize on module load
initializeMockVendors()

/**
 * Normalize vendor name for deduplication
 */
function normalizeVendorName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ") // Collapse spaces
    .replace(/[^\w\s]/g, "") // Remove punctuation
}

/**
 * Calculate string similarity (simple Levenshtein-based)
 * Returns value between 0 and 1
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1.0
  
  const distance = levenshteinDistance(longer, shorter)
  return (longer.length - distance) / longer.length
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}

export interface ListVendorsParams {
  clinicId: string
  query?: string
}

export interface SuggestVendorsParams {
  clinicId: string
  input: string
}

/**
 * List vendors for a clinic
 */
export async function listVendors(params: ListVendorsParams): Promise<Vendor[]> {
  await delay(100)
  
  let filtered = vendorsStore.filter((v) => v.clinicId === params.clinicId)
  
  if (params.query) {
    const queryLower = params.query.toLowerCase()
    filtered = filtered.filter((v) => 
      v.name.toLowerCase().includes(queryLower) ||
      v.normalizedName.includes(queryLower)
    )
  }
  
  return filtered.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Suggest vendors based on input (fuzzy matching)
 * Returns top 5 results with similarity >= 0.75
 */
export async function suggestVendors(params: SuggestVendorsParams): Promise<Vendor[]> {
  await delay(150)
  
  const inputNormalized = normalizeVendorName(params.input)
  const clinicVendors = vendorsStore.filter((v) => v.clinicId === params.clinicId)
  
  if (!inputNormalized) {
    return clinicVendors.slice(0, 5)
  }
  
  // Calculate similarity for each vendor
  const vendorsWithSimilarity = clinicVendors.map((vendor) => ({
    vendor,
    similarity: calculateSimilarity(inputNormalized, vendor.normalizedName),
  }))
  
  // Filter by threshold (>= 0.75) and sort by similarity
  const filtered = vendorsWithSimilarity
    .filter((item) => item.similarity >= 0.75)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)
    .map((item) => item.vendor)
  
  return filtered
}

/**
 * Create a new vendor (or return existing if normalized name matches)
 */
export async function createVendor(params: { clinicId: string; name: string }): Promise<Vendor> {
  await delay(200)
  
  const normalizedName = normalizeVendorName(params.name)
  
  // Check if vendor with same normalized name already exists
  const existing = vendorsStore.find(
    (v) => v.clinicId === params.clinicId && v.normalizedName === normalizedName
  )
  
  if (existing) {
    return existing
  }
  
  // Create new vendor
  const newVendor: Vendor = {
    id: `vendor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    clinicId: params.clinicId,
    name: params.name.trim(),
    normalizedName,
    createdAt: new Date().toISOString(),
  }
  
  vendorsStore.push(newVendor)
  return newVendor
}
