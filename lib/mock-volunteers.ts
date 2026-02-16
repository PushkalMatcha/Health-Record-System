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

export const mockVolunteers: Volunteer[] = [
  {
    id: "V001",
    name: "Priya Sharma",
    email: "priya@svds.org",
    phone: "+91 98765 43210",
    village: "Sarada Village",
    specialization: "General Health",
    status: "ACTIVE",
    dateOfBirth: "1985-03-15",
    address: "123 Main Street, Sarada Village",
    emergencyContact: "Rajesh Sharma",
    createdAt: "2023-01-15"
  },
  {
    id: "V002",
    name: "Rajesh Kumar",
    email: "rajesh@svds.org",
    phone: "+91 98765 43211",
    village: "Vallur",
    specialization: "Emergency Care",
    status: "ACTIVE",
    dateOfBirth: "1980-07-22",
    address: "45 River Road, Vallur",
    emergencyContact: "Sunita Kumar",
    createdAt: "2023-02-10"
  },
  {
    id: "V003",
    name: "Anitha Rao",
    email: "anitha@svds.org",
    phone: "+91 98765 43212",
    village: "Kothapalli",
    specialization: "Maternal Health",
    status: "ACTIVE",
    dateOfBirth: "1990-11-08",
    address: "78 Hill View, Kothapalli",
    emergencyContact: "Hari Rao",
    createdAt: "2023-03-05"
  },
  {
    id: "V004",
    name: "Suresh Babu",
    email: "suresh@svds.org",
    phone: "+91 98765 43213",
    village: "Mandal",
    specialization: "Chronic Care",
    status: "INACTIVE",
    dateOfBirth: "1975-12-03",
    address: "12 Market Lane, Mandal",
    emergencyContact: "Lakshmi Babu",
    createdAt: "2023-01-20"
  }
]

export function getVolunteerById(id: string): Volunteer | undefined {
  return mockVolunteers.find((volunteer) => volunteer.id.toLowerCase() === id.toLowerCase())
}

export function getVolunteersByVillage(village: string): Volunteer[] {
  return mockVolunteers.filter((volunteer) => volunteer.village === village)
}

export function getActiveVolunteers(): Volunteer[] {
  return mockVolunteers.filter((volunteer) => volunteer.status === "ACTIVE")
}