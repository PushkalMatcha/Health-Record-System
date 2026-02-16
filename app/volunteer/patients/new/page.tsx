"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, User, MapPin, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { useAuth } from "@/hooks/use-auth"
import { APP_CONFIG } from "@/lib/config"

export default function VolunteerNewPatient() {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    phone: "",
    village: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalConcerns: "",
    referredBy: "Field Volunteer",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem(APP_CONFIG.AUTH.TOKEN_KEY)
      
      // Split name into first and last name with safe fallback
      const nameParts = formData.fullName.trim().split(/\s+/).filter(Boolean)
      const firstName = nameParts[0] || 'Patient'
      const rawLast = nameParts.slice(1).join(' ')
      const lastName = rawLast || 'Unknown'

      const toEmailPart = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '')
      const emailLocal = [toEmailPart(firstName), toEmailPart(lastName)].filter(Boolean).join('.') || 'patient'

      const patientData = {
        firstName,
        lastName,
        email: `${emailLocal}@patient.local`,
        password: 'defaultPassword123',
        dateOfBirth: new Date(new Date().getFullYear() - parseInt(formData.age), 0, 1).toISOString(),
        address: formData.address || `${formData.village}, Andhra Pradesh`,
        phone: formData.phone,
        emergencyContact: {
          name: formData.emergencyContact,
          phone: formData.emergencyPhone || formData.phone
        },
        medicalHistory: {
          gender: formData.gender,
          bloodGroup: 'Unknown',
          chronicConditions: [],
          allergies: [],
          priority: 'Medium',
          notes: formData.medicalConcerns,
          currentMedications: ''
        }
      }

      const response = await fetch(`${APP_CONFIG.API.BASE_URL}/api/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patientData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create patient')
      }

      // Redirect after success
      router.push("/volunteer/patients")
    } catch (err) {
      console.error('Error creating patient:', err)
      setError(err instanceof Error ? err.message : 'Failed to create patient')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Register New Patient</h1>
              <p className="text-gray-600">Add a new patient to the community health system</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>Enter the patient's personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter patient's full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Enter age"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Location Information</span>
              </CardTitle>
              <CardDescription>Patient's address and location details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="village">Village *</Label>
                <Select value={formData.village} onValueChange={(value) => handleInputChange("village", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select village" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarada-village">Sarada Village</SelectItem>
                    <SelectItem value="vallur">Vallur</SelectItem>
                    <SelectItem value="kothapalli">Kothapalli</SelectItem>
                    <SelectItem value="mandal">Mandal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter complete address"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Emergency Contact</span>
              </CardTitle>
              <CardDescription>Emergency contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="Enter emergency contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                    placeholder="Enter emergency contact phone"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Initial Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Initial Assessment</CardTitle>
              <CardDescription>Any immediate medical concerns or observations</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="medicalConcerns">Medical Concerns or Symptoms</Label>
                <Textarea
                  id="medicalConcerns"
                  value={formData.medicalConcerns}
                  onChange={(e) => handleInputChange("medicalConcerns", e.target.value)}
                  placeholder="Describe any medical concerns, symptoms, or observations..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link href="/volunteer">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registering...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Register Patient
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
