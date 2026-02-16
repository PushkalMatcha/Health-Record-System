export type PatientPriority = "High" | "Medium" | "Low"

export interface Patient {
  id: string
  name: string
  age: number
  gender: "Male" | "Female" | "Other"
  village: string
  phoneNumber: string
  bloodGroup: string
  lastVisit: string
  priority: PatientPriority
  chronicConditions: string[]
  allergies: string[]
  emergencyContact: string
  emergencyPhone: string
  registeredDate: string
  address: string
  notes: string
  currentMedications: string
}

export interface PatientRecord {
  id: string
  dateOfVisit: string
  recordType: string
  conditionTestName: string
  resultsVitals: string
  notesFollowUp?: string
  recordedBy: string
}

export const mockPatients: Patient[] = [
  {
    id: "P001",
    name: "Lakshmi Devi",
    age: 45,
    gender: "Female",
    village: "Sarada Village",
    phoneNumber: "+91 98765 43210",
    bloodGroup: "B+",
    lastVisit: "2024-01-15",
    priority: "Medium",
    chronicConditions: ["Diabetes", "Hypertension"],
    allergies: ["Penicillin", "Shellfish"],
    emergencyContact: "Ravi Devi",
    emergencyPhone: "+91 98765 43211",
    registeredDate: "2023-06-15",
    address: "123 Main Street, Sarada Village",
    notes: "Patient is compliant with medication. Regular follow-ups needed for diabetes management.",
    currentMedications: "Metformin 500mg twice daily",
  },
  {
    id: "P002",
    name: "Ravi Kumar",
    age: 32,
    gender: "Male",
    village: "Vallur",
    phoneNumber: "+91 98765 43211",
    bloodGroup: "O+",
    lastVisit: "2024-01-14",
    priority: "High",
  chronicConditions: ["Hypertension"],
  allergies: [],
    emergencyContact: "Priya Kumar",
    emergencyPhone: "+91 98765 43221",
    registeredDate: "2023-02-10",
    address: "45 River Road, Vallur",
    notes: "Monitor blood pressure weekly. Reports occasional dizziness.",
    currentMedications: "Amlodipine 5mg once daily",
  },
  {
    id: "P003",
    name: "Sunita Rao",
    age: 28,
    gender: "Female",
    village: "Sarada Village",
    phoneNumber: "+91 98765 43212",
    bloodGroup: "A+",
    lastVisit: "2024-01-13",
    priority: "High",
  chronicConditions: ["Prenatal Care"],
  allergies: [],
    emergencyContact: "Hari Rao",
    emergencyPhone: "+91 98765 43222",
    registeredDate: "2023-08-05",
    address: "78 Floral Street, Sarada Village",
    notes: "Currently in third trimester. Attending regular checkups.",
    currentMedications: "Prenatal vitamins",
  },
  {
    id: "P004",
    name: "Mohan Reddy",
    age: 55,
    gender: "Male",
    village: "Kothapalli",
    phoneNumber: "+91 98765 43213",
    bloodGroup: "AB+",
    lastVisit: "2024-01-12",
    priority: "Low",
  chronicConditions: ["Arthritis"],
  allergies: [],
    emergencyContact: "Sita Reddy",
    emergencyPhone: "+91 98765 43223",
    registeredDate: "2022-11-20",
    address: "12 Hill View, Kothapalli",
    notes: "Joint stiffness increases in mornings. Encouraged physical therapy exercises.",
    currentMedications: "Ibuprofen 400mg as needed",
  },
  {
    id: "P005",
    name: "Priya Sharma",
    age: 35,
    gender: "Female",
    village: "Mandal",
    phoneNumber: "+91 98765 43214",
    bloodGroup: "B-",
    lastVisit: "2024-01-11",
    priority: "Medium",
  chronicConditions: ["Migraine"],
  allergies: [],
    emergencyContact: "Anil Sharma",
    emergencyPhone: "+91 98765 43224",
    registeredDate: "2023-04-18",
    address: "5 Market Lane, Mandal",
    notes: "Migraines triggered by stress. Advised lifestyle adjustments.",
    currentMedications: "Sumatriptan 50mg when required",
  },
]

export const mockPatientRecords: Record<string, PatientRecord[]> = {
  P001: [
    {
      id: "R001",
      dateOfVisit: "2024-01-15",
      recordType: "General Checkup",
      conditionTestName: "Blood Pressure",
      resultsVitals: "140/90 mmHg",
      notesFollowUp:
        "Advised dietary changes and regular monitoring. Patient should reduce salt intake and increase physical activity.",
      recordedBy: "Dr. Priya Sharma",
    },
    {
      id: "R002",
      dateOfVisit: "2024-01-15",
      recordType: "Blood Test",
      conditionTestName: "HIV Screening",
      resultsVitals: "Negative",
      notesFollowUp: "Pre-test counseling provided. Patient educated about prevention methods.",
      recordedBy: "Dr. Priya Sharma",
    },
    {
      id: "R003",
      dateOfVisit: "2023-12-20",
      recordType: "Blood Test",
      conditionTestName: "Random Blood Sugar",
      resultsVitals: "160 mg/dL",
      notesFollowUp:
        "High reading detected. Follow-up required for fasting blood sugar test. Patient advised to avoid sugary foods.",
      recordedBy: "Nurse Kavitha",
    },
    {
      id: "R004",
      dateOfVisit: "2023-11-10",
      recordType: "Vaccination",
      conditionTestName: "COVID-19 Booster",
      resultsVitals: "Administered successfully",
      notesFollowUp:
        "No immediate adverse reactions observed. Patient advised to monitor for any side effects for 24 hours.",
      recordedBy: "Volunteer Ravi",
    },
  ],
  P002: [
    {
      id: "R101",
      dateOfVisit: "2024-01-14",
      recordType: "General Checkup",
      conditionTestName: "Blood Pressure",
      resultsVitals: "150/95 mmHg",
      notesFollowUp: "Medication dosage adjusted. Follow-up scheduled in two weeks.",
      recordedBy: "Dr. Rajesh Kumar",
    },
  ],
  P003: [
    {
      id: "R201",
      dateOfVisit: "2024-01-13",
      recordType: "Prenatal Checkup",
      conditionTestName: "Ultrasound",
      resultsVitals: "Healthy fetal development",
      notesFollowUp: "Continue prenatal vitamins and weekly monitoring.",
      recordedBy: "Dr. Anitha Rao",
    },
  ],
  P004: [
    {
      id: "R301",
      dateOfVisit: "2024-01-12",
      recordType: "Orthopedic Checkup",
      conditionTestName: "Joint Mobility",
      resultsVitals: "Reduced mobility in knees",
      notesFollowUp: "Physical therapy recommended. Review in one month.",
      recordedBy: "Dr. Suresh Babu",
    },
  ],
  P005: [
    {
      id: "R401",
      dateOfVisit: "2024-01-11",
      recordType: "Neurology Consultation",
      conditionTestName: "Migraine Assessment",
      resultsVitals: "Stress-related triggers identified",
      notesFollowUp: "Advised stress management techniques and regular sleep schedule.",
      recordedBy: "Dr. Kavitha Reddy",
    },
  ],
}

export function getPatientById(id: string): Patient | undefined {
  return mockPatients.find((patient) => patient.id.toLowerCase() === id.toLowerCase())
}

export function getPatientRecords(id: string): PatientRecord[] {
  return mockPatientRecords[id] ?? []
}
