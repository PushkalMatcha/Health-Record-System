"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Bell, CheckCircle, Clock, X, Phone, Mail } from "lucide-react"

interface SystemAlert {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  message: string
  timestamp: Date
  dismissed: boolean
  actionTaken: boolean
  patientId?: string
  location?: string
}

const mockAlerts: SystemAlert[] = [
  {
    id: "A001",
    type: "critical",
    title: "Emergency Patient Alert",
    message: "Patient Lakshmi Devi showing severe symptoms - immediate medical attention required",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    dismissed: false,
    actionTaken: false,
    patientId: "P001",
    location: "Sarada Village",
  },
  {
    id: "A002",
    type: "warning",
    title: "Medication Stock Low",
    message: "Insulin stock critically low (5 units remaining) at Vallur clinic",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    dismissed: false,
    actionTaken: false,
    location: "Vallur",
  },
  {
    id: "A003",
    type: "info",
    title: "System Maintenance Scheduled",
    message: "Routine system maintenance scheduled for tonight 11 PM - 2 AM",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    dismissed: false,
    actionTaken: true,
  },
]

export function AlertSystem() {
  const [alerts, setAlerts] = useState(mockAlerts)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    try {
      const shown = sessionStorage.getItem("svds_alerts_shown")
      if (shown === "1") {
        setIsVisible(false)
      } else {
        setIsVisible(true)
        sessionStorage.setItem("svds_alerts_shown", "1")
      }
    } catch {
      // If sessionStorage is unavailable, default to visible once
      setIsVisible(true)
    }
  }, [])

  const activeAlerts = alerts.filter((alert) => !alert.dismissed)
  const criticalAlerts = activeAlerts.filter((alert) => alert.type === "critical")

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, dismissed: true } : alert)))
  }

  const markActionTaken = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, actionTaken: true } : alert)))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />
      case "warning":
        return <Clock className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive"
      case "warning":
        return "default"
      default:
        return "default"
    }
  }

  if (!isVisible || activeAlerts.length === 0) {
    return null
  }

  return (
    <div className="fixed top-20 right-4 w-96 z-[9998] space-y-2">
      {activeAlerts.slice(0, 3).map((alert) => (
        <Alert key={alert.id} variant={getAlertVariant(alert.type) as any} className="shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-sm">{alert.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {alert.type}
                  </Badge>
                </div>
                <AlertDescription className="text-sm">{alert.message}</AlertDescription>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  {alert.location && <span>{alert.location}</span>}
                  {alert.patientId && <span>Patient: {alert.patientId}</span>}
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  {alert.type === "critical" && !alert.actionTaken && (
                    <>
                      <Button size="sm" onClick={() => markActionTaken(alert.id)} className="h-7 text-xs">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markActionTaken(alert.id)}
                        className="h-7 text-xs"
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        Notify
                      </Button>
                    </>
                  )}
                  {alert.actionTaken && (
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Action Taken
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissAlert(alert.id)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      ))}

      {activeAlerts.length > 3 && (
        <div className="text-center">
          <Button variant="outline" size="sm" className="text-xs bg-transparent">
            View {activeAlerts.length - 3} more alerts
          </Button>
        </div>
      )}
    </div>
  )
}
