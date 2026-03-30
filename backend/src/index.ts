import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

// Types for middleware
type RequestWithUser = express.Request & { 
  user?: { 
    userId: string
    role: string 
  } 
}

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = Number(process.env.PORT) || 4000

// Simple JWT auth middleware
const authMiddleware = (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
  const header = req.headers?.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : header
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  const secret = process.env.JWT_SECRET
  if (!secret) return res.status(500).json({ error: 'JWT secret not configured' })

  try {
    const payload = jwt.verify(token, secret) as { userId: string; role: string }
    req.user = payload
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Role-based middleware for admin-only routes
const isAdmin = (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  return next()
}

const getParamAsString = (param: string | string[] | undefined): string | null => {
  if (typeof param === 'string') return param
  if (Array.isArray(param) && param.length > 0) return param[0]
  return null
}

app.get('/', async (req, res) => {
  const users = await prisma.user.findMany({ take: 5 })
  res.json({ status: 'ok', users })
})

app.get('/api/llm', (req, res) => {
  const model = process.env.LLM_MODEL || 'none'
  res.json({ llmModel: model })
})

// Auth: register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'User already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: role || 'PATIENT',
      },
      select: { id: true, email: true, role: true, createdAt: true }
    })

    const secret = process.env.JWT_SECRET
    if (!secret) return res.status(500).json({ error: 'JWT secret not configured' })

    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '7d' })

    res.status(201).json({ user, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Auth: login 
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, dob } = req.body
    if (!email || (!password && !dob)) return res.status(400).json({ error: 'email and password or dob required' })

    const user = await prisma.user.findUnique({ where: { email }, include: { volunteer: true } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    // If the user is a volunteer, allow DOB-based login: compare provided dob (YYYY-MM-DD)
    if (user.role === 'VOLUNTEER') {
      const volunteer = user.volunteer
      if (!volunteer || !volunteer.dateOfBirth) {
        return res.status(401).json({ error: 'Volunteer record incomplete' })
      }

      if (!dob) {
        return res.status(400).json({ error: 'DOB required for volunteer login' })
      }

      // Compare only date portion
      const provided = new Date(dob)
      const stored = new Date(volunteer.dateOfBirth)
      const providedDate = new Date(provided.getFullYear(), provided.getMonth(), provided.getDate()).toISOString()
      const storedDate = new Date(stored.getFullYear(), stored.getMonth(), stored.getDate()).toISOString()

      if (providedDate !== storedDate) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }
    } else {
      // Non-volunteer: normal password auth
      if (!password) return res.status(400).json({ error: 'Password required' })
      const ok = await bcrypt.compare(password, user.password)
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) return res.status(500).json({ error: 'JWT secret not configured' })

    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '7d' })

    const safeUser = { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt }
    res.json({ user: safeUser, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Protected route: return current user
app.get('/api/me', authMiddleware, async (req: RequestWithUser, res: express.Response) => {
  try {
    const userId = req.user?.userId
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, createdAt: true }
    })

    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Protected admin routes
app.get('/api/admin/users', authMiddleware, isAdmin, async (req: RequestWithUser, res: express.Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        volunteer: { select: { firstName: true, lastName: true } },
        patient: { select: { firstName: true, lastName: true } }
      }
    })
    res.json({ users })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/admin/stats', authMiddleware, isAdmin, async (req: RequestWithUser, res: express.Response) => {
  try {
    const [usersCount, volunteersCount, patientsCount, visitsCount] = await Promise.all([
      prisma.user.count(),
      prisma.volunteer.count(),
      prisma.patient.count(),
      prisma.visit.count()
    ])

    // Get visits by status
    const visitsByStatus = await prisma.visit.groupBy({
      by: ['status'],
      _count: true
    })

    type StatusCounts = { [key: string]: number }
    type VisitStatus = { status: string; _count: number }

    res.json({
      counts: {
        users: usersCount,
        volunteers: volunteersCount,
        patients: patientsCount,
        visits: visitsCount
      },
      visitsByStatus: visitsByStatus.reduce<StatusCounts>((acc: StatusCounts, { status, _count }: VisitStatus) => ({
        ...acc,
        [status.toLowerCase()]: _count
      }), {})
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get all volunteers
app.get('/api/volunteers', async (req, res) => {
  try {
    const volunteers = await prisma.volunteer.findMany({
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    })

    // Transform the data to match frontend expectations
    const transformedVolunteers = volunteers.map((v: any) => ({
      id: v.id,
      name: `${v.firstName} ${v.lastName}`.trim(),
      email: v.user.email,
      phone: v.phone,
      village: v.village || '',
      specialization: v.specialties?.[0] || '',
      status: v.status
    }))

    res.json({ volunteers: transformedVolunteers })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch volunteers' })
  }
})

// Create Volunteer (creates User + Volunteer)
app.post('/api/volunteers', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      village,
      specialization,
      dob,
      address,
      emergencyContact,
    } = req.body

    if (!email || !name) return res.status(400).json({ error: 'name and email required' })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'User already exists' })

    // Create a random password (volunteers will authenticate using DOB)
    const randomPass = Math.random().toString(36).slice(-10)
    const hashed = await bcrypt.hash(randomPass, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: 'VOLUNTEER',
      },
      select: { id: true, email: true }
    })

    const [firstName, ...rest] = name.split(' ')
    const lastName = rest.join(' ') || ''

    const volunteer = await prisma.volunteer.create({
      data: {
        userId: user.id,
        firstName: firstName,
        lastName: lastName,
        phone: phone || '',
        village: village || '',
        address: address || '',
        emergencyContact: emergencyContact || {},
        specialties: specialization ? [specialization] : [],
        availability: {},
        dateOfBirth: dob ? new Date(dob) : undefined,
        status: 'ACTIVE',
      } as any
    })

    res.status(201).json({ user, volunteer })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get volunteer by ID
