"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Users, Activity, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertSystem } from "@/components/alert-system"
import Navbar from "@/components/navbar" // Added navbar import
import { useAuth } from "@/hooks/use-auth"
import { APP_CONFIG } from "@/lib/config"
import { Patient } from "@/types"

// Default stats; real values loaded from API
const defaultStats = {
  patientsVisited: 0, // mapped from completed visits
  scheduledVisits: 0, // mapped from scheduled visits
  pendingFollowups: 0, // mapped from missed visits
}

// recent patients will be fetched from API

// Removed upcomingVisits section per request

export default function VolunteerDashboard() {
  const [localUser, setLocalUser] = useState<{ id?: string; name: string; role: string; village: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const auth = useAuth()

  // Patients from API (all), plus a recent slice for fallback display
  const [patients, setPatients] = useState<Patient[]>([])
  const [recentPatients, setRecentPatients] = useState<Patient[]>([])
  const [rpLoading, setRpLoading] = useState(true)
  const [rpError, setRpError] = useState<string | null>(null)
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])

  // Top stats from admin stats endpoint
  const [stats, setStats] = useState(defaultStats)
  const [statsError, setStatsError] = useState<string | null>(null)

  useEffect(() => {
    setLocalUser(auth.user as any)
  }, [auth.user])

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setRpLoading(true)
        setRpError(null)
        const token = typeof window !== 'undefined' ? localStorage.getItem(APP_CONFIG.AUTH.TOKEN_KEY) : null
        const res = await fetch(`${APP_CONFIG.API.BASE_URL}/api/patients`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!res.ok) throw new Error('Failed to fetch patients')
        const data = await res.json()
        const fetched: Patient[] = Array.isArray(data.patients) ? data.patients : []
        setPatients(fetched)
        const sorted = fetched
          .filter(p => !!p.lastVisit)
          .sort((a, b) => (b.lastVisit || '').localeCompare(a.lastVisit || ''))
          .slice(0, 5)
        setRecentPatients(sorted)

        // Update "Patients Visited Today" metric to show today's registrations instead
        const today = new Date()
        const yyyy = today.getFullYear()
        const mm = String(today.getMonth() + 1).padStart(2, '0')
        const dd = String(today.getDate()).padStart(2, '0')
        const todayStr = `${yyyy}-${mm}-${dd}`
        const todaysRegistrations = fetched.filter(p => (p.registeredDate || '').startsWith(todayStr)).length
        setStats((prev) => ({ ...prev, patientsVisited: todaysRegistrations }))
      } catch (e) {
        console.error('Recent patients load error:', e)
        setRpError('Failed to load recent patients')
      } finally {
        setRpLoading(false)
      }
    }
    fetchRecent()
  }, [])

  // Live search across patients
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) {
      setFilteredPatients([])
      return
    }
    const results = patients.filter((p) => {
      const name = (p.name || '').toLowerCase()
      const id = (p.id || '').toLowerCase()
      const phone = (p.phoneNumber || '').toLowerCase()
      const village = (p.village || '').toLowerCase()
      return name.includes(q) || id.includes(q) || phone.includes(q) || village.includes(q)
    })
    setFilteredPatients(results)
  }, [searchQuery, patients])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsError(null)
        const token = typeof window !== 'undefined' ? localStorage.getItem(APP_CONFIG.AUTH.TOKEN_KEY) : null
        const res = await fetch(`${APP_CONFIG.API.BASE_URL}/api/admin/stats`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!res.ok) throw new Error('Failed to fetch stats')
        const data = await res.json()
        const completed = (data.visitsByStatus?.completed ?? 0) as number
        const scheduled = (data.visitsByStatus?.scheduled ?? 0) as number
        const missed = (data.visitsByStatus?.missed ?? 0) as number
        setStats({ patientsVisited: completed, scheduledVisits: scheduled, pendingFollowups: missed })
      } catch (e) {
        console.error('Volunteer stats load error:', e)
        setStatsError('Failed to load stats')
      }
    }
    fetchStats()
  }, [])

  const handleLogout = () => {
    router.push("/login")
  }

  if (!localUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AlertSystem />
  <Navbar user={localUser as any} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients Visited Today</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.patientsVisited}</div>
              <p className="text-xs text-muted-foreground">Great progress!</p>
            </CardContent>
          </Card>

          {/* Removed Scheduled Visits and Pending Follow-ups */}
        </div>

        {/* Patient Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Patient Search</CardTitle>
            <CardDescription>Find patient records quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, ID, or phone number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button asChild variant="outline">
                <Link href="/volunteer/patients/new" prefetch={false}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Patient
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results (when query present) */}
        {searchQuery.trim() && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>Matching patients by name, ID, phone, or village</CardDescription>
            </CardHeader>
            <CardContent>
              {rpLoading ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : rpError ? (
                <div className="text-sm text-red-600">{rpError}</div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-sm text-gray-500">No matches found</div>
              ) : (
                <div className="space-y-4">
                  {filteredPatients.slice(0, 20).map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                          <Badge variant={patient.priority === "High" ? "destructive" : patient.priority === "Medium" ? "default" : "secondary"} className="text-xs">
                            {patient.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">
                          {patient.age} years • {patient.village} • {patient.phoneNumber}
                        </p>
                        <p className="text-xs text-gray-500">Registered: {patient.registeredDate}</p>
                      </div>
                      <div className="text-right">
                        <Button size="sm" variant="outline" className="mt-1 bg-transparent" asChild>
                          <Link href={`/patients/${patient.id}`} prefetch={false}>
                            View Record
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-8">
          {/* Today's Patients (from API) */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Patients</CardTitle>
              <CardDescription>Patients with visits recorded today</CardDescription>
            </CardHeader>
            <CardContent>
              {rpLoading ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : rpError ? (
                <div className="text-sm text-red-600">{rpError}</div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const today = new Date()
                    const yyyy = today.getFullYear()
                    const mm = String(today.getMonth() + 1).padStart(2, '0')
                    const dd = String(today.getDate()).padStart(2, '0')
                    const todayStr = `${yyyy}-${mm}-${dd}`
                    const todays = patients.filter(p => (p.lastVisit || '').startsWith(todayStr))
                    const list = (todays.length > 0 ? todays : recentPatients).slice(0, 10)
                    if (list.length === 0) {
                      return <p className="text-sm text-gray-500">No patients found for today</p>
                    }
                    return list.map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                            <Badge variant={patient.priority === "High" ? "destructive" : patient.priority === "Medium" ? "default" : "secondary"} className="text-xs">
                              {patient.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">
                            {patient.age} years • {patient.village}
                          </p>
                          <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
                        </div>
                        <div className="text-right">
                          <Button size="sm" variant="outline" className="mt-1 bg-transparent" asChild>
                            <Link href={`/patients/${patient.id}`} prefetch={false}>
                              View Record
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  })()}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Schedule removed */}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for field volunteers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Link href="/volunteer/patients/new" prefetch={false}>
                    <Plus className="h-6 w-6" />
                    <span className="text-sm">Add Patient</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Link href="/volunteer/visits/new" prefetch={false}>
                    <Activity className="h-6 w-6" />
                    <span className="text-sm">Record Visit</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <Link href="/volunteer/emergency" prefetch={false}>
                    <Phone className="h-6 w-6" />
                    <span className="text-sm">Emergency</span>
                  </Link>
                </Button>

                {/* My Schedule quick action removed */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
