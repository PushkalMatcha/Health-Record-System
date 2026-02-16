"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Phone, Calendar, Activity, AlertCircle } from "lucide-react"
import Link from "next/link"
import { AlertSystem } from "@/components/alert-system"
import Navbar from "@/components/navbar"
import { useAuth } from "@/hooks/use-auth"
import { Patient } from "@/types"
import { APP_CONFIG } from "@/lib/config"

export default function VolunteerPatients() {
  const [searchQuery, setSearchQuery] = useState("")
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  // Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = localStorage.getItem(APP_CONFIG.AUTH.TOKEN_KEY)
        const response = await fetch(`${APP_CONFIG.API.BASE_URL}/api/patients`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch patients')
        }
        
        const data = await response.json()
        setPatients(data.patients)
        setFilteredPatients(data.patients)
      } catch (err) {
        console.error('Error fetching patients:', err)
        setError('Failed to load patients')
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  useEffect(() => {
    const filtered = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.chronicConditions.some(condition => 
          condition.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    )
    setFilteredPatients(filtered)
  }, [searchQuery, patients])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AlertSystem />
        <Navbar user={user as any} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading patients...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AlertSystem />
        <Navbar user={user as any} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Patients</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AlertSystem />
  <Navbar user={user as any} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
          <p className="text-gray-600">Patients assigned to your care</p>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Search Patients</CardTitle>
                <CardDescription>Find patients by name, village, or condition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
              <p className="text-xs text-muted-foreground">Under your care</p>
            </CardContent>
          </Card>
        </div>

        {/* Patients List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <CardDescription>
                      {patient.age} years • {patient.village}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      patient.priority === "High"
                        ? "destructive"
                        : patient.priority === "Medium"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {patient.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Conditions:</span>
                    <span className="font-medium">{patient.chronicConditions.join(", ") || "None"}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Village:</span>
                    <span>{patient.village}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Phone:</span>
                    <span>{patient.phoneNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Last Visit:</span>
                    <span>{patient.lastVisit}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Link href={`/patients/${patient.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      View Record
                    </Button>
                  </Link>
                  <Link href={`/visits/new?patient=${patient.id}`} className="flex-1">
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                      Record Visit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500">No patients found matching your search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
