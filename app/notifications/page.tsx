"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ArrowLeft, Bell, Mail, Phone, AlertTriangle, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { NotificationsCenter } from "@/components/notifications-center"
import { Navbar } from "@/components/navbar"

const notificationSettings = [
  {
    id: "critical-alerts",
    title: "Critical Patient Alerts",
    description: "Immediate notifications for emergency cases",
    email: true,
    sms: true,
    push: true,
  },
  {
    id: "follow-up-reminders",
    title: "Follow-up Reminders",
    description: "Reminders for scheduled patient follow-ups",
    email: true,
    sms: false,
    push: true,
  },
  {
    id: "medication-alerts",
    title: "Medication Stock Alerts",
    description: "Low stock warnings for medications",
    email: true,
    sms: false,
    push: true,
  },
  {
    id: "system-updates",
    title: "System Updates",
    description: "System maintenance and update notifications",
    email: true,
    sms: false,
    push: false,
  },
  {
    id: "report-generation",
    title: "Report Generation",
    description: "Notifications when reports are ready",
    email: true,
    sms: false,
    push: true,
  },
  {
    id: "volunteer-updates",
    title: "Volunteer Updates",
    description: "Training schedules and volunteer announcements",
    email: true,
    sms: false,
    push: false,
  },
]

const alertTemplates = [
  {
    id: "critical-patient",
    title: "Critical Patient Alert",
    description: "Template for emergency patient notifications",
    channels: ["Email", "SMS", "Push"],
    lastUsed: "2 hours ago",
  },
  {
    id: "follow-up-reminder",
    title: "Follow-up Reminder",
    description: "Template for appointment reminders",
    channels: ["Email", "Push"],
    lastUsed: "1 day ago",
  },
  {
    id: "medication-stock",
    title: "Medication Stock Alert",
    description: "Template for low stock warnings",
    channels: ["Email", "Push"],
    lastUsed: "3 days ago",
  },
  {
    id: "health-screening",
    title: "Health Screening Reminder",
    description: "Template for screening program reminders",
    channels: ["Email", "SMS"],
    lastUsed: "1 week ago",
  },
]

export default function NotificationsPage() {
  const [settings, setSettings] = useState(notificationSettings)
  const [activeTab, setActiveTab] = useState("center")
  const router = useRouter()

  const user = {
    name: "Dr. Admin",
    role: "admin" as const,
    email: "admin@svds.org",
  }

  const updateSetting = (id: string, channel: "email" | "sms" | "push", value: boolean) => {
    setSettings((prev) => prev.map((setting) => (setting.id === id ? { ...setting, [channel]: value } : setting)))
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
                <h1 className="text-xl font-bold text-gray-900">Notifications & Alerts</h1>
                <p className="text-xs text-gray-600">SVDS Health Record System</p>
              </div>
            </div>
            <Button variant="outline" type="button" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="center">Notification Center</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="center">
            <div className="flex justify-center">
              <NotificationsCenter />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {settings.map((setting) => (
                    <div key={setting.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{setting.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{setting.description}</p>
                      </div>
                      <div className="flex items-center space-x-6 ml-6">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <Label htmlFor={`${setting.id}-email`} className="text-sm">
                            Email
                          </Label>
                          <Switch
                            id={`${setting.id}-email`}
                            checked={setting.email}
                            onCheckedChange={(value) => updateSetting(setting.id, "email", value)}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <Label htmlFor={`${setting.id}-sms`} className="text-sm">
                            SMS
                          </Label>
                          <Switch
                            id={`${setting.id}-sms`}
                            checked={setting.sms}
                            onCheckedChange={(value) => updateSetting(setting.id, "sms", value)}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-gray-400" />
                          <Label htmlFor={`${setting.id}-push`} className="text-sm">
                            Push
                          </Label>
                          <Switch
                            id={`${setting.id}-push`}
                            checked={setting.push}
                            onCheckedChange={(value) => updateSetting(setting.id, "push", value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Settings</CardTitle>
                <CardDescription>Configure notification delivery preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Quiet Hours</h4>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Label htmlFor="quiet-start" className="text-sm">
                          Start Time
                        </Label>
                        <select id="quiet-start" className="w-full mt-1 p-2 border rounded-md">
                          <option value="22:00">10:00 PM</option>
                          <option value="23:00">11:00 PM</option>
                          <option value="00:00">12:00 AM</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="quiet-end" className="text-sm">
                          End Time
                        </Label>
                        <select id="quiet-end" className="w-full mt-1 p-2 border rounded-md">
                          <option value="06:00">6:00 AM</option>
                          <option value="07:00">7:00 AM</option>
                          <option value="08:00">8:00 AM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Emergency Override</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emergency-override" className="text-sm">
                          Allow critical alerts during quiet hours
                        </Label>
                        <Switch id="emergency-override" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="weekend-notifications" className="text-sm">
                          Receive notifications on weekends
                        </Label>
                        <Switch id="weekend-notifications" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Templates</CardTitle>
                <CardDescription>Manage and customize notification message templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertTemplates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{template.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Channels:</span>
                          {template.channels.map((channel) => (
                            <Badge key={channel} variant="outline" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                          <span className="text-xs text-gray-500 ml-4">Last used: {template.lastUsed}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          Edit Template
                        </Button>
                        <Button variant="outline" size="sm">
                          Test Send
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button className="bg-blue-600 hover:bg-blue-700">Create New Template</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notifications Sent</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">23</div>
                  <p className="text-xs text-muted-foreground">Requiring immediate action</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">94%</div>
                  <p className="text-xs text-muted-foreground">Average response rate</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Notification Performance</CardTitle>
                <CardDescription>Delivery and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Delivery Channels</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Email</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                            </div>
                            <span className="text-sm text-gray-600">85%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Push Notifications</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                            </div>
                            <span className="text-sm text-gray-600">92%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">SMS</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-orange-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                            </div>
                            <span className="text-sm text-gray-600">78%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Response Times</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Critical Alerts:</span>
                          <span className="font-medium">2.3 min avg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Follow-up Reminders:</span>
                          <span className="font-medium">4.7 hours avg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>System Updates:</span>
                          <span className="font-medium">1.2 days avg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>General Notifications:</span>
                          <span className="font-medium">6.8 hours avg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
