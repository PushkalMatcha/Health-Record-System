"use client"

import { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, UserPlus, Edit, MapPin, Phone, Calendar, Activity } from "lucide-react"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { APP_CONFIG } from "@/lib/config"


export default function VolunteersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVillage, setSelectedVillage] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const { user } = useAuth()
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const statuses = ["All", "Active", "Training", "Inactive"]

  useEffect(() => {
    async function fetchVolunteers() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${APP_CONFIG.API.BASE_URL}/api/volunteers`)
        if (!res.ok) throw new Error("Failed to fetch volunteers")
        const data = await res.json()
        setVolunteers(data.volunteers || [])
      } catch (err) {
        setError("Could not load volunteers.")
      } finally {
        setLoading(false)
      }
    }
    fetchVolunteers()
  }, [])

  const villages = useMemo(() => [
    "All",
    ...Array.from(new Set((volunteers || []).map((v: any) => v.village).filter(Boolean)))
  ], [volunteers])

  const filteredVolunteers = (volunteers || []).filter((volunteer: any) => {
    const matchesSearch =
      volunteer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.id?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesVillage = selectedVillage === "All" || volunteer.village === selectedVillage
    const matchesStatus = selectedStatus === "All" || volunteer.status === selectedStatus
    return matchesSearch && matchesVillage && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Volunteers</h1>
                <p className="text-xs text-gray-600">SVDS Health Record System</p>
              </div>
            </div>
            {user?.role === "ADMIN" && (
              <div className="flex items-center space-x-4">
                <Link href="/volunteers/new">
                  <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Volunteer
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="hover:bg-gray-50">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Volunteers</p>
                  <p className="text-2xl font-bold text-gray-900">{volunteers.length}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Volunteers</p>
                  <p className="text-2xl font-bold text-green-600">
                    {volunteers.filter((v: any) => v.status === "Active").length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {volunteers.reduce((sum: number, v: any) => sum + (v.patientsAssigned || 0), 0)}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Visits</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {volunteers.reduce((sum: number, v: any) => sum + (v.monthlyVisits || 0), 0)}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search volunteers by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48 grid grid-cols-1 gap-3">
                <select
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {villages.map((village) => (
                    <option key={village} value={village}>
                      {village}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volunteers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">Loading volunteers...</div>
          ) : error ? (
            <div className="col-span-full text-center text-red-500 py-8">{error}</div>
          ) : filteredVolunteers.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-gray-500">No volunteers found matching your search criteria.</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredVolunteers.map((volunteer: any) => (
            <Card key={volunteer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{volunteer.name}</CardTitle>
                    <CardDescription>{volunteer.role}</CardDescription>
                  </div>
                  <Badge variant={volunteer.status === "Active" ? "default" : "secondary"}>{volunteer.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{volunteer.village}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{volunteer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Joined: {new Date(volunteer.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Patients</p>
                      <p className="font-semibold">{volunteer.patientsAssigned}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Monthly Visits</p>
                      <p className="font-semibold">{volunteer.monthlyVisits}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Badge variant="outline" className="text-xs">
                    {volunteer.specialization}
                  </Badge>
                </div>

                <div className="flex space-x-2 pt-3">
                  {user?.role === "ADMIN" && (
                    <Link href={`/volunteers/${volunteer.id}/edit`} prefetch={false} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                  )}
                  <Link href={`/volunteers/${volunteer.id}`} prefetch={false} className={user?.role === "ADMIN" ? "flex-1" : "w-full"}>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVolunteers.length === 0 && !loading && !error && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <UserPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No volunteers found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || selectedVillage !== "All" || selectedStatus !== "All" 
                    ? "No volunteers match your search criteria. Try adjusting your filters."
                    : "Get started by adding your first volunteer to the system."
                  }
                </p>
                {user?.role === "ADMIN" && (
                  <Link href="/volunteers/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add First Volunteer
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Floating Action Button for Mobile */}
        {user?.role === "ADMIN" && (
          <div className="fixed bottom-6 right-6 md:hidden z-50">
            <Link href="/volunteers/new">
              <Button 
                size="lg" 
                className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