app.get('/api/volunteers/:id', async (req, res) => {
  try {
    const rawId = req.params.id
    const id = Array.isArray(rawId) ? rawId[0] : rawId
    if (!id) return res.status(400).json({ error: 'Invalid volunteer id' })
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: id as string },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    })

    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer not found' })
    }

    // Transform the data to match frontend expectations
    const transformedVolunteer = {
      id: volunteer.id,
      name: `${volunteer.firstName} ${volunteer.lastName}`.trim(),
      email: volunteer.user.email,
      phone: volunteer.phone,
      village: (volunteer as any).village || '',
      address: (volunteer as any).address || '',
      specialization: volunteer.specialties?.[0] || '',
      status: volunteer.status,
      dateOfBirth: volunteer.dateOfBirth,
      emergencyContact: (volunteer as any).emergencyContact || null
    }

    res.json({ volunteer: transformedVolunteer })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch volunteer' })
  }
})

// Update volunteer
app.put('/api/volunteers/:id', authMiddleware, async (req: RequestWithUser, res: express.Response) => {
  try {
    console.log('=== VOLUNTEER UPDATE REQUEST ===')
    console.log('Volunteer ID:', req.params.id)
    console.log('Request body:', req.body)
    console.log('User from auth:', req.user)
    
    const rawId = req.params.id
    const id = Array.isArray(rawId) ? rawId[0] : rawId
    if (!id) return res.status(400).json({ error: 'Invalid volunteer id' })
    const { firstName, lastName, email, phone, village, specialization, status, dateOfBirth, address, emergencyContact } = req.body

    // First get the volunteer to find the associated user
    console.log('Looking for volunteer with ID:', id)
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: id as string },
      select: { userId: true }
    })

    if (!volunteer) {
      console.log('Volunteer not found')
      return res.status(404).json({ error: 'Volunteer not found' })
    }

    console.log('Found volunteer, userId:', volunteer.userId)

    // Update user email if provided
    if (email) {
      console.log('Updating user email to:', email)
      await prisma.user.update({
        where: { id: volunteer.userId },
        data: { email }
      })
    }

    // Update volunteer data
    console.log('Updating volunteer data:', {
      firstName,
      lastName,
      phone,
      village,
      specialization,
      status,
      dateOfBirth,
      address,
      emergencyContact
    })
    
    const updatedVolunteer = await prisma.volunteer.update({
      where: { id: id as string },
      data: {
        firstName,
        lastName,
        phone,
        village,
        address,
        emergencyContact,
        specialties: specialization ? [specialization] : [],
        status,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      } as any,
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    })

    console.log('Volunteer updated successfully:', updatedVolunteer.id)

    // Transform the response
    const transformedVolunteer = {
      id: updatedVolunteer.id,
      name: `${updatedVolunteer.firstName} ${updatedVolunteer.lastName}`.trim(),
      email: (updatedVolunteer as any).user.email,
      phone: updatedVolunteer.phone,
      village: (updatedVolunteer as any).village || '',
      specialization: updatedVolunteer.specialties?.[0] || '',
      status: updatedVolunteer.status,
      dateOfBirth: updatedVolunteer.dateOfBirth,
      address: (updatedVolunteer as any).address,
      emergencyContact: (updatedVolunteer as any).emergencyContact
    }

    console.log('Sending response:', transformedVolunteer)
    res.json({ volunteer: transformedVolunteer })
  } catch (err) {
    console.error('=== VOLUNTEER UPDATE ERROR ===')
    console.error('Error details:', err)
    console.error('Error message:', err instanceof Error ? err.message : 'Unknown error')
    console.error('Error stack:', err instanceof Error ? err.stack : 'No stack trace')
    res.status(500).json({ error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown error' })
  }
})

