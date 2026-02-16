"use client"

import Navbar from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function VolunteerRecordVisitPage() {
  const user = { name: "Volunteer Priya", role: "Field Volunteer", village: "Sarada Village" }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Record Visit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Patient ID (e.g., P001)" />
            <Input placeholder="Visit Type (Follow-up, Checkup, etc.)" />
            <Textarea placeholder="Notes / Observations" />
            <div className="flex justify-end">
              <Button>Save Visit</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
