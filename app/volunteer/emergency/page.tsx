"use client"

import Navbar from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function VolunteerEmergencyPage() {
  const user = { name: "Volunteer Priya", role: "Field Volunteer", village: "Sarada Village" }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Emergency Assistance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              If this is a medical emergency, contact the supervising clinician immediately.
            </p>
            <div className="flex gap-2">
              <Button className="bg-red-600 hover:bg-red-700">Call Supervisor</Button>
              <Button variant="outline">Share Location</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
