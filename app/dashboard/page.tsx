"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Activity, TrendingUp, BarChart3, UserPlus, FileText, AlertCircle, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"
import { AlertSystem } from "@/components/alert-system"
import Navbar from "@/components/navbar" // Import Navbar component
import { APP_CONFIG } from "@/lib/config"

// Fallbacks; real values loaded from API
const defaultStats = {
  totalPatients: 0,
  activeVolunteers: 0,
  monthlyVisits: 0,
  criticalCases: 0,
}

// Analytics derived from live data
type MonthlyDataPoint = { month: string; visits: number; newPatients: number }
type ConditionDataPoint = { name: string; value: number; color: string }
type VillagePerf = { village: string; patients: number; visits: number; satisfaction: number }

// Recent activities will be fetched from API

const chartConfig = {
  visits: {
    label: "Visits",
    color: "#3b82f6",
  },
  newPatients: {
    label: "New Patients",
    color: "#10b981",
  },
}


import { useAuth } from "@/hooks/use-auth"

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  // Admin stats from backend
  const [stats, setStats] = useState(defaultStats)
  const [statsError, setStatsError] = useState<string | null>(null)
  
  // Analytics state
  const [monthlyVisitsData, setMonthlyVisitsData] = useState<MonthlyDataPoint[]>([])
  const [conditionDistribution, setConditionDistribution] = useState<ConditionDataPoint[]>([])
  const [villagePerformance, setVillagePerformance] = useState<VillagePerf[]>([])
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)
  
  // Recent activities state
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [activitiesLoading, setActivitiesLoading] = useState(false)
  const [activitiesError, setActivitiesError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsError(null)
        const token = typeof window !== 'undefined' ? localStorage.getItem(APP_CONFIG.AUTH.TOKEN_KEY) : null
        const res = await fetch(`${APP_CONFIG.API.BASE_URL}/api/admin/stats`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!res.ok) throw new Error('Failed to fetch admin stats')
        const data = await res.json()
        // counts: { users, volunteers, patients, visits }, visitsByStatus: { scheduled, completed, ... }
        const totalPatients = data.counts?.patients ?? 0
        const activeVolunteers = data.counts?.volunteers ?? 0
        const monthlyVisits = data.counts?.visits ?? 0
        // Treat missed visits as "critical" approximation if available
        const criticalCases = (data.visitsByStatus?.missed ?? 0) as number
        setStats({ totalPatients, activeVolunteers, monthlyVisits, criticalCases })
      } catch (e) {
        console.error(e)
        setStatsError('Unable to load dashboard stats')
      }
    }
    fetchStats()
  }, [])

  // Fetch analytics source data (patients) and compute datasets
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setAnalyticsLoading(true)
        setAnalyticsError(null)
        const token = typeof window !== 'undefined' ? localStorage.getItem(APP_CONFIG.AUTH.TOKEN_KEY) : null
        const res = await fetch(`${APP_CONFIG.API.BASE_URL}/api/patients`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!res.ok) throw new Error('Failed to fetch patients for analytics')
        const payload = await res.json()
        const patients = Array.isArray(payload) ? payload : payload.patients
        const safePatients = Array.isArray(patients) ? patients : []

        // Monthly data: last 6 months newPatients (by registeredDate) and visits (by lastVisit)
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        const now = new Date()
        const lastSix: { key: string; label: string; year: number; monthIdx: number }[] = []
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
          lastSix.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: monthNames[d.getMonth()], year: d.getFullYear(), monthIdx: d.getMonth() })
        }
        const newPatientsByYM = new Map<string, number>()
        const visitsByYM = new Map<string, number>()
        safePatients.forEach((p: any) => {
          const reg = p.registeredDate ? new Date(p.registeredDate) : null
          const last = p.lastVisit ? new Date(p.lastVisit) : null
          if (reg) {
            const key = `${reg.getFullYear()}-${reg.getMonth()}`
            newPatientsByYM.set(key, (newPatientsByYM.get(key) || 0) + 1)
          }
          if (last) {
            const key = `${last.getFullYear()}-${last.getMonth()}`
            visitsByYM.set(key, (visitsByYM.get(key) || 0) + 1)
          }
        })
        const monthly: MonthlyDataPoint[] = lastSix.map(({ key, label }) => ({
          month: label,
          visits: visitsByYM.get(key) || 0,
          newPatients: newPatientsByYM.get(key) || 0,
        }))
        setMonthlyVisitsData(monthly)

        // Condition distribution: top 5 chronic conditions
        const counts = new Map<string, number>()
        safePatients.forEach((p: any) => {
          const arr = Array.isArray(p.chronicConditions) ? p.chronicConditions : []
          arr.forEach((c: string) => counts.set(c, (counts.get(c) || 0) + 1))
        })
        const palette = ['#3b82f6','#ef4444','#f59e0b','#10b981','#8b5cf6','#06b6d4','#84cc16']
        const condDist: ConditionDataPoint[] = Array.from(counts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, value], idx) => ({ name, value, color: palette[idx % palette.length] }))
        setConditionDistribution(condDist)

        // Village performance: patients per village + visits count
        const villageMap = new Map<string, { patients: number; visits: number }>()
        safePatients.forEach((p: any) => {
          const village = p.village || 'Unknown'
          const entry = villageMap.get(village) || { patients: 0, visits: 0 }
          entry.patients += 1
          if (p.lastVisit) entry.visits += 1
          villageMap.set(village, entry)
        })
        const villages: VillagePerf[] = Array.from(villageMap.entries())
          .map(([village, { patients, visits }]) => ({ village, patients, visits, satisfaction: 90 }))
          .sort((a, b) => b.patients - a.patients)
          .slice(0, 8)
        setVillagePerformance(villages)
      } catch (e) {
        console.error(e)
        setAnalyticsError('Unable to load analytics')
        setMonthlyVisitsData([])
        setConditionDistribution([])
        setVillagePerformance([])
      } finally {
        setAnalyticsLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  // Fetch recent activities
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setActivitiesLoading(true)
        setActivitiesError(null)
        const token = typeof window !== 'undefined' ? localStorage.getItem(APP_CONFIG.AUTH.TOKEN_KEY) : null

        // Use admin users endpoint to get recent creations with timestamps and roles
        const usersRes = await fetch(`${APP_CONFIG.API.BASE_URL}/api/admin/users`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })

        if (!usersRes.ok) throw new Error('Failed to fetch users for activities')
        const usersPayload = await usersRes.json()
        const users = Array.isArray(usersPayload) ? usersPayload : usersPayload.users

        const activities = (users || [])
          .map((u: any) => {
            const role = u.role
            const name = u.volunteer?.firstName || u.patient?.firstName
              ? `${u.volunteer?.firstName || u.patient?.firstName} ${u.volunteer?.lastName || u.patient?.lastName || ''}`.trim()
              : u.email
            const createdAt = u.createdAt
            return {
              id: u.id,
              type: role === 'VOLUNTEER' ? 'New Volunteer' : role === 'PATIENT' ? 'New Patient' : 'New User',
              description: `${name} account created (${role})`,
              time: createdAt ? new Date(createdAt).toLocaleString() : 'Recently',
              timestamp: createdAt ? new Date(createdAt).getTime() : 0,
            }
          })
          .sort((a: any, b: any) => b.timestamp - a.timestamp)
          .slice(0, 5)

        setRecentActivities(activities)
      } catch (e) {
        console.error('Error fetching recent activities:', e)
        setActivitiesError('Unable to load recent activities')
        // Fallback activities
        setRecentActivities([
          { id: 1, type: 'System', description: 'Dashboard loaded successfully', time: 'Just now' },
          { id: 2, type: 'Info', description: 'Real-time data integration active', time: 'Just now' },
        ])
      } finally {
        setActivitiesLoading(false)
      }
    }

    fetchRecentActivities()
  }, [])

  const handleLogout = () => {
    router.push("/login")
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    router.push("/login")
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AlertSystem />
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeVolunteers}</div>
              <p className="text-xs text-muted-foreground">+5 new this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Visits</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyVisits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.criticalCases}</div>
              <p className="text-xs text-muted-foreground">Requires immediate attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="villages">Villages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activities */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Latest updates from the field</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activitiesLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 animate-pulse">
                            <div className="flex-shrink-0">
                              <div className="h-6 w-20 bg-gray-300 rounded"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
                              <div className="h-3 w-1/4 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : activitiesError ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-red-600">{activitiesError}</p>
                      </div>
                    ) : recentActivities.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">No recent activities</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentActivities.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                            <div className="flex-shrink-0">
                              <Badge variant="secondary">{activity.type}</Badge>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      <Link href="/patients">
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Manage Patients
                        </Button>
                      </Link>
                      {/* Manage Volunteers removed: only admins should access volunteer management */}
                      <Link href="/reports">
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Reports
                        </Button>
                      </Link>
                      {/* Settings quick action removed */}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Visits Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Visits Trend</CardTitle>
                  <CardDescription>Patient visits and new registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">Loading analytics...</div>
                  ) : analyticsError ? (
                    <div className="h-[300px] flex items-center justify-center text-sm text-red-600">{analyticsError}</div>
                  ) : monthlyVisitsData.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">No data</div>
                  ) : (
                    <ChartContainer config={chartConfig} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyVisitsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={2} />
                          <Line type="monotone" dataKey="newPatients" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>

              {/* Condition Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Health Conditions Distribution</CardTitle>
                  <CardDescription>Most common health conditions in the community</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">Loading analytics...</div>
                  ) : analyticsError ? (
                    <div className="h-[300px] flex items-center justify-center text-sm text-red-600">{analyticsError}</div>
                  ) : conditionDistribution.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">No data</div>
                  ) : (
                    <ChartContainer config={chartConfig} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={conditionDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={(props: any) => {
                              const { name, percent } = props;
                              return `${name} ${(percent * 100).toFixed(0)}%`;
                            }}
                          >
                            {conditionDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>

              {/* Village Performance */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Village Performance Metrics</CardTitle>
                  <CardDescription>Patient count and visit frequency by village</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">Loading analytics...</div>
                  ) : analyticsError ? (
                    <div className="h-[300px] flex items-center justify-center text-sm text-red-600">{analyticsError}</div>
                  ) : villagePerformance.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">No data</div>
                  ) : (
                    <ChartContainer config={chartConfig} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={villagePerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="village" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="patients" fill="#3b82f6" />
                          <Bar dataKey="visits" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="villages" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analyticsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                        <span className="h-4 w-32 bg-gray-200 rounded animate-pulse"></span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent" disabled>
                        Loading...
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : analyticsError ? (
                <div className="col-span-full text-center text-sm text-red-600">{analyticsError}</div>
              ) : villagePerformance.length === 0 ? (
                <div className="col-span-full text-center text-sm text-gray-500">No village data</div>
              ) : (
                villagePerformance.map((village, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                      {village.village}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Patients</span>
                      <span className="font-semibold">{village.patients.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Visits</span>
                      <span className="font-semibold">{village.visits}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Satisfaction</span>
                      <Badge variant={village.satisfaction >= 90 ? "default" : "secondary"}>
                        {village.satisfaction}%
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Village Coverage Map</CardTitle>
                <CardDescription>Geographic distribution of healthcare services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Interactive map would be integrated here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          
        </Tabs>
      </div>
    </div>
  )
}
