import { NextResponse } from "next/server"

let volunteers = [
  { id: "V001", name: "Priya Sharma" },
  { id: "V002", name: "Rajesh Kumar" },
]

export async function GET() {
  return NextResponse.json({ volunteers })
}

export async function POST(request: Request) {
  const body = await request.json()
  const newVolunteer = { ...body, id: `V${String(volunteers.length + 1).padStart(3, "0")}` }
  volunteers.push(newVolunteer)
  return NextResponse.json({ volunteer: newVolunteer }, { status: 201 })
}
