// Application configuration constants
export const APP_CONFIG = {
  // Organization information
  ORGANIZATION: {
    NAME: "Sarada Valley Development Samithi",
    SHORT_NAME: "SVDS",
    EMAIL: "admin@svds.org",
    PHONE: "+91 98765 43210",
    ADDRESS: "Sarada Village, Andhra Pradesh, India",
  },
  
  // API Configuration
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    TIMEOUT: 10000, // 10 seconds
  },
  
  // Authentication
  AUTH: {
    TOKEN_KEY: "auth_token",
    TOKEN_EXPIRY: "7d",
  },
  
  // User roles
  ROLES: {
    ADMIN: "ADMIN",
    VOLUNTEER: "VOLUNTEER", 
    PATIENT: "PATIENT",
  } as const,
  
  // Patient priorities
  PRIORITIES: {
    HIGH: "High",
    MEDIUM: "Medium", 
    LOW: "Low",
  } as const,
  
  // Volunteer statuses
  VOLUNTEER_STATUS: {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    PENDING: "PENDING",
  } as const,
  
  // Visit statuses
  VISIT_STATUS: {
    SCHEDULED: "SCHEDULED",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
    MISSED: "MISSED",
  } as const,
  
  // Demo accounts
  DEMO_ACCOUNTS: {
    ADMIN: {
      EMAIL: "pushkal@test.com",
      PASSWORD: "pass-123456",
    },
    VOLUNTEER: {
      EMAIL: "matchapushkal@gmail.com",
      DOB: "30/10/2005",
    },
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  
  // File upload limits
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ["image/jpeg", "image/png", "application/pdf"],
  },
  
  // Notification settings
  NOTIFICATIONS: {
    AUTO_DISMISS_DELAY: 5000, // 5 seconds
    MAX_NOTIFICATIONS: 50,
  },
} as const

// Type definitions for better type safety
export type UserRole = typeof APP_CONFIG.ROLES[keyof typeof APP_CONFIG.ROLES]
export type PatientPriority = typeof APP_CONFIG.PRIORITIES[keyof typeof APP_CONFIG.PRIORITIES]
export type VolunteerStatus = typeof APP_CONFIG.VOLUNTEER_STATUS[keyof typeof APP_CONFIG.VOLUNTEER_STATUS]
export type VisitStatus = typeof APP_CONFIG.VISIT_STATUS[keyof typeof APP_CONFIG.VISIT_STATUS]
