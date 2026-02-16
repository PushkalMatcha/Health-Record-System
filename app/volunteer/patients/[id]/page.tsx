"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Phone, Calendar, Activity, AlertTriangle, Heart, FileText } from "lucide-react"
import Link from "next/link"
import { AlertSystem } from "@/components/alert-system"
import Navbar from "@/components/navbar"

// Mock patient data
const patientData = {
  P001: {
    id: "P001",
    name: "Lakshmi Devi",
    age: 45,
    gender: "Female",
    village: "Sarada Village",
    phone: "+91 98765 43210",
    emergencyContact: "+91 98765 43211",
    registered: "6/15/2023",
    lastVisit: "2024-01-15",
    nextVisit: "2024-01-22",
    conditions: ["Diabetes", "Hypertension"],
    allergies: ["Penicillin", "Shellfish"],
    currentMedications: ["Metformin 500mg", "Lisinopril 10mg"],
    notes: "Patient is compliant with medication. Regular follow-ups needed for diabetes management.",
    vitals: {
      bloodPressure: "140/90",
      bloodSugar: "180 mg/dL",
      weight: "65 kg",
      temperature: "98.6°F",
    },
    recentVisits: [
      {
        date: "2024-01-15",
        type: "Follow-up",
        notes: "Blood sugar levels improving. Continue current medication.",
        volunteer: "Volunteer Priya",
      },
      {
        date: "2024-01-08",
        type: "Regular Checkup",
        notes: "Patient reports feeling better. No new symptoms.",
        volunteer: "Volunteer Priya",
      },
    ],
  },
  P002: {
    id: "P002",
    name: "Ravi Kumar",
    age: 32,
    gender: "Male",
    village: "Vallur",
    phone: "+91 98765 43211",
    emergencyContact: "+91 98765 43212",
    registered: "7/20/2023",
    lastVisit: "2024-01-14",
    nextVisit: "2024-01-21",
    conditions: ["Hypertension"],
    allergies: ["Aspirin"],
    currentMedications: ["Amlodipine 5mg", "Atenolol 25mg"],
    notes: "Young patient with early-onset hypertension. Lifestyle modifications recommended.",
    vitals: {
      bloodPressure: "150/95",
      bloodSugar: "110 mg/dL",
      weight: "72 kg",
      temperature: "98.4°F",
    },
    recentVisits: [
      {
        date: "2024-01-14",
        type: "Follow-up",
        notes: "Blood pressure still elevated. Medication adjustment needed.",
        volunteer: "Volunteer Priya",
      },
      {
        date: "2024-01-07",
        type: "Regular Checkup",
        notes: "Patient reports occasional headaches. BP monitoring required.",
        volunteer: "Volunteer Priya",
      },
    ],
  },
  P003: {
    id: "P003",
    name: "Sunita Rao",
    age: 28,
    gender: "Female",
    village: "Sarada Village",
    phone: "+91 98765 43212",
    emergencyContact: "+91 98765 43213",
    registered: "8/10/2023",
    lastVisit: "2024-01-13",
    nextVisit: "2024-01-20",
    conditions: ["Prenatal Care"],
    allergies: ["None known"],
    currentMedications: ["Folic Acid 5mg", "Iron Tablets"],
    notes: "Second trimester pregnancy. Regular prenatal checkups scheduled.",
    vitals: {
      bloodPressure: "120/80",
      bloodSugar: "95 mg/dL",
      weight: "58 kg",
      temperature: "98.2°F",
    },
    recentVisits: [
      {
        date: "2024-01-13",
        type: "Prenatal Checkup",
        notes: "Baby development normal. Mother feeling well.",
        volunteer: "Volunteer Priya",
      },
      {
        date: "2024-01-06",
        type: "Prenatal Checkup",
        notes: "All vitals normal. Nutritional counseling provided.",
        volunteer: "Volunteer Priya",
      },
    ],
  },
  P004: {
    id: "P004",
    name: "Mohan Reddy",
    age: 55,
    gender: "Male",
    village: "Kothapalli",
    phone: "+91 98765 43213",
    emergencyContact: "+91 98765 43214",
    registered: "9/5/2023",
    lastVisit: "2024-01-12",
    nextVisit: "2024-01-19",
    conditions: ["General Health Monitoring"],
    allergies: ["None known"],
    currentMedications: ["Multivitamin"],
    notes: "Regular health checkups for preventive care. Overall health good.",
    vitals: {
      bloodPressure: "130/85",
      bloodSugar: "105 mg/dL",
      weight: "68 kg",
      temperature: "98.6°F",
    },
    recentVisits: [
      {
        date: "2024-01-12",
        type: "General Checkup",
        notes: "All parameters within normal range. Continue preventive care.",
        volunteer: "Volunteer Priya",
      },
      {
        date: "2024-01-05",
        type: "General Checkup",
        notes: "Patient reports good energy levels. No complaints.",
        volunteer: "Volunteer Priya",
      },
    ],
  },
}

export default function VolunteerPatientRecord({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<{ name: string; role: string; village: string } | null>(null)
  const [patient, setPatient] = useState<any>(null)

  useEffect(() => {
    // Mock authentication check
    const mockUser = { name: "Volunteer Priya", role: "Field Volunteer", village: "Sarada Village" }
    setUser(mockUser)

    // Get patient data
    const patientInfo = patientData[params.id as keyof typeof patientData]
    setPatient(patientInfo)
  }, [params.id])

  if (!user || !patient) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AlertSystem />
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/volunteer/patients">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patients
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-gray-600">
                Patient ID: {patient.id} • {patient.age} years • {patient.gender}
              </p>
            </div>
          </div>
          <Link href={`/visits/new?patient=${patient.id}`}>
            <Button className="bg-green-600 hover:bg-green-700">Record New Visit</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{patient.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Emergency Contact</p>
                  <p className="font-medium">{patient.emergencyContact}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Village</p>
                  <p className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {patient.village}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Registered</p>
                  <p className="font-medium">{patient.registered}</p>
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Medical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Chronic Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.conditions.map((condition: string) => (
                      <Badge key={condition} variant="secondary">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Known Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy: string) => (
                      <Badge key={allergy} variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Medications</p>
                  <ul className="space-y-1">
                    {patient.currentMedications.map((medication: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {medication}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{patient.notes}</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Visits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Recent Visits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patient.recentVisits.map((visit: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{visit.type}</p>
                        <p className="text-xs text-gray-500">{visit.date}</p>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{visit.notes}</p>
                      <p className="text-xs text-gray-500">Recorded by: {visit.volunteer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Visit Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Visit Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Last Visit</p>
                  <p className="font-medium">{patient.lastVisit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Visit</p>
                  <p className="font-medium text-blue-600">{patient.nextVisit}</p>
                </div>
              </CardContent>
            </Card>

            {/* Latest Vitals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Latest Vitals
                </CardTitle>
                <CardDescription>From last visit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Blood Pressure</p>
                    <p className="font-medium text-sm">{patient.vitals.bloodPressure}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Blood Sugar</p>
                    <p className="font-medium text-sm">{patient.vitals.bloodSugar}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Weight</p>
                    <p className="font-medium text-sm">{patient.vitals.weight}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Temperature</p>
                    <p className="font-medium text-sm">{patient.vitals.temperature}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/visits/new?patient=${patient.id}`}>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Record Visit</Button>
                </Link>
                <Link href={`/emergency?patient=${patient.id}`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Report Emergency
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
