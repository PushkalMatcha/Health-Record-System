"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertSystem } from "@/components/alert-system"
import Navbar from "@/components/navbar"

// Mock data for schedule
const mockUser = { name: "Volunteer Priya", role: "Field Volunteer", village: "Sarada Village" }

const todaySchedule = [
  {
    id: "S001",
    time: "09:00 AM",
    patient: "Lakshmi Devi",
    patientId: "P001",
    village: "Sarada Village",
    type: "General Checkup",
    status: "scheduled",
    duration: "30 min",
    notes: "Regular diabetes follow-up",
  },
  {
    id: "S002",
    time: "10:30 AM",
    patient: "Ravi Kumar",
    patientId: "P002",
    village: "Vallur",
    type: "Blood Test",
    status: "completed",
    duration: "20 min",
    notes: "Hypertension monitoring",
  },
  {
    id: "S003",
    time: "02:00 PM",
    patient: "Sunita Rao",
    patientId: "P003",
    village: "Sarada Village",
    type: "Prenatal Care",
    status: "scheduled",
    duration: "45 min",
    notes: "Monthly prenatal checkup",
  },
  {
    id: "S004",
    time: "03:30 PM",
    patient: "Mohan Reddy",
    patientId: "P004",
    village: "Kothapalli",
    type: "Vaccination",
    status: "scheduled",
    duration: "15 min",
    notes: "COVID booster shot",
  },
]

const upcomingDays = [
  {
    date: "Tomorrow",
    count: 6,
    appointments: [
      { time: "09:00 AM", patient: "Kamala Devi", type: "Screening" },
      { time: "11:00 AM", patient: "Venkat Rao", type: "Follow-up" },
      { time: "02:30 PM", patient: "Priya Sharma", type: "Counseling" },
    ],
  },
  {
    date: "Day After Tomorrow",
    count: 4,
    appointments: [
      { time: "10:00 AM", patient: "Rajesh Kumar", type: "Checkup" },
      { time: "01:00 PM", patient: "Meera Patel", type: "Vaccination" },
    ],
  },
]

export default function SchedulePage() {
  const [user, setUser] = useState<{ name: string; role: string; village: string } | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week">("day")
  const router = useRouter()

  useEffect(() => {
    setUser(mockUser)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "General Checkup":
        return "bg-purple-100 text-purple-800"
      case "Blood Test":
        return "bg-orange-100 text-orange-800"
      case "Prenatal Care":
        return "bg-pink-100 text-pink-800"
      case "Vaccination":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AlertSystem />
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
            <p className="text-gray-600 mt-1">Manage your patient visits and appointments</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant={viewMode === "day" ? "default" : "outline"} size="sm" onClick={() => setViewMode("day")}>
                Day
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                Week
              </Button>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Visit
            </Button>
          </div>
        </div>

        {/* Date Navigation */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Today</h2>
                  <p className="text-sm text-gray-600">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {todaySchedule.length} appointments
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {todaySchedule.filter((apt) => apt.status === "completed").length} completed
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Today's Appointments
                </CardTitle>
                <CardDescription>Your scheduled patient visits for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaySchedule.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{appointment.time}</span>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                            <Badge variant="outline" className={getTypeColor(appointment.type)}>
                              {appointment.type}
                            </Badge>
                          </div>

                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">{appointment.patient}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{appointment.village}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{appointment.duration}</span>
                              </div>
                            </div>
                            {appointment.notes && <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Link href={`/patients/${appointment.patientId}`}>
                            <Button variant="outline" size="sm">
                              View Patient
                            </Button>
                          </Link>
                          {appointment.status === "scheduled" && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Start Visit
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Days & Quick Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Appointments</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="font-semibold text-blue-600">6</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Villages Covered</span>
                    <span className="font-semibold">4</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Days */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming</CardTitle>
                <CardDescription>Next few days schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDays.map((day, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{day.date}</h4>
                        <Badge variant="secondary">{day.count} visits</Badge>
                      </div>
                      <div className="space-y-1">
                        {day.appointments.slice(0, 2).map((apt, aptIndex) => (
                          <div key={aptIndex} className="text-sm text-gray-600">
                            <span className="font-medium">{apt.time}</span> - {apt.patient} ({apt.type})
                          </div>
                        ))}
                        {day.appointments.length > 2 && (
                          <p className="text-xs text-gray-500">+{day.appointments.length - 2} more...</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
