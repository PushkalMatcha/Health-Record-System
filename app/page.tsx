import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Activity, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Transforming Rural Healthcare</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            SVDS is dedicated to improving healthcare access and outcomes in rural communities through innovative
            digital health solutions and community-driven initiatives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#services">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Our Services
              </Button>
            </Link>
            <Link href="#impact">
              <Button size="lg" variant="outline">
                View Impact
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">About SVDS</h3>
            <p className="text-lg text-gray-600">
              {/* Placeholder for new About content - user will provide updated text */}
              [New About section content will be added here - please provide the updated text for this section]
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Healthcare Services</h3>
            <p className="text-lg text-gray-600">Comprehensive healthcare solutions for rural communities</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Community Health Programs</CardTitle>
                <CardDescription>
                  Preventive care and health education programs reaching remote villages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Health screenings and checkups</li>
                  <li>• Vaccination drives</li>
                  <li>• Maternal and child health</li>
                  <li>• Nutrition programs</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Activity className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Digital Health Records</CardTitle>
                <CardDescription>
                  Secure, comprehensive health record management for better care coordination
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Electronic health records</li>
                  <li>• Treatment history tracking</li>
                  <li>• Medication management</li>
                  <li>• Care team coordination</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Health Analytics</CardTitle>
                <CardDescription>Data-driven insights to improve community health outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Population health trends</li>
                  <li>• Disease surveillance</li>
                  <li>• Resource allocation</li>
                  <li>• Impact measurement</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h3>
            <p className="text-lg text-gray-600">Making a difference in rural healthcare</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">15,000+</div>
              <div className="text-gray-600">Patients Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Villages Reached</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">200+</div>
              <div className="text-gray-600">Health Workers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-3 mb-4">
                <Heart className="h-8 w-8 text-blue-400" />
                <div>
                  <h4 className="text-lg font-bold">SVDS</h4>
                  <p className="text-sm text-gray-400">Sarada Valley Development Samithi</p>
                </div>
              </Link>
              <p className="text-gray-400 text-sm">
                Dedicated to improving healthcare access in rural communities through innovation and compassion.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Community Health</li>
                <li>Digital Records</li>
                <li>Health Analytics</li>
                <li>Training Programs</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">About</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Our Mission</li>
                <li>Team</li>
                <li>Partners</li>
                <li>Annual Reports</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <div className="space-y-2 text-sm text-gray-400">
                <p>[Updated contact details will be added here - please provide new information]</p>
                <p>contact@svds.org</p>
                <p>+91 98765 43210</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Sarada Valley Development Samithi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
