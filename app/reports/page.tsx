"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/hooks/use-auth"
import { APP_CONFIG } from "@/lib/config"
import { Patient, Volunteer } from "@/types"

export default function ReportsPage() {
  const { user } = useAuth()
  const [patients, setPatients] = useState<Patient[]>([])
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = typeof window !== 'undefined' ? localStorage.getItem(APP_CONFIG.AUTH.TOKEN_KEY) : null

        const [pRes, vRes] = await Promise.all([
          fetch(`${APP_CONFIG.API.BASE_URL}/api/patients`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }),
          fetch(`${APP_CONFIG.API.BASE_URL}/api/volunteers`),
        ])

        if (!pRes.ok) throw new Error('Failed to fetch patients')
        if (!vRes.ok) throw new Error('Failed to fetch volunteers')

        const pData = await pRes.json()
        const vData = await vRes.json()
        setPatients(Array.isArray(pData.patients) ? pData.patients : [])
        setVolunteers(Array.isArray(vData.volunteers) ? vData.volunteers : [])
      } catch (e) {
        console.error(e)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const handleExportExcel = async () => {
    try {
      const XLSX = await import("xlsx")
      const workbook = XLSX.utils.book_new()

      // Patients sheet (include all registration fields)
      const patientRows = patients.map((p) => ({
        ID: p.id,
        Name: p.name,
        Age: p.age,
        Gender: p.gender,
        Village: p.village,
        Address: p.address,
        Phone: p.phoneNumber,
        "Emergency Contact": p.emergencyContact,
        "Emergency Phone": (p as any).emergencyPhone,
        "Blood Group": p.bloodGroup,
        Allergies: Array.isArray(p.allergies) ? p.allergies.join(", ") : p.allergies,
        "Chronic Conditions": Array.isArray(p.chronicConditions) ? p.chronicConditions.join(", ") : p.chronicConditions,
        Notes: p.notes,
        "Current Medications": (p as any).currentMedications,
        Priority: p.priority,
        "Registered Date": p.registeredDate,
        "Last Visit": p.lastVisit,
      }))
      const wsPatients = XLSX.utils.json_to_sheet(patientRows)
      XLSX.utils.book_append_sheet(workbook, wsPatients, "Patients")

      // Volunteers sheet
      const volunteerRows = volunteers.map((v) => ({
        ID: v.id,
        Name: v.name,
        Email: v.email,
        Phone: v.phone,
        Village: v.village,
        Specialization: v.specialization,
        Status: v.status,
      }))
      const wsVolunteers = XLSX.utils.json_to_sheet(volunteerRows)
      XLSX.utils.book_append_sheet(workbook, wsVolunteers, "Volunteers")

      const wbArray = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      const blob = new Blob([wbArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "svds-reports.xlsx"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1500)
    } catch (err) {
      console.error("Excel export failed", err)
      alert("Failed to export Excel. Please try again.")
    }
  }

  const handleExportPatientsExcel = async () => {
    try {
      const XLSX = await import("xlsx")
      const workbook = XLSX.utils.book_new()
      const patientRows = patients.map((p) => ({
        ID: p.id,
        Name: p.name,
        Age: p.age,
        Gender: p.gender,
        Village: p.village,
        Address: p.address,
        Phone: p.phoneNumber,
        "Emergency Contact": p.emergencyContact,
        "Emergency Phone": (p as any).emergencyPhone,
        "Blood Group": p.bloodGroup,
        Allergies: Array.isArray(p.allergies) ? p.allergies.join(", ") : p.allergies,
        "Chronic Conditions": Array.isArray(p.chronicConditions) ? p.chronicConditions.join(", ") : p.chronicConditions,
        Notes: p.notes,
        "Current Medications": (p as any).currentMedications,
        Priority: p.priority,
        "Registered Date": p.registeredDate,
        "Last Visit": p.lastVisit,
      }))
      const ws = XLSX.utils.json_to_sheet(patientRows)
      XLSX.utils.book_append_sheet(workbook, ws, "Patients")
      const wbArray = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      const blob = new Blob([wbArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "svds-patients.xlsx"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1500)
    } catch (err) {
      console.error("Patients Excel export failed", err)
      alert("Failed to export Patients Excel. Please try again.")
    }
  }

  const handleExportVolunteersExcel = async () => {
    try {
      const XLSX = await import("xlsx")
      const workbook = XLSX.utils.book_new()
      const volunteerRows = volunteers.map((v) => ({
        ID: v.id,
        Name: v.name,
        Email: v.email,
        Phone: v.phone,
        Village: v.village,
        Specialization: v.specialization,
        Status: v.status,
        "Created At": v.createdAt,
      }))
      const ws = XLSX.utils.json_to_sheet(volunteerRows)
      XLSX.utils.book_append_sheet(workbook, ws, "Volunteers")
      const wbArray = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      const blob = new Blob([wbArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "svds-volunteers.xlsx"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1500)
    } catch (err) {
      console.error("Volunteers Excel export failed", err)
      alert("Failed to export Volunteers Excel. Please try again.")
    }
  }

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
                <h1 className="text-xl font-bold text-gray-900">Admin Reports</h1>
                <p className="text-xs text-gray-600">All Patients and Volunteers</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleExportPatientsExcel}>
                <Download className="h-4 w-4 mr-2" />
                Export Patients
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleExportVolunteersExcel}>
                <Download className="h-4 w-4 mr-2" />
                Export Volunteers
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-sm text-gray-500">Loading data...</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : (
          <div className="space-y-8">
            {/* Patients Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Patients</CardTitle>
                    <CardDescription>All registered patients</CardDescription>
                  </div>
                  <Badge variant="outline">{patients.length} total</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {patients.length === 0 ? (
                  <p className="text-sm text-gray-500">No patients found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-600">
                          <th className="py-2 pr-6">ID</th>
                          <th className="py-2 pr-6">Name</th>
                          <th className="py-2 pr-6">Age</th>
                          <th className="py-2 pr-6">Village</th>
                          <th className="py-2 pr-6">Phone</th>
                          <th className="py-2 pr-6">Priority</th>
                          <th className="py-2 pr-6">Last Visit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patients.map((p) => (
                          <tr key={p.id} className="border-t">
                            <td className="py-2 pr-6">{p.id}</td>
                            <td className="py-2 pr-6">{p.name}</td>
                            <td className="py-2 pr-6">{p.age}</td>
                            <td className="py-2 pr-6">{p.village}</td>
                            <td className="py-2 pr-6">{p.phoneNumber}</td>
                            <td className="py-2 pr-6">
                              <Badge variant={p.priority === 'High' ? 'destructive' : p.priority === 'Medium' ? 'default' : 'secondary'}>{p.priority}</Badge>
                            </td>
                            <td className="py-2 pr-6">{p.lastVisit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Volunteers Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Volunteers</CardTitle>
                    <CardDescription>All registered volunteers</CardDescription>
                  </div>
                  <Badge variant="outline">{volunteers.length} total</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {volunteers.length === 0 ? (
                  <p className="text-sm text-gray-500">No volunteers found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-600">
                          <th className="py-2 pr-6">ID</th>
                          <th className="py-2 pr-6">Name</th>
                          <th className="py-2 pr-6">Email</th>
                          <th className="py-2 pr-6">Phone</th>
                          <th className="py-2 pr-6">Village</th>
                          <th className="py-2 pr-6">Specialization</th>
                          <th className="py-2 pr-6">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {volunteers.map((v) => (
                          <tr key={v.id} className="border-t">
                            <td className="py-2 pr-6">{v.id}</td>
                            <td className="py-2 pr-6">{v.name}</td>
                            <td className="py-2 pr-6">{v.email}</td>
                            <td className="py-2 pr-6">{v.phone}</td>
                            <td className="py-2 pr-6">{v.village}</td>
                            <td className="py-2 pr-6">{v.specialization}</td>
                            <td className="py-2 pr-6">
                              <Badge variant={v.status === 'ACTIVE' ? 'default' : v.status === 'PENDING' ? 'secondary' : 'outline'}>{v.status}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
