// Mock users and clinics data
// Users: 2 doctors and 1 assistant with English names
// Clinics: 3 clinics with Egyptian locations (clinic name is called by location)

export interface MockUser {
  id: string
  email: string
  full_name: string
  first_name: string
  last_name: string
  role: "doctor" | "assistant" | "manager"
  specialization?: string
  avatar_initials: string
  isManager?: boolean
}

export interface MockClinic {
  id: string
  name: string // Name is the location
  location: string
  address: string
  phone: string
}

// Mock Users
export const mockUsers: MockUser[] = [
  {
    id: "user-001",
    email: "ahmed.hassan@tabibdesk.com",
    full_name: "Ahmed Hassan",
    first_name: "Ahmed",
    last_name: "Hassan",
    role: "doctor",
    specialization: "Physical Therapy & Nutrition",
    avatar_initials: "AH",
  },
  {
    id: "user-002",
    email: "fatima.ali@tabibdesk.com",
    full_name: "Fatima Ali",
    first_name: "Fatima",
    last_name: "Ali",
    role: "doctor",
    specialization: "Internal Medicine",
    avatar_initials: "FA",
  },
  {
    id: "user-003",
    email: "mariam.mohamed@tabibdesk.com",
    full_name: "Mariam Mohamed",
    first_name: "Mariam",
    last_name: "Mohamed",
    role: "assistant",
    avatar_initials: "MM",
  },
  {
    id: "user-004",
    email: "sara.ibrahim@tabibdesk.com",
    full_name: "Sara Ibrahim",
    first_name: "Sara",
    last_name: "Ibrahim",
    role: "manager",
    avatar_initials: "SI",
  },
]

// Mock Clinics (name is the location)
export const mockClinics: MockClinic[] = [
  {
    id: "clinic-001",
    name: "Maadi",
    location: "Maadi",
    address: "Nile Street, Maadi, Cairo, Egypt",
    phone: "+20 2 2750 1234",
  },
  {
    id: "clinic-002",
    name: "New Cairo",
    location: "New Cairo",
    address: "90th Street, New Cairo, Cairo, Egypt",
    phone: "+20 2 2274 5678",
  },
  {
    id: "clinic-003",
    name: "Sheikh Zayed",
    location: "Sheikh Zayed",
    address: "26th of July Corridor, Sheikh Zayed, Giza, Egypt",
    phone: "+20 2 2735 9012",
  },
]

// Get user by ID
export function getMockUserById(userId: string): MockUser | undefined {
  return mockUsers.find((user) => user.id === userId)
}

// Get clinic by ID
export function getMockClinicById(clinicId: string): MockClinic | undefined {
  return mockClinics.find((clinic) => clinic.id === clinicId)
}

// Get users by role
export function getMockUsersByRole(role: "doctor" | "assistant" | "manager"): MockUser[] {
  return mockUsers.filter((user) => user.role === role)
}

// Default current user (can be changed via Switch User)
export const DEFAULT_CURRENT_USER_ID = "user-001"
// Default clinic: Maadi (clinic-001)
export const DEFAULT_CURRENT_CLINIC_ID = "clinic-001"
