"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ArrowLeft, Edit, Plus, Calendar, Phone, MapPin, User, Activity, AlertTriangle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/hooks/use-auth"
import { Patient } from "@/types"
import { APP_CONFIG } from "@/lib/config"

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  // Fetch patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Fetching patient with ID:', params.id)
        const token = localStorage.getItem(APP_CONFIG.AUTH.TOKEN_KEY)
        console.log('Auth token:', token ? `${token.substring(0, 20)}...` : 'No token found')
        
        const response = await fetch(`${APP_CONFIG.API.BASE_URL}/api/patients/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('API Error:', errorData)
          throw new Error(errorData.error || 'Failed to fetch patient')
        }
        
        const data = await response.json()
        console.log('Patient data:', data)
        setPatient(data.patient)
      } catch (err) {
        console.error('Error fetching patient:', err)
        setError(err instanceof Error ? err.message : 'Failed to load patient data')
      } finally {
        setLoading(false)
      }
    }

    fetchPatient()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading patient data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <Card>
            <CardHeader>
              <CardTitle>Error Loading Patient</CardTitle>
              <CardDescription>
                {error || `We could not find a patient with ID ${params.id}. Please return to the patients list and try again.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Link href="/patients">
                <Button variant="outline">Back to Patients</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Mock health records for now - will be replaced with real API later
  const healthRecords: any[] = []

  return (
    <div className="min-h-screen bg-gray-50">
  {/* Navbar */}
  <Navbar user={user} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Patient Details</h1>
                <p className="text-xs text-gray-600">SVDS Health Record System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/patients">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Patients
                </Button>
              </Link>
              <Link href={`/patients/${params.id}/edit`} prefetch={false}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Patient
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                  <p className="text-gray-600">
                      Patient ID: {patient.id} • {patient.age} years • {patient.gender}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                        <span>{patient.village || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                        <span>{patient.phoneNumber || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                        <span>Last visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'No visits recorded'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-2">
                    Blood Group: {patient.bloodGroup || 'Not specified'}
                </Badge>
                  {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                  <div className="space-y-1">
                      {patient.chronicConditions.map((condition) => (
                      <Badge key={condition} variant="secondary" className="block">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <Badge variant="outline" className="block">
                    No chronic conditions
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="records">Health Records</TabsTrigger>
            <TabsTrigger value="visits">Visit History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">Full Name</p>
                        <p className="text-gray-600">{patient.name}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Age</p>
                        <p className="text-gray-600">{patient.age} years</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Gender</p>
                        <p className="text-gray-600">{patient.gender}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Blood Group</p>
                        <p className="text-gray-600">{patient.bloodGroup || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Village</p>
                        <p className="text-gray-600">{patient.village || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">{patient.phoneNumber || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Emergency Contact</p>
                        <p className="text-gray-600">{patient.emergencyContact || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Registered</p>
                        <p className="text-gray-600">{patient.registeredDate ? new Date(patient.registeredDate).toLocaleDateString() : 'Not specified'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="font-medium text-gray-900">Address</p>
                        <p className="text-gray-600">{patient.address || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Emergency Phone</p>
                        <p className="text-gray-600">{patient.emergencyPhone || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Current Medications</p>
                        <p className="text-gray-600">{patient.currentMedications || 'None'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Chronic Conditions</p>
                    <div className="flex flex-wrap gap-2">
                        {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                          patient.chronicConditions.map((condition) => (
                            <Badge key={condition} variant="secondary">
                              {condition}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline">No chronic conditions</Badge>
                        )}
                    </div>
                  </div>

                    {patient.allergies && patient.allergies.length > 0 ? (
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Known Allergies</p>
                        <div className="flex flex-wrap gap-2">
                          {patient.allergies.map((allergy) => (
                            <Badge key={allergy} variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Known Allergies</p>
                        <Badge variant="outline">No known allergies</Badge>
                      </div>
                    )}

                  <div>
                    <p className="font-medium text-gray-900 mb-2">Notes</p>
                      <p className="text-sm text-gray-600">{patient.notes || 'No notes available'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Health Records</h3>
              <Link href={`/patients/${params.id}/records/new`}>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
                {healthRecords.map((record) => (
                <Card key={record.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{record.recordType}</CardTitle>
                        <CardDescription>
                          {new Date(record.dateOfVisit).toLocaleDateString()} • Recorded by {record.recordedBy}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{record.id}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Condition / Test</h4>
                          <p className="text-sm text-gray-600">{record.conditionTestName}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Results / Vitals</h4>
                          <p className="text-sm text-gray-600">{record.resultsVitals}</p>
                        </div>
                      </div>

                      {record.notesFollowUp && (
                        <div className="pt-4 border-t">
                          <h4 className="font-medium text-gray-900 mb-2">Notes / Follow-Up Actions</h4>
                          <p className="text-sm text-gray-600">{record.notesFollowUp}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="visits">
            <Card>
              <CardHeader>
                <CardTitle>Visit History</CardTitle>
                <CardDescription>Complete history of patient visits and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{record.recordType}</p>
                          <p className="text-sm text-gray-600">{new Date(record.dateOfVisit).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">by {record.recordedBy}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{record.conditionTestName}</Badge>
                        <p className="text-xs text-gray-500 mt-1">{record.resultsVitals}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
