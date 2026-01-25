/**
 * Pricing API - Doctor pricing per clinic per appointment type
 * Mock implementation, backend-replaceable
 */

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// In-memory stores
const clinicAppointmentTypesStore: Record<string, string[]> = {}
const doctorPricingStore: Record<string, Record<string, number>> = {} // key: `${clinicId}:${doctorId}`

/**
 * Initialize mock pricing data
 */
function initializeMockPricing() {
  // Set appointment types for clinic-001
  clinicAppointmentTypesStore["clinic-001"] = [
    "Consultation",
    "Follow-up",
    "Check-up",
    "Procedure",
  ]

  // Set pricing for user-001 (Dr. Ahmed Hassan) at clinic-001
  doctorPricingStore["clinic-001:user-001"] = {
    "Consultation": 500,
    "Follow-up": 300,
    "Check-up": 400,
    "Procedure": 600,
  }

  // Set pricing for user-002 (Dr. Fatima Ali) at clinic-001
  doctorPricingStore["clinic-001:user-002"] = {
    "Consultation": 500,
    "Follow-up": 300,
    "Check-up": 400,
    "Procedure": 600,
  }
}

// Initialize on module load
initializeMockPricing()

/**
 * Get appointment types for a clinic
 */
export async function getClinicAppointmentTypes(clinicId: string): Promise<string[]> {
  await delay(100)
  
  if (!clinicAppointmentTypesStore[clinicId]) {
    // Default appointment types
    clinicAppointmentTypesStore[clinicId] = [
      "Consultation",
      "Follow-up",
      "Check-up",
      "Procedure",
    ]
  }
  
  return [...clinicAppointmentTypesStore[clinicId]]
}

/**
 * Set appointment types for a clinic
 */
export async function setClinicAppointmentTypes(
  clinicId: string,
  types: string[]
): Promise<string[]> {
  await delay(200)
  
  clinicAppointmentTypesStore[clinicId] = [...types]
  return [...types]
}

/**
 * Get doctor pricing for a clinic
 * Returns map: { [appointmentType]: amount }
 */
export async function getDoctorPricing(params: {
  clinicId: string
  doctorId: string
}): Promise<Record<string, number>> {
  await delay(100)
  
  const key = `${params.clinicId}:${params.doctorId}`
  
  if (!doctorPricingStore[key]) {
    // Return empty object if no pricing set
    return {}
  }
  
  return { ...doctorPricingStore[key] }
}

/**
 * Set doctor pricing for a clinic
 */
export async function setDoctorPricing(params: {
  clinicId: string
  doctorId: string
  pricingByType: Record<string, number>
}): Promise<Record<string, number>> {
  await delay(200)
  
  const key = `${params.clinicId}:${params.doctorId}`
  doctorPricingStore[key] = { ...params.pricingByType }
  
  return { ...doctorPricingStore[key] }
}

/**
 * Get price for a specific appointment type
 * Returns null if pricing not set
 */
export async function getPriceForAppointmentType(params: {
  clinicId: string
  doctorId: string
  appointmentType: string
}): Promise<number | null> {
  const pricing = await getDoctorPricing({
    clinicId: params.clinicId,
    doctorId: params.doctorId,
  })
  
  return pricing[params.appointmentType] ?? null
}
