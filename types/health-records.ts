export interface Patient {
  id: string
  name: string
  age: number
  gender: "Male" | "Female" | "Other"
  village: string
  phoneNumber?: string
  emergencyContact?: string
  bloodGroup?: string
  allergies?: string[]
  chronicConditions?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface HealthRecord {
  id: string
  patientId: string
  date: Date
  visitType: "Checkup" | "Emergency" | "Follow-up" | "Vaccination" | "Screening"
  symptoms?: string[]
  diagnosis?: string
  treatment?: string
  medications?: Medication[]
  vitals?: VitalSigns
  notes?: string
  followUpDate?: Date
  recordedBy: string
  createdAt: Date
}

export interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}

export interface VitalSigns {
  bloodPressure?: string
  heartRate?: number
  temperature?: number
  weight?: number
  height?: number
  oxygenSaturation?: number
}

// User and Permission interfaces moved to types/index.ts

export interface Village {
  id: string
  name: string
  district: string
  population: number
  coordinates?: {
    latitude: number
    longitude: number
  }
}
