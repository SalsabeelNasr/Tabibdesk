import { OverviewData } from "./schema"

// Generate medical clinic data for the past year
const generateClinicData = (): OverviewData[] => {
  const data: OverviewData[] = []
  const startDate = new Date("2023-01-01")
  const endDate = new Date("2024-12-31")
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay()
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 // Friday or Saturday in Egypt
    const isMidWeek = dayOfWeek === 2 || dayOfWeek === 3 // Busiest days
    
    // Base values with realistic ranges for a small clinic
    const baseVisits = isWeekend ? 3 : (isMidWeek ? 20 : 15)
    const baseAppointments = isWeekend ? 5 : (isMidWeek ? 25 : 18)
    const baseCompleted = Math.round(baseAppointments * 0.85) // 85% completion rate
    const baseRevenue = baseVisits * (Math.random() * 200 + 150) // 150-350 EGP per visit
    const baseNewPatients = isWeekend ? 1 : Math.round(Math.random() * 3 + 2) // 2-5 new patients
    const baseFollowUp = baseVisits - baseNewPatients
    
    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4 // 0.8 to 1.2
    
    data.push({
      date: d.toISOString(),
      "Patient Visits": Math.round(baseVisits * randomFactor),
      "Appointments Scheduled": Math.round(baseAppointments * randomFactor),
      "Appointments Completed": Math.round(baseCompleted * randomFactor),
      "Revenue (EGP)": Math.round(baseRevenue * randomFactor),
      "New Patients": Math.round(baseNewPatients * randomFactor),
      "Follow-up Visits": Math.round(baseFollowUp * randomFactor),
    })
  }
  
  return data
}

export const overviews: OverviewData[] = generateClinicData()

