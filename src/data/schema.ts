export type Usage = {
  owner: string
  status: string
  costs: number
  region: string
  stability: number
  lastEdited: string
}

export type OverviewData = {
  date: string
  "Patient Visits": number
  "Appointments Scheduled": number
  "Appointments Completed": number
  "Revenue (EGP)": number
  "New Patients": number
  "Follow-up Visits": number
}

