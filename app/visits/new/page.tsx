"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, User } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertSystem } from "@/components/alert-system"
import Navbar from "@/components/navbar"

export default function RecordVisit() {
  const [user, setUser] = useState<{ name: string; role: string; village: string } | null>(null)
  const [selectedPatient, setSelectedPatient] = useState("")
  const [visitData, setVisitData] = useState({
    date: new Date().toISOString().split("T")[0],
    visitType: "",
    symptoms: "",
    vitals: {
      bloodPressure: "",
      temperature: "",
      heartRate: "",
      weight: "",
    },
    diagnosis: "",
    treatment: "",
    medications: "",
    followUpDate: "",
    notes: "",
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get("patient")

  useEffect(() => {
    // Mock authentication check
    const mockUser = { name: "Volunteer Priya", role: "Field Volunteer", village: "Sarada Village" }
    setUser(mockUser)

    if (patientId) {
      setSelectedPatient(patientId)
    }
  }, [patientId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the visit data
    console.log("Visit recorded:", { patient: selectedPatient, ...visitData })
    router.push("/volunteer")
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AlertSystem />
      <Navbar user={user} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Record Patient Visit</h1>
          <p className="text-gray-600">Document patient visit details and health records</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="patient">Select Patient</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P001">Lakshmi Devi - Sarada Village</SelectItem>
                    <SelectItem value="P002">Ravi Kumar - Vallur</SelectItem>
                    <SelectItem value="P003">Sunita Rao - Sarada Village</SelectItem>
                    <SelectItem value="P004">Mohan Reddy - Kothapalli</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Visit Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={visitData.date}
                    onChange={(e) => setVisitData({ ...visitData, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="visitType">Visit Type</Label>
                  <Select
                    value={visitData.visitType}
                    onValueChange={(value) => setVisitData({ ...visitData, visitType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine Checkup</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="screening">Health Screening</SelectItem>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Symptoms and Vitals */}
          <Card>
            <CardHeader>
              <CardTitle>Clinical Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="symptoms">Symptoms/Complaints</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe patient's symptoms or complaints..."
                  value={visitData.symptoms}
                  onChange={(e) => setVisitData({ ...visitData, symptoms: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="bp">Blood Pressure</Label>
                  <Input
                    id="bp"
                    placeholder="120/80"
                    value={visitData.vitals.bloodPressure}
                    onChange={(e) =>
                      setVisitData({
                        ...visitData,
                        vitals: { ...visitData.vitals, bloodPressure: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="temp">Temperature (°F)</Label>
                  <Input
                    id="temp"
                    placeholder="98.6"
                    value={visitData.vitals.temperature}
                    onChange={(e) =>
                      setVisitData({
                        ...visitData,
                        vitals: { ...visitData.vitals, temperature: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="hr">Heart Rate</Label>
                  <Input
                    id="hr"
                    placeholder="72"
                    value={visitData.vitals.heartRate}
                    onChange={(e) =>
                      setVisitData({
                        ...visitData,
                        vitals: { ...visitData.vitals, heartRate: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    placeholder="65"
                    value={visitData.vitals.weight}
                    onChange={(e) =>
                      setVisitData({
                        ...visitData,
                        vitals: { ...visitData.vitals, weight: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diagnosis and Treatment */}
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis & Treatment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="diagnosis">Diagnosis/Assessment</Label>
                <Textarea
                  id="diagnosis"
                  placeholder="Clinical diagnosis or assessment..."
                  value={visitData.diagnosis}
                  onChange={(e) => setVisitData({ ...visitData, diagnosis: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="treatment">Treatment Provided</Label>
                <Textarea
                  id="treatment"
                  placeholder="Treatment or interventions provided..."
                  value={visitData.treatment}
                  onChange={(e) => setVisitData({ ...visitData, treatment: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="medications">Medications Prescribed</Label>
                <Textarea
                  id="medications"
                  placeholder="List medications with dosage and instructions..."
                  value={visitData.medications}
                  onChange={(e) => setVisitData({ ...visitData, medications: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Follow-up and Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Follow-up & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="followup">Next Follow-up Date</Label>
                <Input
                  id="followup"
                  type="date"
                  value={visitData.followUpDate}
                  onChange={(e) => setVisitData({ ...visitData, followUpDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional observations or notes..."
                  value={visitData.notes}
                  onChange={(e) => setVisitData({ ...visitData, notes: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/volunteer">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Record Visit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
