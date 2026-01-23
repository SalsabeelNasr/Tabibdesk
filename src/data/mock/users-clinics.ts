// Mock users and clinics data
// Users: 2 doctors and 1 assistant with Arabic names
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
    full_name: "أحمد حسن",
    first_name: "أحمد",
    last_name: "حسن",
    role: "doctor",
    specialization: "العلاج الطبيعي والتغذية",
    avatar_initials: "أح",
  },
  {
    id: "user-002",
    email: "fatima.ali@tabibdesk.com",
    full_name: "فاطمة علي",
    first_name: "فاطمة",
    last_name: "علي",
    role: "doctor",
    specialization: "الطب الباطني",
    avatar_initials: "فع",
  },
  {
    id: "user-003",
    email: "mariam.mohamed@tabibdesk.com",
    full_name: "مريم محمد",
    first_name: "مريم",
    last_name: "محمد",
    role: "assistant",
    avatar_initials: "مم",
  },
  {
    id: "user-004",
    email: "sara.ibrahim@tabibdesk.com",
    full_name: "سارة إبراهيم",
    first_name: "سارة",
    last_name: "إبراهيم",
    role: "manager",
    avatar_initials: "سإ",
  },
]

// Mock Clinics (name is the location)
export const mockClinics: MockClinic[] = [
  {
    id: "clinic-001",
    name: "المعادي",
    location: "المعادي",
    address: "شارع النيل، المعادي، القاهرة، مصر",
    phone: "+20 2 2750 1234",
  },
  {
    id: "clinic-002",
    name: "مدينة نصر",
    location: "مدينة نصر",
    address: "شارع عباس العقاد، مدينة نصر، القاهرة، مصر",
    phone: "+20 2 2274 5678",
  },
  {
    id: "clinic-003",
    name: "الزمالك",
    location: "الزمالك",
    address: "شارع 26 يوليو، الزمالك، القاهرة، مصر",
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
export const DEFAULT_CURRENT_CLINIC_ID = "clinic-001"
