"use client"

import Navbar from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VolunteerSchedulePage() {
  const user = { name: "Volunteer Priya", role: "Field Volunteer", village: "Sarada Village" }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>My Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">Your upcoming visits will appear here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
