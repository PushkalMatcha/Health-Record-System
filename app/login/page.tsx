"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Eye, EyeOff, UserCheck, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { APP_CONFIG } from "@/lib/config"

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"ADMIN" | "VOLUNTEER" | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [dob, setDob] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, clearAuth, isLoading: authLoading } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
  setFormLoading(true)
    setError("")

    // Validate required fields
    if (!email) {
      setError('Email is required');
      setFormLoading(false);
      return;
    }

    if (selectedRole === 'VOLUNTEER' && !dob) {
      setError('Date of Birth is required for volunteer login');
      setFormLoading(false);
      return;
    }

    if (selectedRole === 'ADMIN' && !password) {
      setError('Password is required for admin login');
      setFormLoading(false);
      return;
    }

    try {
      // Use the auth hook's login function
      await login(email, password, dob);
      // If we get here, login was successful. Redirect the user based on selected role.
      setError('')
      if (selectedRole === 'ADMIN') {
        router.push('/dashboard')
      } else if (selectedRole === 'VOLUNTEER') {
        router.push('/volunteer')
      } else {
        router.push('/')
      }
      return
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setFormLoading(false);
    }
  }

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3 mb-4">
              <Heart className="h-10 w-10 text-blue-600" />
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">SVDS</h1>
                <p className="text-sm text-gray-600">Health Record System</p>
              </div>
            </Link>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Select Your Role</CardTitle>
              <CardDescription className="text-center">Choose your role to access the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setSelectedRole("ADMIN")}
                variant="outline"
                className="w-full h-16 flex items-center justify-start space-x-4 hover:bg-blue-50 hover:border-blue-300"
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Administrator</p>
                  <p className="text-sm text-gray-600">Full system access and management</p>
                </div>
              </Button>

              <Button
                onClick={() => setSelectedRole("VOLUNTEER")}
                variant="outline"
                className="w-full h-16 flex items-center justify-start space-x-4 hover:bg-green-50 hover:border-green-300"
              >
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Field Volunteer</p>
                  <p className="text-sm text-gray-600">Patient care and data entry</p>
                </div>
              </Button>

              <div className="mt-6 text-center">
                <Link href="/" className="text-sm text-blue-600 hover:underline">
                  ← Back to Homepage
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-4">
            <Heart className="h-10 w-10 text-blue-600" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">SVDS</h1>
              <p className="text-sm text-gray-600">Health Record System</p>
            </div>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {selectedRole === "ADMIN" ? "Administrator" : "Field Volunteer"} Login
            </CardTitle>
            <CardDescription className="text-center">
              <span>Access the digital health record system</span>
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-blue-600 ml-2"
                onClick={() => setSelectedRole(null)}
              >
                Change Role
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={selectedRole === "ADMIN" ? APP_CONFIG.DEMO_ACCOUNTS.ADMIN.EMAIL : APP_CONFIG.DEMO_ACCOUNTS.VOLUNTEER.EMAIL}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  required
                />
              </div>

              {selectedRole !== 'VOLUNTEER' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError('');
                      }}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {selectedRole === 'VOLUNTEER' && (
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="YYYY-MM-DD"
                    required={selectedRole === 'VOLUNTEER'}
                  />
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={formLoading}>
                {formLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">Demo Account:</p>
              <div className="mt-2 text-xs text-gray-500">
                {selectedRole === "ADMIN" ? (
                  <p>Admin: {APP_CONFIG.DEMO_ACCOUNTS.ADMIN.EMAIL} / {APP_CONFIG.DEMO_ACCOUNTS.ADMIN.PASSWORD}</p>
                ) : (
                  <p>Volunteer: {APP_CONFIG.DEMO_ACCOUNTS.VOLUNTEER.EMAIL} / {APP_CONFIG.DEMO_ACCOUNTS.VOLUNTEER.DOB}</p>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                <p>API URL: {APP_CONFIG.API.BASE_URL}</p>
              </div>
            </div>

            <div className="mt-4 text-center space-y-2">
              <Link href="/" className="text-sm text-blue-600 hover:underline">
                ← Back to Homepage
              </Link>
              <div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    clearAuth();
                    setError('');
                    setEmail('');
                    setPassword('');
                    setDob('');
                  }}
                  className="text-xs"
                >
                  Clear Auth & Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
