"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/hooks/use-auth"
import { ArrowLeft, Save, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { APP_CONFIG } from "@/lib/config"

export default function EditVolunteerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()

  const [volunteer, setVolunteer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    village: '',
    specialization: '',
    status: 'ACTIVE',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Fetch volunteer data
  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`${APP_CONFIG.API.BASE_URL}/api/volunteers/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch volunteer')
        }
        
        const data = await response.json()
        setVolunteer(data.volunteer)
      } catch (err) {
        console.error('Error fetching volunteer:', err)
        setError('Failed to load volunteer data')
      } finally {
        setLoading(false)
      }
    }

    fetchVolunteer()
  }, [params.id])

  // Initialize form data when volunteer is loaded
  useEffect(() => {
    if (volunteer) {
      const [firstName, ...lastNameParts] = (volunteer.name || '').split(' ')
      setFormData({
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        email: volunteer.email || '',
        phone: volunteer.phone || '',
        village: volunteer.village || '',
        specialization: volunteer.specialization || '',
        status: volunteer.status || 'ACTIVE',
        dateOfBirth: volunteer.dateOfBirth ? new Date(volunteer.dateOfBirth).toISOString().split('T')[0] : '',
        address: volunteer.address || '',
        emergencyContact: volunteer.emergencyContact || '',
      })
    }
  }, [volunteer])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading volunteer data...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !volunteer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Not Found</CardTitle>
              <CardDescription>
                {error || `We could not find a volunteer with ID ${params.id}. Please return to the volunteer list and try again.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Link href="/volunteers">
                <Button variant="outline">Back to Volunteers</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email) {
        throw new Error('First name, last name, and email are required')
      }

      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        village: formData.village,
        specialization: formData.specialization,
        status: formData.status,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
      }

      console.log('Updating volunteer with data:', updateData)
      console.log('API URL:', `${APP_CONFIG.API.BASE_URL}/api/volunteers/${params.id}`)
      
      const token = localStorage.getItem(APP_CONFIG.AUTH.TOKEN_KEY)
      console.log('Auth token:', token ? `${token.substring(0, 20)}...` : 'No token found')
      
      const response = await fetch(`${APP_CONFIG.API.BASE_URL}/api/volunteers/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(APP_CONFIG.AUTH.TOKEN_KEY)}`,
        },
        body: JSON.stringify(updateData),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.message || errorData.error || 'Failed to update volunteer')
      }

      setSuccess(true)
    setTimeout(() => {
        router.push(`/volunteers/${params.id}`)
      }, 1500)
    } catch (err) {
      console.error('Error updating volunteer:', err)
      setSubmitError(err instanceof Error ? err.message : 'Failed to update volunteer')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
  <Navbar user={user} />

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Edit Volunteer</h1>
              <p className="text-xs text-gray-600">SVDS Health Record System</p>
            </div>
            <Link href={`/volunteers/${params.id}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Details
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Volunteer updated successfully! Redirecting...
            </AlertDescription>
          </Alert>
        )}

        {submitError && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {submitError}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update the volunteer's personal details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName" 
                  value={formData.firstName} 
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName} 
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone" 
                  value={formData.phone} 
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth" 
                  type="date" 
                  value={formData.dateOfBirth} 
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="village">Village</Label>
                <Input
                  id="village" 
                  value={formData.village} 
                  onChange={(e) => handleInputChange("village", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Update the volunteer's professional details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => handleInputChange("specialization", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Link href={`/volunteers/${params.id}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting || success}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Updated!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Volunteer
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
