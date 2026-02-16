"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, Info, CheckCircle, Clock, MapPin, User } from "lucide-react"

export default function VolunteerNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "schedule",
      title: "Upcoming Visit Reminder",
      message: "You have a scheduled visit with Lakshmi Devi (P001) tomorrow at 10:00 AM in Sarada Village",
      time: "2h ago",
      priority: "high",
      read: false,
      patientId: "P001",
      location: "Sarada Village",
    },
    {
      id: 2,
      type: "assignment",
      title: "New Patient Assignment",
      message: "You have been assigned to monitor Ravi Kumar (P002) for diabetes management",
      time: "4h ago",
      priority: "medium",
      read: false,
      patientId: "P002",
    },
    {
      id: 3,
      type: "reminder",
      title: "Follow-up Required",
      message: "Patient Meera Singh (P003) needs follow-up visit for blood pressure check",
      time: "1d ago",
      priority: "medium",
      read: true,
      patientId: "P003",
    },
    {
      id: 4,
      type: "training",
      title: "Training Session",
      message: "Monthly volunteer training session scheduled for this Saturday at 2:00 PM",
      time: "2d ago",
      priority: "low",
      read: true,
    },
    {
      id: 5,
      type: "update",
      title: "Health Record Updated",
      message: "Patient Suresh Patel (P004) health record has been updated with new medication",
      time: "3d ago",
      priority: "low",
      read: true,
      patientId: "P004",
    },
  ])

  const user = {
    name: "Volunteer User",
    role: "Volunteer",
  }

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "schedule":
        return <Calendar className="h-4 w-4" />
      case "assignment":
        return <User className="h-4 w-4" />
      case "reminder":
        return <Clock className="h-4 w-4" />
      case "training":
        return <Info className="h-4 w-4" />
      case "update":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const scheduleNotifications = notifications.filter((n) => n.type === "schedule")
  const assignmentNotifications = notifications.filter((n) => n.type === "assignment" || n.type === "reminder")
  const generalNotifications = notifications.filter((n) => n.type === "training" || n.type === "update")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Notifications</h1>
                <p className="text-gray-600">Stay updated with your patient visits and assignments</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {unreadCount} unread
              </Badge>
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} variant="outline" size="sm">
                  Mark All Read
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="schedule">Schedule ({scheduleNotifications.length})</TabsTrigger>
            <TabsTrigger value="assignments">Assignments ({assignmentNotifications.length})</TabsTrigger>
            <TabsTrigger value="general">General ({generalNotifications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${!notification.read ? "border-blue-200 bg-blue-50/30" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div
                        className={`p-2 rounded-lg ${notification.type === "schedule" ? "bg-blue-100 text-blue-600" : notification.type === "assignment" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
                      >
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                            {notification.title}
                          </h3>
                          <Badge className={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{notification.time}</span>
                          </span>
                          {notification.patientId && (
                            <span className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{notification.patientId}</span>
                            </span>
                          )}
                          {notification.location && (
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{notification.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          Mark Read
                        </Button>
                      )}
                      {notification.type === "schedule" && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            {scheduleNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${!notification.read ? "border-blue-200 bg-blue-50/30" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                            {notification.title}
                          </h3>
                          <Badge className={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{notification.time}</span>
                          </span>
                          {notification.patientId && (
                            <span className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{notification.patientId}</span>
                            </span>
                          )}
                          {notification.location && (
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{notification.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        View Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            {assignmentNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${!notification.read ? "border-blue-200 bg-blue-50/30" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600">{getIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                            {notification.title}
                          </h3>
                          <Badge className={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{notification.time}</span>
                          </span>
                          {notification.patientId && (
                            <span className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{notification.patientId}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        View Patient
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            {generalNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${!notification.read ? "border-blue-200 bg-blue-50/30" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 rounded-lg bg-gray-100 text-gray-600">{getIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                            {notification.title}
                          </h3>
                          <Badge className={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{notification.time}</span>
                          </span>
                          {notification.patientId && (
                            <span className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{notification.patientId}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