// Get all patients
app.get('/api/patients', authMiddleware, async (req: RequestWithUser, res: express.Response) => {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      }
    })

    // Transform the data to match frontend expectations
    const transformedPatients = patients.map((p: any) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`.trim(),
      email: p.user.email,
      age: new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear(),
      gender: (p.medicalHistory as any)?.gender || 'Other',
      village: p.address?.split(',')[1]?.trim() || 'Unknown',
      phoneNumber: p.phone,
      bloodGroup: (p.medicalHistory as any)?.bloodGroup || 'Unknown',
      lastVisit: p.updatedAt.toISOString().split('T')[0],
      priority: (p.medicalHistory as any)?.priority || 'Medium',
      chronicConditions: (p.medicalHistory as any)?.chronicConditions || [],
      allergies: (p.medicalHistory as any)?.allergies || [],
      emergencyContact: (p.emergencyContact as any)?.name || 'Unknown',
      emergencyPhone: (p.emergencyContact as any)?.phone || 'Unknown',
      registeredDate: p.createdAt.toISOString().split('T')[0],
      address: p.address,
      notes: (p.medicalHistory as any)?.notes || '',
      currentMedications: (p.medicalHistory as any)?.currentMedications || ''
    }))

    res.json({ patients: transformedPatients })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get patient by ID
app.get('/api/patients/:id', authMiddleware, async (req: RequestWithUser, res: express.Response) => {
  try {
    const rawId = req.params.id
    const id = Array.isArray(rawId) ? rawId[0] : rawId
    if (!id) return res.status(400).json({ error: 'Invalid patient id' })
    const patient = await prisma.patient.findUnique({
      where: { id: id as string },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
          }
        },
        records: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' })
    }

    // Transform the data to match frontend expectations
    const transformedPatient = {
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`.trim(),
      email: patient.user.email,
      age: new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear(),
      gender: (patient.medicalHistory as any)?.gender || 'Other',
      village: patient.address?.split(',')[1]?.trim() || 'Unknown',
      phoneNumber: patient.phone,
      bloodGroup: (patient.medicalHistory as any)?.bloodGroup || 'Unknown',
      lastVisit: patient.updatedAt.toISOString().split('T')[0],
      priority: (patient.medicalHistory as any)?.priority || 'Medium',
      chronicConditions: (patient.medicalHistory as any)?.chronicConditions || [],
      allergies: (patient.medicalHistory as any)?.allergies || [],
      emergencyContact: (patient.emergencyContact as any)?.name || 'Unknown',
      emergencyPhone: (patient.emergencyContact as any)?.phone || 'Unknown',
      registeredDate: patient.createdAt.toISOString().split('T')[0],
      address: patient.address,
      notes: (patient.medicalHistory as any)?.notes || '',
      currentMedications: (patient.medicalHistory as any)?.currentMedications || ''
    }

    res.json({ patient: transformedPatient })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create new patient
app.post('/api/patients', authMiddleware, async (req: RequestWithUser, res: express.Response) => {
  try {
    console.log('Creating patient with data:', req.body)
    const { firstName, lastName, email, password, dateOfBirth, address, phone, emergencyContact, medicalHistory } = req.body

    if (!firstName || !lastName || !email || !password || !dateOfBirth || !address || !phone) {
      console.log('Missing required fields:', { firstName, lastName, email, password, dateOfBirth, address, phone })
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      console.log('User already exists:', email)
      return res.status(409).json({ error: 'User with this email already exists' })
    }

    // Create user account
    console.log('Creating user account...')
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'PATIENT'
      }
    })
    console.log('User created:', user.id)

    // Create patient profile
    console.log('Creating patient profile...')
    const patient = await prisma.patient.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        address,
        phone,
        emergencyContact: emergencyContact || {},
        medicalHistory: medicalHistory || {}
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      }
    })
    console.log('Patient created:', patient.id)

    res.status(201).json({ patient })
  } catch (err) {
    console.error('Error creating patient:', err)
    res.status(500).json({ error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown error' })
  }
})

// Update patient
app.put('/api/patients/:id', authMiddleware, async (req: RequestWithUser, res: express.Response) => {
  try {
    const rawId = req.params.id
    const id = Array.isArray(rawId) ? rawId[0] : rawId
    if (!id) return res.status(400).json({ error: 'Invalid patient id' })
    const { firstName, lastName, dateOfBirth, address, phone, emergencyContact, medicalHistory } = req.body

    const patient = await prisma.patient.update({
      where: { id: id as string },
      data: {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        address,
        phone,
        emergencyContact,
        medicalHistory
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      }
    })

    res.json({ patient })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete patient
app.delete('/api/patients/:id', authMiddleware, isAdmin, async (req: RequestWithUser, res: express.Response) => {
  try {
    const rawId = req.params.id
    const id = Array.isArray(rawId) ? rawId[0] : rawId
    if (!id) return res.status(400).json({ error: 'Invalid patient id' })

    // First get the patient to find the associated user
    const patient = await prisma.patient.findUnique({
      where: { id: id as string },
      include: {
        user: true
      }
    })

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' })
    }

    // Delete patient and associated user
    await prisma.patient.delete({ where: { id: id as string } })
    await prisma.user.delete({ where: { id: patient.user.id } })

    res.json({ message: 'Patient deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend listening on http://0.0.0.0:${PORT}`)
})
