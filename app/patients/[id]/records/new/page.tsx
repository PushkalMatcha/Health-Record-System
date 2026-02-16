"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"

const recordTypes = ["General Checkup", "Blood Test", "Vaccination", "Counseling Session", "Specialist Referral"]

export default function NewRecordPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    dateOfVisit: new Date().toISOString().split("T")[0], // Default to current date
    recordType: "",
    conditionTestName: "",
    resultsVitals: "",
    notesFollowUp: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const mockUser = {
    name: "Dr. Admin",
    role: "Admin",
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock API call - replace with real API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSuccess(true)
    setIsLoading(false)

    // Redirect after success
    setTimeout(() => {
      router.push(`/patients/${params.id}`)
    }, 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Health Record Added Successfully!</h3>
              <p className="text-sm text-gray-600 mb-4">The new health record has been saved to the patient's file.</p>
              <p className="text-xs text-gray-500">Redirecting to patient details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={mockUser} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">New Health Record</h1>
                <p className="text-xs text-gray-600">Patient ID: {params.id}</p>
              </div>
            </div>
            <Link href={`/patients/${params.id}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patient
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Health Record Details</CardTitle>
                <CardDescription>Add a new health record entry for this patient</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfVisit">Date of Visit *</Label>
                    <Input
                      id="dateOfVisit"
                      type="date"
                      value={formData.dateOfVisit}
                      onChange={(e) => handleInputChange("dateOfVisit", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recordType">Record Type *</Label>
                    <Select
                      value={formData.recordType}
                      onValueChange={(value) => handleInputChange("recordType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select record type" />
                      </SelectTrigger>
                      <SelectContent>
                        {recordTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conditionTestName">Condition / Test Name *</Label>
                  <Input
                    id="conditionTestName"
                    value={formData.conditionTestName}
                    onChange={(e) => handleInputChange("conditionTestName", e.target.value)}
                    placeholder="e.g., Blood Pressure, Diabetes Screening, COVID-19 Test, HIV Test"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Examples: Blood Pressure, Diabetes Screening, COVID-19 Test, HIV Test, Malnutrition Assessment, Skin
                    Infection
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resultsVitals">Results / Vitals</Label>
                  <Input
                    id="resultsVitals"
                    value={formData.resultsVitals}
                    onChange={(e) => handleInputChange("resultsVitals", e.target.value)}
                    placeholder="e.g., 120/80 mmHg, 140 mg/dL, Positive, Negative, Follow-up required"
                  />
                  <p className="text-xs text-gray-500">
                    Examples: "120/80 mmHg", "140 mg/dL", "Positive", "Negative", "Follow-up required"
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notesFollowUp">Notes / Follow-Up Actions</Label>
                  <Textarea
                    id="notesFollowUp"
                    value={formData.notesFollowUp}
                    onChange={(e) => handleInputChange("notesFollowUp", e.target.value)}
                    placeholder="Important context, advice given to patient, or next steps..."
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">
                    Example: "Patient advised to reduce salt intake and return for a follow-up check in 3 months.
                    Referred to district hospital for further tests."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href={`/patients/${params.id}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Record
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
