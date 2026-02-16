"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/hooks/use-auth"
import { APP_CONFIG } from "@/lib/config"

const villages = ["Sarada Village", "Vallur", "Kothapalli", "Mandal", "Other"]
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const commonConditions = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Asthma",
  "Arthritis",
  "Migraine",
  "Thyroid",
  "Kidney Disease",
]

export default function NewPatientPage() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    village: "",
    customVillage: "",
    phoneNumber: "",
    emergencyContact: "",
    bloodGroup: "",
    allergies: "",
    chronicConditions: [] as string[],
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const { user } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleConditionChange = (condition: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      chronicConditions: checked
        ? [...prev.chronicConditions, condition]
        : prev.chronicConditions.filter((c) => c !== condition),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      console.log('Form data validation:', {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        emergencyContact: formData.emergencyContact,
        village: formData.village,
        customVillage: formData.customVillage
      })

      if (!formData.name || !formData.age || !formData.gender || !formData.phoneNumber || !formData.emergencyContact) {
        alert('Please fill in all required fields (Name, Age, Gender, Phone Number, Emergency Contact)')
        setIsLoading(false)
        return
      }

      // Check if village is selected
      if (!formData.village && !formData.customVillage) {
        alert('Please select a village or enter a custom village name')
        setIsLoading(false)
        return
      }

      const token = localStorage.getItem(APP_CONFIG.AUTH.TOKEN_KEY)
      if (!token) {
        alert('Please log in to create a patient')
        setIsLoading(false)
        return
      }
      
      // Split name into first and last name with safe fallback
      const nameParts = formData.name.trim().split(/\s+/).filter(Boolean)
      const firstName = nameParts[0] || 'Patient'
      const rawLast = nameParts.slice(1).join(' ')
      const lastName = rawLast || 'Unknown'

      // Validate age
      const age = parseInt(formData.age)
      if (isNaN(age) || age < 0 || age > 120) {
        alert('Please enter a valid age between 0 and 120')
        setIsLoading(false)
        return
      }

      const village = formData.village || formData.customVillage || 'Unknown'
      const address = `${village}, Andhra Pradesh`

      const toEmailPart = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '')
      const emailLocal = [toEmailPart(firstName), toEmailPart(lastName)].filter(Boolean).join('.') || 'patient'

      const patientData = {
        firstName,
        lastName,
        email: `${emailLocal}@patient.local`, // Generate safe email without trailing dots
        password: 'defaultPassword123', // Default password
        dateOfBirth: new Date(new Date().getFullYear() - age, 0, 1).toISOString(),
        address: address,
        phone: formData.phoneNumber,
        emergencyContact: {
          name: formData.emergencyContact,
          phone: formData.phoneNumber
        },
        medicalHistory: {
          gender: formData.gender,
          bloodGroup: formData.bloodGroup || 'Unknown',
          chronicConditions: formData.chronicConditions,
          allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a),
          priority: 'Medium',
          notes: formData.notes,
          currentMedications: ''
        }
      }

      // Final validation
      if (!patientData.firstName || !patientData.lastName || !patientData.address || !patientData.phone) {
        console.error('Invalid patient data:', patientData)
        alert('Invalid patient data. Please check all fields.')
        setIsLoading(false)
        return
      }

      console.log('Sending patient data:', patientData)
      console.log('API URL:', `${APP_CONFIG.API.BASE_URL}/api/patients`)

      // Test if backend is reachable
      try {
        const testResponse = await fetch(`${APP_CONFIG.API.BASE_URL}/api/admin/stats`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        console.log('Backend test response status:', testResponse.status)
      } catch (testError) {
        console.error('Backend not reachable:', testError)
        alert('Backend server is not running. Please start the backend server.')
        setIsLoading(false)
        return
      }

      const response = await fetch(`${APP_CONFIG.API.BASE_URL}/api/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patientData)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error Response:', errorData)
        console.error('Response Status:', response.status)
        throw new Error(errorData.message || `Failed to create patient (Status: ${response.status})`)
      }

      setSuccess(true)
      
      // Redirect after success
      setTimeout(() => {
        router.push("/patients")
      }, 2000)
    } catch (error) {
      console.error('Error creating patient:', error)
      alert('Failed to create patient. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="flex items-center justify-center pt-20">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Registered Successfully!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {formData.name} has been added to the health record system.
                </p>
                <p className="text-xs text-gray-500">Redirecting to patient list...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
  <Navbar user={user} />

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">New Patient Registration</h1>
                <p className="text-xs text-gray-600">SVDS Health Record System</p>
              </div>
            </div>
            <Link href="/patients">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patients
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the patient's personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter patient's full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="Enter age"
                      min="0"
                      max="120"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) => handleInputChange("bloodGroup", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Location and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="village">Village *</Label>
                    <Select value={formData.village} onValueChange={(value) => handleInputChange("village", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select village" />
                      </SelectTrigger>
                      <SelectContent>
                        {villages.map((village) => (
                          <SelectItem key={village} value={village}>
                            {village}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.village === "Other" && (
                    <div className="space-y-2">
                      <Label htmlFor="customVillage">Specify Village *</Label>
                      <Input
                        id="customVillage"
                        value={formData.customVillage}
                        onChange={(e) => handleInputChange("customVillage", e.target.value)}
                        placeholder="Enter village name"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      type="tel"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
                <CardDescription>Health conditions and medical history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="allergies">Known Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                    placeholder="List any known allergies (medications, food, environmental)"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Chronic Conditions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {commonConditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={formData.chronicConditions.includes(condition)}
                          onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                        />
                        <Label htmlFor={condition} className="text-sm font-normal">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Any additional medical history or notes"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/patients">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
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
          </div>
        </form>
      </div>
    </div>
  )
}
