"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Phone, AlertTriangle, MapPin, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { AlertSystem } from "@/components/alert-system"
import Navbar from "@/components/navbar"

const emergencyContacts = [
  { name: "Dr. Rajesh Kumar", role: "Chief Medical Officer", phone: "+91 98765 00001" },
  { name: "Dr. Priya Sharma", role: "Emergency Coordinator", phone: "+91 98765 00002" },
  { name: "Ambulance Service", role: "Emergency Transport", phone: "108" },
  { name: "District Hospital", role: "Nearest Hospital", phone: "+91 98765 00003" },
]

export default function EmergencyPage() {
  const [user, setUser] = useState<{ name: string; role: string; village: string } | null>(null)
  const router = useRouter()
  const [emergencyData, setEmergencyData] = useState({
    patientName: "",
    location: "",
    emergencyType: "",
    description: "",
    contactNumber: "",
  })

  useEffect(() => {
    // Mock authentication check
    const mockUser = { name: "Volunteer Priya", role: "Field Volunteer", village: "Sarada Village" }
    setUser(mockUser)
  }, [])

  const handleEmergencyCall = (phone: string) => {
    window.open(`tel:${phone}`)
  }

  const handleSubmitEmergency = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send emergency alert
    console.log("Emergency reported:", emergencyData)
    alert("Emergency alert sent to medical team!")
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
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Emergency Response</h1>
              <p className="text-gray-600">Report medical emergencies and access emergency contacts</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Contacts */}
          <Card className="border-red-200">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-800 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Emergency Contacts
              </CardTitle>
              <CardDescription className="text-red-600">Quick access to medical emergency contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.role}</p>
                    <p className="text-sm text-blue-600 font-mono">{contact.phone}</p>
                  </div>
                  <Button
                    onClick={() => handleEmergencyCall(contact.phone)}
                    className="bg-red-600 hover:bg-red-700"
                    size="sm"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Report Emergency */}
          <Card className="border-orange-200">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-orange-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Report Emergency
              </CardTitle>
              <CardDescription className="text-orange-600">Send emergency alert to medical team</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmitEmergency} className="space-y-4">
                <div>
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    placeholder="Enter patient name"
                    value={emergencyData.patientName}
                    onChange={(e) => setEmergencyData({ ...emergencyData, patientName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="Exact location or address"
                      value={emergencyData.location}
                      onChange={(e) => setEmergencyData({ ...emergencyData, location: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="emergencyType">Emergency Type</Label>
                  <Select
                    value={emergencyData.emergencyType}
                    onValueChange={(value) => setEmergencyData({ ...emergencyData, emergencyType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select emergency type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiac">Cardiac Emergency</SelectItem>
                      <SelectItem value="respiratory">Breathing Difficulty</SelectItem>
                      <SelectItem value="trauma">Injury/Trauma</SelectItem>
                      <SelectItem value="stroke">Stroke Symptoms</SelectItem>
                      <SelectItem value="diabetic">Diabetic Emergency</SelectItem>
                      <SelectItem value="obstetric">Pregnancy Emergency</SelectItem>
                      <SelectItem value="other">Other Medical Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the emergency situation, symptoms, and current condition..."
                    value={emergencyData.description}
                    onChange={(e) => setEmergencyData({ ...emergencyData, description: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contactNumber">Your Contact Number</Label>
                  <Input
                    id="contactNumber"
                    placeholder="Your phone number for callback"
                    value={emergencyData.contactNumber}
                    onChange={(e) => setEmergencyData({ ...emergencyData, contactNumber: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Send Emergency Alert
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Emergency Response Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Immediate Actions:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ensure patient safety and your own safety</li>
                  <li>• Call emergency contacts immediately</li>
                  <li>• Provide basic first aid if trained</li>
                  <li>• Stay with the patient until help arrives</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Information to Provide:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Patient's name and age</li>
                  <li>• Exact location with landmarks</li>
                  <li>• Nature of emergency</li>
                  <li>• Current condition and symptoms</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
