// Clean separation of mock data from app logic
// This file contains all mock data for demo mode

export const DEMO_DOCTOR_ID = "demo-doctor-001"
export const DEMO_CLINIC_ID = "demo-clinic-001"

export const mockDoctor = {
  id: DEMO_DOCTOR_ID,
  email: "demo@tabibdesk.com",
  full_name: "Dr. Ahmed Hassan",
  specialization: "Physical Therapy & Nutrition",
  biography: "Expert in therapeutic exercise and nutritional counseling",
  image_url: "/images/tabibdesk-logo.png",
  role: "doctor",
  doctor_id: DEMO_DOCTOR_ID,
  created_at: new Date().toISOString(),
}

export const mockClinic = {
  id: DEMO_CLINIC_ID,
  name: "TabibDesk Wellness Center",
  address: "123 Medical Street, Cairo, Egypt",
  location: "Downtown Cairo",
  phone: "+20 123 456 7890",
  created_at: new Date().toISOString(),
  tidycal_booking_type_id: "demo-booking-type",
}

export const mockDoctors = [mockDoctor]

// Extended Patient interface with all medical fields
interface Patient {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string | null
  age: number | null
  gender: string
  phone: string
  email: string | null
  address: string | null
  height: number | null
  complaint: string | null
  job: string | null
  ai_diagnosis: string | null
  ai_diagnosis_updated_at: string | null
  // Medical conditions
  is_diabetic: boolean | null
  is_hypertensive: boolean | null
  has_pancreatitis: boolean | null
  is_pregnant: boolean | null
  is_breastfeeding: boolean | null
  glp1a_previous_exposure: boolean | null
  has_rheumatoid: boolean | null
  has_ihd: boolean | null
  has_heart_failure: boolean | null
  has_gerd: boolean | null
  has_gastritis: boolean | null
  has_hepatic: boolean | null
  has_anaemia: boolean | null
  has_bronchial_asthma: boolean | null
  thyroid_status: string | null
  history_of_operation: any | null
  doctor_id: string | null
  profile_id: string | null
  created_at: string
  updated_at: string
}

