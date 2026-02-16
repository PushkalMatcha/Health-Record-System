"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/hooks/use-auth"
import { APP_CONFIG } from "@/lib/config"

import { Calendar, MapPin, Phone, Mail, Users, Activity, ArrowLeft, Edit, Award } from "lucide-react"
import Link from "next/link"

export default function VolunteerDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  const { user } = useAuth()

  const [volunteer, setVolunteer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVolunteer() {
      setLoading(true)
      setError(null)
      try {
        console.log('Fetching volunteer with ID:', params.id)
        const res = await fetch(`${APP_CONFIG.API.BASE_URL}/api/volunteers/${params.id}`)
        console.log('Response status:', res.status)
        
        if (!res.ok) {
          const errorData = await res.json()
          console.error('API Error:', errorData)
          throw new Error(errorData.error || "Failed to fetch volunteer")
        }
        
        const data = await res.json()
        console.log('Volunteer data:', data)
        setVolunteer(data.volunteer)
      } catch (err) {
        console.error('Error fetching volunteer:', err)
        setError(err instanceof Error ? err.message : "Could not load volunteer.")
      } finally {
        setLoading(false)
      }
    }
    fetchVolunteer()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading volunteer details...</p>
          </div>
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
              <CardTitle>Error Loading Volunteer</CardTitle>
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

  // TODO: Fetch activities from backend if/when available
  const activities: any[] = []

  return (
    <div className="min-h-screen bg-gray-50">
  <Navbar user={user} />

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Volunteer Details</h1>
              <p className="text-xs text-gray-600">SVDS Health Record System</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/volunteers">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Volunteers
                </Button>
              </Link>
              {user?.role === "ADMIN" && (
                <Link href={`/volunteers/${volunteer.id}/edit`}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Volunteer
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{volunteer.name}</h2>
                <p className="text-gray-600">Volunteer</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{volunteer.village || 'Not specified'}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{volunteer.phone}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{volunteer.email}</span>
                  </span>
                  {volunteer.dateOfBirth && (
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>DOB: {new Date(volunteer.dateOfBirth).toLocaleDateString()}</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right space-y-2">
                <Badge className="px-3 py-1">{volunteer.status}</Badge>
                <div>
                  <Badge variant="outline">{volunteer.specialization}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-2xl font-semibold text-gray-900">{volunteer.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Specialization</p>
                    <p className="text-2xl font-semibold text-gray-900">{volunteer.specialization || 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Contact Information</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{volunteer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{volunteer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{volunteer.village || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-2">Address</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{volunteer.address || 'Not specified'}</p>
                </div>
                {volunteer.emergencyContact && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-2">Emergency Contact</p>
                    <div className="text-sm text-gray-700">
                      <p><strong>Name:</strong> {(volunteer.emergencyContact as any)?.name || 'Not specified'}</p>
                      <p><strong>Phone:</strong> {(volunteer.emergencyContact as any)?.phone || 'Not specified'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            {activities.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-gray-500">No recent activity recorded.</CardContent>
              </Card>
            ) : (
              activities.map((activity) => (
                <Card key={activity.date}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{activity.title}</span>
                      <Badge variant="outline">{new Date(activity.date).toLocaleDateString()}</Badge>
                    </CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600 flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{activity.patientsVisited} patients visited</span>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Key metrics to evaluate volunteer performance</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Patient Satisfaction</p>
                    <Award className="h-4 w-4 text-yellow-500" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">94%</p>
                  <p className="text-xs text-gray-500 mt-1">Based on recent feedback surveys</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Visit Compliance</p>
                    <Activity className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">88%</p>
                  <p className="text-xs text-gray-500 mt-1">Scheduled visits completed this month</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Training Progress</p>
                    <Users className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">Completed</p>
                  <p className="text-xs text-gray-500 mt-1">Latest training module finished on schedule</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
