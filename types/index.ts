// Centralized type definitions for the application

export interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "VOLUNTEER" | "PATIENT"
  village?: string
  permissions?: Permission[]
  createdAt: Date
}

export interface Permission {
  resource: string
  actions: ("create" | "read" | "update" | "delete")[]
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: "Male" | "Female" | "Other"
  village: string
  phoneNumber: string
  bloodGroup: string
  lastVisit: string
  priority: "High" | "Medium" | "Low"
  chronicConditions: string[]
  allergies: string[]
  emergencyContact: string
  emergencyPhone: string
  registeredDate: string
  address: string
  notes: string
  currentMedications: string
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

export interface Volunteer {
  id: string
  name: string
  email: string
  phone: string
  village: string
  specialization: string
  status: "ACTIVE" | "INACTIVE" | "PENDING"
  dateOfBirth?: string
  address?: string
  emergencyContact?: string
  createdAt: string
}

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

export interface Visit {
  id: string
  volunteerId: string
  patientId: string
  scheduledFor: Date
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "MISSED"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Type guards
export function isAdmin(user: User): boolean {
  return user.role === "ADMIN"
}

export function isVolunteer(user: User): boolean {
  return user.role === "VOLUNTEER"
}

export function isPatient(user: User): boolean {
  return user.role === "PATIENT"
}