export const mockPatients: Patient[] = [
  {
    id: "patient-001",
    first_name: "Fatima",
    last_name: "Mohamed",
    date_of_birth: "1985-03-15",
    age: 39,
    gender: "Female",
    phone: "+20 100 1234567",
    email: "fatima.mohamed@example.com",
    address: "15 Tahrir Square, Cairo, Egypt",
    height: 165,
    complaint: "High blood pressure and occasional headaches",
    job: "Teacher",
    ai_diagnosis: "Hypertension Stage 1 - well controlled with medication. Patient shows good adherence to treatment plan.",
    ai_diagnosis_updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_diabetic: false,
    is_hypertensive: true,
    has_pancreatitis: false,
    is_pregnant: false,
    is_breastfeeding: false,
    glp1a_previous_exposure: false,
    has_rheumatoid: false,
    has_ihd: false,
    has_heart_failure: false,
    has_gerd: false,
    has_gastritis: false,
    has_hepatic: false,
    has_anaemia: false,
    has_bronchial_asthma: false,
    thyroid_status: "Normal",
    history_of_operation: null,
    doctor_id: DEMO_DOCTOR_ID,
    profile_id: null,
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "patient-002",
    first_name: "Ahmed",
    last_name: "Abdullah",
    date_of_birth: "1975-07-22",
    age: 49,
    gender: "Male",
    phone: "+20 100 2345678",
    email: "ahmed.abdullah@example.com",
    address: "42 Pyramid Road, Giza, Egypt",
    height: 178,
    complaint: "Type 2 Diabetes, joint pain",
    job: "Engineer",
    ai_diagnosis: "Type 2 Diabetes Mellitus with good glycemic control (HbA1c: 6.8%). Mild osteoarthritis in knees.",
    ai_diagnosis_updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    is_diabetic: true,
    is_hypertensive: false,
    has_pancreatitis: false,
    is_pregnant: false,
    is_breastfeeding: false,
    glp1a_previous_exposure: true,
    has_rheumatoid: false,
    has_ihd: false,
    has_heart_failure: false,
    has_gerd: true,
    has_gastritis: false,
    has_hepatic: false,
    has_anaemia: false,
    has_bronchial_asthma: false,
    thyroid_status: "Normal",
    history_of_operation: ["Appendectomy (2005)"],
    doctor_id: DEMO_DOCTOR_ID,
    profile_id: null,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "patient-003",
    first_name: "Layla",
    last_name: "Ibrahim",
    date_of_birth: "1992-11-08",
    age: 32,
    gender: "Female",
    phone: "+20 100 3456789",
    email: "layla.ibrahim@example.com",
    address: "28 Nile Corniche, Alexandria, Egypt",
    height: 162,
    complaint: "Weight management and fatigue",
    job: "Pharmacist",
    ai_diagnosis: "Hypothyroidism with anemia. Patient requires iron supplementation and thyroid hormone optimization.",
    ai_diagnosis_updated_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    is_diabetic: false,
    is_hypertensive: false,
    has_pancreatitis: false,
    is_pregnant: false,
    is_breastfeeding: false,
    glp1a_previous_exposure: false,
    has_rheumatoid: false,
    has_ihd: false,
    has_heart_failure: false,
    has_gerd: false,
    has_gastritis: false,
    has_hepatic: false,
    has_anaemia: true,
    has_bronchial_asthma: false,
    thyroid_status: "Hypothyroid",
    history_of_operation: null,
    doctor_id: DEMO_DOCTOR_ID,
    profile_id: null,
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "patient-004",
    first_name: "Omar",
    last_name: "Khalil",
    date_of_birth: "1988-05-30",
    age: 36,
    gender: "Male",
    phone: "+20 100 4567890",
    email: "omar.khalil@example.com",
    address: "67 University Street, Cairo, Egypt",
    height: 180,
    complaint: "Asthma and seasonal allergies",
    job: "Accountant",
    ai_diagnosis: "Bronchial Asthma - moderate persistent. Well controlled with current inhaler regimen.",
    ai_diagnosis_updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    is_diabetic: false,
    is_hypertensive: false,
    has_pancreatitis: false,
    is_pregnant: false,
    is_breastfeeding: false,
    glp1a_previous_exposure: false,
    has_rheumatoid: false,
    has_ihd: false,
    has_heart_failure: false,
    has_gerd: false,
    has_gastritis: false,
    has_hepatic: false,
    has_anaemia: false,
    has_bronchial_asthma: true,
    thyroid_status: "Normal",
    history_of_operation: null,
    doctor_id: DEMO_DOCTOR_ID,
    profile_id: null,
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "patient-005",
    first_name: "Nour",
    last_name: "Amin",
    date_of_birth: "1998-09-14",
    age: 26,
    gender: "Female",
    phone: "+20 100 5678901",
    email: "nour.amin@example.com",
    address: "89 Heliopolis, Cairo, Egypt",
    height: 168,
    complaint: "GERD symptoms and weight management",
    job: "Marketing Specialist",
    ai_diagnosis: "Gastroesophageal Reflux Disease (GERD). Recommend dietary modifications and PPI therapy.",
    ai_diagnosis_updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    is_diabetic: false,
    is_hypertensive: false,
    has_pancreatitis: false,
    is_pregnant: false,
    is_breastfeeding: false,
    glp1a_previous_exposure: false,
    has_rheumatoid: false,
    has_ihd: false,
    has_heart_failure: false,
    has_gerd: true,
    has_gastritis: true,
    has_hepatic: false,
    has_anaemia: false,
    has_bronchial_asthma: false,
    thyroid_status: "Normal",
    history_of_operation: null,
    doctor_id: DEMO_DOCTOR_ID,
    profile_id: null,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Weight Logs
interface WeightLog {
  id: string
  patient_id: string
  weight: number
  recorded_date: string
  notes: string | null
}

export const mockWeightLogs: WeightLog[] = [
  // Fatima Mohamed (patient-001)
  {
    id: "weight-001",
    patient_id: "patient-001",
    weight: 72,
    recorded_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "Initial weight",
  },
  {
    id: "weight-002",
    patient_id: "patient-001",
    weight: 70,
    recorded_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "Good progress",
  },
  {
    id: "weight-003",
    patient_id: "patient-001",
    weight: 69,
    recorded_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "Steady decrease",
  },
  {
    id: "weight-004",
    patient_id: "patient-001",
    weight: 68.5,
    recorded_date: new Date().toISOString().split("T")[0],
    notes: "Target almost reached",
  },
  // Ahmed Abdullah (patient-002)
  {
    id: "weight-005",
    patient_id: "patient-002",
    weight: 95,
    recorded_date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "Starting weight",
  },
  {
    id: "weight-006",
    patient_id: "patient-002",
    weight: 92,
    recorded_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "Diet and exercise showing results",
  },
  {
    id: "weight-007",
    patient_id: "patient-002",
    weight: 90,
    recorded_date: new Date().toISOString().split("T")[0],
    notes: "Excellent progress",
  },
]

// Injections
interface Injection {
  id: string
  patient_id: string
  medication_name: string
  dose: string
  injection_date: string
  next_suggested_date: string | null
  next_suggested_dose: string | null
  notes: string | null
  appointment_id: string | null
}

export const mockInjections: Injection[] = [
  {
    id: "inj-001",
    patient_id: "patient-002",
    medication_name: "Ozempic (Semaglutide)",
    dose: "0.5mg",
    injection_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    next_suggested_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    next_suggested_dose: "0.5mg",
    notes: "Patient tolerated well, no side effects",
    appointment_id: "apt-002",
  },
  {
    id: "inj-002",
    patient_id: "patient-002",
    medication_name: "Ozempic (Semaglutide)",
    dose: "0.25mg",
    injection_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    next_suggested_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    next_suggested_dose: "0.5mg",
    notes: "Initial dose, monitor for side effects",
    appointment_id: null,
  },
]

// Medications
interface Medication {
  id: string
  patient_id: string
  name: string
  status: string
  notes: string | null
  created_at: string
}

export const mockMedications: Medication[] = [
  {
    id: "med-001",
    patient_id: "patient-001",
    name: "Amlodipine 5mg",
    status: "active",
    notes: "Take once daily in the morning",
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "med-002",
    patient_id: "patient-001",
    name: "Aspirin 81mg",
    status: "active",
    notes: "Take once daily with food",
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "med-003",
    patient_id: "patient-002",
    name: "Metformin 1000mg",
    status: "active",
    notes: "Take twice daily with meals",
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "med-004",
    patient_id: "patient-002",
    name: "Ozempic 0.5mg",
    status: "active",
    notes: "Weekly injection",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "med-005",
    patient_id: "patient-003",
    name: "Levothyroxine 75mcg",
    status: "active",
    notes: "Take on empty stomach in the morning",
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "med-006",
    patient_id: "patient-003",
    name: "Ferrous Sulfate 325mg",
    status: "active",
    notes: "Take with vitamin C for better absorption",
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "med-007",
    patient_id: "patient-004",
    name: "Albuterol Inhaler",
    status: "active",
    notes: "Use as needed for shortness of breath",
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "med-008",
    patient_id: "patient-005",
    name: "Omeprazole 20mg",
    status: "active",
    notes: "Take 30 minutes before breakfast",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Doctor Notes
interface DoctorNote {
  id: string
  patient_id: string
  note: string
  created_at: string
}

export const mockDoctorNotes: DoctorNote[] = [
  {
    id: "note-001",
    patient_id: "patient-001",
    note: "Patient reports feeling better. Blood pressure under control. Continue current medication.",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "note-002",
    patient_id: "patient-001",
    note: "Started on Amlodipine 5mg. Discussed lifestyle modifications including reduced sodium intake.",
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "note-003",
    patient_id: "patient-002",
    note: "HbA1c improved from 7.8% to 6.8%. Patient shows excellent adherence. Started Ozempic.",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "note-004",
    patient_id: "patient-003",
    note: "Thyroid levels improving. Continue levothyroxine. Iron supplementation showing results.",
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Tasks
interface Task {
  id: string
  patient_id: string
  title: string
  description: string | null
  type: string
  status: string
  due_date: string
  completed_at: string | null
  ignored_at: string | null
  created_at: string
  updated_at: string | null
}

export const mockTasks: Task[] = [
  {
    id: "task-001",
    patient_id: "patient-001",
    title: "Follow-up Blood Pressure Check",
    description: "Schedule appointment to monitor blood pressure after medication adjustment",
    type: "follow_up",
    status: "pending",
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    completed_at: null,
    ignored_at: null,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: null,
  },
  {
    id: "task-002",
    patient_id: "patient-002",
    title: "HbA1c Test",
    description: "Order HbA1c test to monitor diabetes control",
    type: "lab_test",
    status: "pending",
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    completed_at: null,
    ignored_at: null,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: null,
  },
  {
    id: "task-003",
    patient_id: "patient-002",
    title: "Diet Plan Review",
    description: "Review and update meal plan based on recent weight loss progress",
    type: "diet_review",
    status: "completed",
    due_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    ignored_at: null,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "task-004",
    patient_id: "patient-003",
    title: "Thyroid Function Test",
    description: "Check TSH, T3, T4 levels",
    type: "lab_test",
    status: "pending",
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    completed_at: null,
    ignored_at: null,
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: null,
  },
]

// Diet Plans
interface PatientDiet {
  id: string
  patient_id: string
  diet_plan: string
  created_at: string
  updated_at: string
  version: number
  is_active: boolean
}

export const mockPatientDiets: PatientDiet[] = [
  {
    id: "diet-001",
    patient_id: "patient-002",
    diet_plan: `# Diabetes Management Diet Plan

## Daily Targets
- Calories: 1800-2000 kcal
- Carbohydrates: 180-200g (distributed throughout the day)
- Protein: 80-100g
- Fats: 50-60g (focus on healthy fats)

## Meal Structure

### Breakfast (7:00 AM)
- 2 boiled eggs
- 2 slices whole grain toast
- 1 cup green tea
- Small apple

### Mid-Morning Snack (10:00 AM)
- Handful of almonds (10-12 pieces)
- Small orange

### Lunch (1:00 PM)
- Grilled chicken breast (150g)
- Large mixed salad with olive oil dressing
- 1/2 cup brown rice
- Steamed vegetables

### Afternoon Snack (4:00 PM)
- Greek yogurt (low-fat)
- 1 tablespoon chia seeds

### Dinner (7:00 PM)
- Grilled fish (150g)
- Roasted vegetables
- Small portion quinoa
- Green salad

## Guidelines
- Drink 8-10 glasses of water daily
- Avoid sugary drinks and processed foods
- Monitor blood glucose before and after meals
- Exercise 30 minutes daily after meals`,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    version: 2,
    is_active: true,
  },
  {
    id: "diet-002",
    patient_id: "patient-005",
    diet_plan: `# GERD Management Diet Plan

## Foods to Avoid
- Spicy foods
- Citrus fruits
- Tomato-based products
- Chocolate
- Caffeine
- Carbonated drinks
- Fried and fatty foods

## Recommended Foods

### Breakfast
- Oatmeal with banana
- Whole grain toast
- Herbal tea

### Lunch
- Baked chicken or turkey
- Steamed vegetables
- Brown rice or quinoa
- Green salad (no vinegar dressing)

### Dinner (Early - by 6:00 PM)
- Lean protein (fish/chicken)
- Steamed vegetables
- Small portion of pasta or rice

## Eating Guidelines
- Eat smaller, frequent meals
- Avoid eating 2-3 hours before bedtime
- Chew food thoroughly
- Stay upright after meals
- Keep a food diary to identify triggers`,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1,
    is_active: true,
  },
]

// Lab Files
interface LabFile {
  id: string
  filename: string
  original_filename: string
  file_size: number
  mime_type: string
  blob_url: string | null
  uploaded_at: string
  patient_id: string
}

export const mockLabFiles: LabFile[] = [
  {
    id: "labfile-001",
    filename: "lab-report-001.pdf",
    original_filename: "Blood_Test_Results_Jan2025.pdf",
    file_size: 245678,
    mime_type: "application/pdf",
    blob_url: null,
    uploaded_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    patient_id: "patient-001",
  },
  {
    id: "labfile-002",
    filename: "lab-report-002.pdf",
    original_filename: "HbA1c_Test_Dec2024.pdf",
    file_size: 198765,
    mime_type: "application/pdf",
    blob_url: null,
    uploaded_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    patient_id: "patient-002",
  },
]

// Lab Results
interface LabResult {
  id: string
  patient_id: string
  test_name: string
  value: string
  unit: string
  normal_range: string
  status: string
  test_date: string
  pdf_url: string | null
  notes: string | null
  lab_file_id: string | null
}

export const mockLabResults: LabResult[] = [
  // Fatima Mohamed (patient-001) - Hypertension monitoring
  {
    id: "lab-001",
    patient_id: "patient-001",
    test_name: "Blood Pressure",
    value: "128/82",
    unit: "mmHg",
    normal_range: "<120/80",
    status: "borderline",
    test_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: "Improved from last visit",
    lab_file_id: "labfile-001",
  },
  {
    id: "lab-002",
    patient_id: "patient-001",
    test_name: "Cholesterol (Total)",
    value: "195",
    unit: "mg/dL",
    normal_range: "<200",
    status: "normal",
    test_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: null,
    lab_file_id: "labfile-001",
  },
  {
    id: "lab-003",
    patient_id: "patient-001",
    test_name: "LDL",
    value: "115",
    unit: "mg/dL",
    normal_range: "<100",
    status: "borderline",
    test_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: "Continue dietary modifications",
    lab_file_id: "labfile-001",
  },
  // Ahmed Abdullah (patient-002) - Diabetes monitoring
  {
    id: "lab-004",
    patient_id: "patient-002",
    test_name: "HbA1c",
    value: "6.8",
    unit: "%",
    normal_range: "<5.7",
    status: "abnormal",
    test_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: "Good control, improved from 7.8%",
    lab_file_id: "labfile-002",
  },
  {
    id: "lab-005",
    patient_id: "patient-002",
    test_name: "Fasting Glucose",
    value: "118",
    unit: "mg/dL",
    normal_range: "70-100",
    status: "borderline",
    test_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: null,
    lab_file_id: "labfile-002",
  },
  {
    id: "lab-006",
    patient_id: "patient-002",
    test_name: "Creatinine",
    value: "0.9",
    unit: "mg/dL",
    normal_range: "0.7-1.3",
    status: "normal",
    test_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: "Kidney function normal",
    lab_file_id: "labfile-002",
  },
  // Layla Ibrahim (patient-003) - Thyroid and anemia
  {
    id: "lab-007",
    patient_id: "patient-003",
    test_name: "TSH",
    value: "8.2",
    unit: "mIU/L",
    normal_range: "0.4-4.0",
    status: "abnormal",
    test_date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: "Hypothyroidism confirmed, adjust medication",
    lab_file_id: null,
  },
  {
    id: "lab-008",
    patient_id: "patient-003",
    test_name: "Hemoglobin",
    value: "10.5",
    unit: "g/dL",
    normal_range: "12-16 (F)",
    status: "abnormal",
    test_date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: "Anemia present, continue iron supplementation",
    lab_file_id: null,
  },
  {
    id: "lab-009",
    patient_id: "patient-003",
    test_name: "Ferritin",
    value: "15",
    unit: "ng/mL",
    normal_range: "20-200",
    status: "abnormal",
    test_date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: "Low iron stores",
    lab_file_id: null,
  },
  // Additional labs for patient-001 (30 days ago)
  {
    id: "lab-010",
    patient_id: "patient-001",
    test_name: "Blood Pressure",
    value: "135/88",
    unit: "mmHg",
    normal_range: "<120/80",
    status: "abnormal",
    test_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: "Medication adjustment needed",
    lab_file_id: null,
  },
  {
    id: "lab-011",
    patient_id: "patient-001",
    test_name: "Cholesterol (Total)",
    value: "215",
    unit: "mg/dL",
    normal_range: "<200",
    status: "borderline",
    test_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: null,
    lab_file_id: null,
  },
  {
    id: "lab-012",
    patient_id: "patient-001",
    test_name: "HDL",
    value: "45",
    unit: "mg/dL",
    normal_range: ">40",
    status: "normal",
    test_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: null,
    lab_file_id: null,
  },
  {
    id: "lab-013",
    patient_id: "patient-001",
    test_name: "Triglycerides",
    value: "165",
    unit: "mg/dL",
    normal_range: "<150",
    status: "borderline",
    test_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: "Monitor diet",
    lab_file_id: null,
  },
  // Additional labs for patient-001 (60 days ago)
  {
    id: "lab-014",
    patient_id: "patient-001",
    test_name: "Complete Blood Count",
    value: "Normal",
    unit: "",
    normal_range: "Within range",
    status: "normal",
    test_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: "/labs/cbc-report.pdf",
    notes: "All parameters within normal limits",
    lab_file_id: null,
  },
  {
    id: "lab-015",
    patient_id: "patient-001",
    test_name: "Liver Function Test",
    value: "Normal",
    unit: "",
    normal_range: "Within range",
    status: "normal",
    test_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: "/labs/lft-report.pdf",
    notes: null,
    lab_file_id: null,
  },
  // Additional labs for patient-002 (recent comprehensive panel)
  {
    id: "lab-016",
    patient_id: "patient-002",
    test_name: "Hemoglobin",
    value: "14.2",
    unit: "g/dL",
    normal_range: "13-17 (M)",
    status: "normal",
    test_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: null,
    lab_file_id: "labfile-002",
  },
  {
    id: "lab-017",
    patient_id: "patient-002",
    test_name: "Platelets",
    value: "245",
    unit: "K/µL",
    normal_range: "150-400",
    status: "normal",
    test_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: null,
    lab_file_id: "labfile-002",
  },
  {
    id: "lab-018",
    patient_id: "patient-002",
    test_name: "ALT",
    value: "28",
    unit: "U/L",
    normal_range: "7-56",
    status: "normal",
    test_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: "Liver function good",
    lab_file_id: "labfile-002",
  },
  // Additional labs for patient-002 (45 days ago)
  {
    id: "lab-019",
    patient_id: "patient-002",
    test_name: "HbA1c",
    value: "7.8",
    unit: "%",
    normal_range: "<5.7",
    status: "abnormal",
    test_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: "Significant improvement needed",
    lab_file_id: null,
  },
  {
    id: "lab-020",
    patient_id: "patient-002",
    test_name: "Fasting Glucose",
    value: "145",
    unit: "mg/dL",
    normal_range: "70-100",
    status: "abnormal",
    test_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: "Started on metformin",
    lab_file_id: null,
  },
  {
    id: "lab-021",
    patient_id: "patient-002",
    test_name: "Cholesterol (Total)",
    value: "198",
    unit: "mg/dL",
    normal_range: "<200",
    status: "normal",
    test_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pdf_url: null,
    notes: null,
    lab_file_id: null,
  },
]

// Appointments (extended from existing)
interface Appointment {
  id: string
  patient_id: string
  patient_name: string
  scheduled_at: string
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show"
  type: string
  notes: string | null
  created_at: string
  doctor_id: string | null
  doctor_full_name: string | null
  clinic_id: string | null
  clinic_name: string | null
}

export const mockAppointments: Appointment[] = [
  {
    id: "apt-001",
    patient_id: "patient-001",
    patient_name: "Fatima Mohamed",
    scheduled_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: "confirmed",
    type: "Follow-up",
    notes: "Check blood pressure levels",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    doctor_id: DEMO_DOCTOR_ID,
    doctor_full_name: "Dr. Ahmed Hassan",
    clinic_id: DEMO_CLINIC_ID,
    clinic_name: "TabibDesk Wellness Center",
  },
  {
    id: "apt-002",
    patient_id: "patient-002",
    patient_name: "Ahmed Abdullah",
    scheduled_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    status: "scheduled",
    type: "Consultation",
    notes: "Initial consultation for back pain",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    doctor_id: DEMO_DOCTOR_ID,
    doctor_full_name: "Dr. Ahmed Hassan",
    clinic_id: DEMO_CLINIC_ID,
    clinic_name: "TabibDesk Wellness Center",
  },
  {
    id: "apt-003",
    patient_id: "patient-003",
    patient_name: "Layla Ibrahim",
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: "confirmed",
    type: "Check-up",
    notes: "Regular check-up appointment",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    doctor_id: DEMO_DOCTOR_ID,
    doctor_full_name: "Dr. Ahmed Hassan",
    clinic_id: DEMO_CLINIC_ID,
    clinic_name: "TabibDesk Wellness Center",
  },
  {
    id: "apt-004",
    patient_id: "patient-004",
    patient_name: "Omar Khalil",
    scheduled_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    status: "scheduled",
    type: "Follow-up",
    notes: "Review test results",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    doctor_id: DEMO_DOCTOR_ID,
    doctor_full_name: "Dr. Ahmed Hassan",
    clinic_id: DEMO_CLINIC_ID,
    clinic_name: "TabibDesk Wellness Center",
  },
  {
    id: "apt-005",
    patient_id: "patient-005",
    patient_name: "Nour Amin",
    scheduled_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    type: "Consultation",
    notes: "Discussed treatment plan",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    doctor_id: DEMO_DOCTOR_ID,
    doctor_full_name: "Dr. Ahmed Hassan",
    clinic_id: DEMO_CLINIC_ID,
    clinic_name: "TabibDesk Wellness Center",
  },
  {
    id: "apt-006",
    patient_id: "patient-001",
    patient_name: "Fatima Mohamed",
    scheduled_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    type: "Check-up",
    notes: "Annual health screening",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    doctor_id: DEMO_DOCTOR_ID,
    doctor_full_name: "Dr. Ahmed Hassan",
    clinic_id: DEMO_CLINIC_ID,
    clinic_name: "TabibDesk Wellness Center",
  },
  {
    id: "apt-007",
    patient_id: "patient-002",
    patient_name: "Ahmed Abdullah",
    scheduled_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    status: "scheduled",
    type: "Procedure",
    notes: "Physical therapy session",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    doctor_id: DEMO_DOCTOR_ID,
    doctor_full_name: "Dr. Ahmed Hassan",
    clinic_id: DEMO_CLINIC_ID,
    clinic_name: "TabibDesk Wellness Center",
  },
  {
    id: "apt-008",
    patient_id: "patient-003",
    patient_name: "Layla Ibrahim",
    scheduled_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: "no_show",
    type: "Follow-up",
    notes: "Patient did not attend",
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    doctor_id: DEMO_DOCTOR_ID,
    doctor_full_name: "Dr. Ahmed Hassan",
    clinic_id: DEMO_CLINIC_ID,
    clinic_name: "TabibDesk Wellness Center",
  },
]

// Urgent Alerts
interface UrgentAlert {
  id: string
  type: "question" | "lab"
  severity: "critical" | "warning" | "info"
  patient_id: string
  patient_name: string
  title: string
  message: string
  created_at: string
  is_reviewed: boolean
  // Type-specific fields
  lab_result_id?: string  // For type "lab"
  lab_test_name?: string  // For type "lab"
}

export const mockUrgentAlerts: UrgentAlert[] = [
  // Critical - patient question
  {
    id: "alert-001",
    type: "question",
    severity: "critical",
    patient_id: "patient-004",
    patient_name: "Omar Khalil",
    title: "Urgent: Severe Side Effects",
    message: "Patient reports severe chest pain and breathing difficulty",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    is_reviewed: false,
  },
  // Critical lab result
  {
    id: "alert-002",
    type: "lab",
    severity: "critical",
    patient_id: "patient-002",
    patient_name: "Ahmed Abdullah",
    title: "Abnormal HbA1c Result",
    message: "HbA1c level at 6.8% - above normal range",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    is_reviewed: false,
    lab_result_id: "lab-004",
    lab_test_name: "HbA1c",
  },
  // Warning - patient question
  {
    id: "alert-003",
    type: "question",
    severity: "warning",
    patient_id: "patient-001",
    patient_name: "Fatima Mohamed",
    title: "Patient Complaint: Dizziness",
    message: "Experiencing frequent dizziness after taking blood pressure medication",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    is_reviewed: false,
  },
  // Warning - lab result
  {
    id: "alert-004",
    type: "lab",
    severity: "warning",
    patient_id: "patient-001",
    patient_name: "Fatima Mohamed",
    title: "Borderline LDL Cholesterol",
    message: "LDL level at 115 mg/dL - slightly above recommended range",
    created_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    is_reviewed: false,
    lab_result_id: "lab-003",
    lab_test_name: "LDL",
  },
  // Info - patient question
  {
    id: "alert-005",
    type: "question",
    severity: "info",
    patient_id: "patient-003",
    patient_name: "Layla Ibrahim",
    title: "Question About Diet Plan",
    message: "Can I substitute quinoa with brown rice in my meal plan?",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    is_reviewed: false,
  },
  // Already reviewed (should not show in alerts)
  {
    id: "alert-006",
    type: "question",
    severity: "warning",
    patient_id: "patient-005",
    patient_name: "Nour Amin",
    title: "GERD Symptoms Worsening",
    message: "Experiencing increased heartburn despite medication",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    is_reviewed: true,
  },
]

// Export all mock data
// Transcriptions
export interface Transcription {
  id: string
  patient_id: string
  audio_url: string | null
  transcription_text: string
  duration_seconds: number
  created_at: string
  status: "processing" | "completed" | "failed"
}

export const mockTranscriptions: Transcription[] = [
  {
    id: "trans-001",
    patient_id: "patient-001",
    audio_url: null,
    transcription_text:
      "Patient presents with complaint of lower back pain for the past 3 days. Pain is localized to the lumbar region, worse with movement and relieved by rest. No radiation to legs. No history of trauma. Patient reports difficulty sleeping due to pain.\n\nOn examination: Tenderness in L4-L5 region, limited range of motion in flexion and extension. No neurological deficits. Straight leg raise test negative bilaterally.\n\nAssessment: Acute mechanical lower back pain, likely muscular strain.\n\nPlan: Prescribed NSAIDs (Ibuprofen 400mg TID for 5 days), muscle relaxant (Cyclobenzaprine 5mg at bedtime), advised rest and avoid heavy lifting. Physical therapy referral for core strengthening exercises. Follow-up in 1 week if symptoms persist.",
    duration_seconds: 125,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
  {
    id: "trans-002",
    patient_id: "patient-001",
    audio_url: null,
    transcription_text:
      "Follow-up visit for lower back pain. Patient reports significant improvement with prescribed treatment. Pain reduced from 8/10 to 3/10. Able to sleep better. Compliance with medications good.\n\nOn examination: Reduced tenderness in lumbar region, improved range of motion. Patient able to perform daily activities with minimal discomfort.\n\nPlan: Continue current medications for 3 more days, then switch to PRN basis. Continue physical therapy exercises. Advised to maintain good posture and avoid prolonged sitting. Return if symptoms worsen.",
    duration_seconds: 87,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
  {
    id: "trans-003",
    patient_id: "patient-002",
    audio_url: null,
    transcription_text:
      "New patient consultation. Chief complaint: Persistent headaches for 2 weeks, occurring 3-4 times per week, usually in the afternoon. Pain described as throbbing, bilateral frontal region, severity 6/10. Associated symptoms include mild nausea, sensitivity to bright lights. No visual disturbances. No fever or neck stiffness.\n\nPast medical history: Hypertension controlled on medication. No known allergies.\n\nAssessment: Tension-type headaches, possibly related to stress and screen time.\n\nPlan: Lifestyle modifications - regular breaks from screen, adequate hydration, stress management techniques. Prescribed Paracetamol 500mg as needed. Advised to keep headache diary. Follow-up in 2 weeks.",
    duration_seconds: 156,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
]

// Attachments
interface Attachment {
  id: string
  patient_id: string
  file_name: string
  file_type: string
  file_size: number
  file_url: string
  uploaded_at: string
  uploaded_by: string
}

export const mockAttachments: Attachment[] = [
  {
    id: "attach-001",
    patient_id: "patient-001",
    file_name: "Insurance Card.pdf",
    file_type: "application/pdf",
    file_size: 245760,
    file_url: "/attachments/insurance-card.pdf",
    uploaded_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    uploaded_by: "Dr. Ahmed Hassan",
  },
  {
    id: "attach-002",
    patient_id: "patient-001",
    file_name: "Medical History.docx",
    file_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    file_size: 89600,
    file_url: "/attachments/medical-history.docx",
    uploaded_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    uploaded_by: "Dr. Ahmed Hassan",
  },
  {
    id: "attach-003",
    patient_id: "patient-001",
    file_name: "X-Ray Report.jpg",
    file_type: "image/jpeg",
    file_size: 1536000,
    file_url: "/attachments/xray-report.jpg",
    uploaded_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    uploaded_by: "Dr. Ahmed Hassan",
  },
  {
    id: "attach-004",
    patient_id: "patient-001",
    file_name: "Blood Test Results.xlsx",
    file_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    file_size: 45120,
    file_url: "/attachments/blood-test.xlsx",
    uploaded_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    uploaded_by: "Dr. Ahmed Hassan",
  },
  {
    id: "attach-005",
    patient_id: "patient-002",
    file_name: "Prescription History.pdf",
    file_type: "application/pdf",
    file_size: 178240,
    file_url: "/attachments/prescription-history.pdf",
    uploaded_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    uploaded_by: "Dr. Ahmed Hassan",
  },
  {
    id: "attach-006",
    patient_id: "patient-002",
    file_name: "CT Scan.png",
    file_type: "image/png",
    file_size: 2048000,
    file_url: "/attachments/ct-scan.png",
    uploaded_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    uploaded_by: "Dr. Ahmed Hassan",
  },
]

export const mockData = {
  doctors: mockDoctors,
  patients: mockPatients,
  appointments: mockAppointments,
  weightLogs: mockWeightLogs,
  injections: mockInjections,
  medications: mockMedications,
  doctorNotes: mockDoctorNotes,
  tasks: mockTasks,
  patientDiets: mockPatientDiets,
  labFiles: mockLabFiles,
  labResults: mockLabResults,
  urgentAlerts: mockUrgentAlerts,
  transcriptions: mockTranscriptions,
  attachments: mockAttachments,
}
