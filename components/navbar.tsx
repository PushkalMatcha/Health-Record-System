"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Heart, Menu, X, Bell } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { User } from "@/types"

interface NavbarProps {
  user?: User | null
}

function Navbar({ user }: NavbarProps) {
  const auth = useAuth()
  // prefer passed-in user prop, but fall back to auth context user
  const effectiveUser = user ?? auth.user

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isAdmin = effectiveUser?.role === "ADMIN"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    auth.logout()
    router.push("/login")
  }

  const publicNavItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Services", href: "/#services" },
  ]

  const adminNavItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Patients", href: "/patients" },
    { name: "Volunteers", href: "/volunteers" },
    { name: "Reports", href: "/reports" },
  ]

  const volunteerNavItems = [
    { name: "Dashboard", href: "/volunteer" },
    { name: "Patients", href: "/volunteer/patients" },
  ]

  const navItems = effectiveUser ? (isAdmin ? adminNavItems : volunteerNavItems) : publicNavItems

  return (
    <nav
      className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b z-[9999] transition-all duration-300 ${
        isScrolled ? "shadow-lg border-gray-200" : "shadow-sm border-gray-100"
      }`}
      style={{ position: "fixed", top: 0, width: "100%" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 group transition-transform hover:scale-105">
            <div className="p-1 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">SVDS</h1>
              <p className="text-xs text-gray-600">Health Record System</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 ${
                  pathname === item.href ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {effectiveUser ? (
              <>
                <div className="text-right px-3 py-1 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">{effectiveUser?.name}</p>
                  <p className="text-xs text-blue-600 font-medium">{effectiveUser?.role}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors bg-transparent"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all">
                  Staff Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="hover:bg-blue-50">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t bg-white/95 backdrop-blur-md shadow-lg rounded-b-lg">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {effectiveUser ? (
                <div className="px-3 py-3 border-t mt-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{effectiveUser?.name}</p>
                  <p className="text-xs text-blue-600 font-medium mb-3">{effectiveUser?.role}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors bg-transparent"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="px-3 py-3 border-t mt-4">
                  <Link href="/login">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm">Staff Login</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export { Navbar }
export default Navbar
