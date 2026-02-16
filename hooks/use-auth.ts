"use client"

import React, { useState, useEffect, createContext, useContext } from "react"
import { APP_CONFIG } from "@/lib/config"
import { User } from "@/types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, dob?: string) => Promise<boolean>
  logout: () => void
  clearAuth: () => void
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Provider component to supply auth state to the app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const state = useAuthState()

  // Avoid JSX in .ts file - use createElement so this file can stay .ts
  return React.createElement(AuthContext.Provider, { value: state as AuthContextType }, children)
}

// Mock authentication hook - replace with real authentication
export function useAuthState() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem(APP_CONFIG.AUTH.TOKEN_KEY);
        console.log('Auth check - Token found:', !!token);
        
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        console.log('Auth check - Validating token with API...');
        const response = await fetch(`${APP_CONFIG.API.BASE_URL}/api/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          console.log('Auth check - Token validation failed:', response.status);
          throw new Error('Auth check failed');
        }

        const data = await response.json();
        console.log('Auth check - User data received:', data);
        
        const user: User = {
          id: data.user.id,
          name: data.user.email.split('@')[0], // Temporary name from email
          email: data.user.email,
          role: data.user.role as User['role'],
          createdAt: new Date(data.user.createdAt || Date.now()),
        };
        
        setUser(user);
        console.log('Auth check - User set successfully');
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear invalid token and user state
        localStorage.removeItem(APP_CONFIG.AUTH.TOKEN_KEY);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [])

  const login = async (email: string, password?: string, dob?: string): Promise<boolean> => {
    try {
      let body: any
      if (dob) {
        body = { email, dob }
      } else {
        body = { email, password }
      }

      const response = await fetch(`${APP_CONFIG.API.BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      
      // Store token in localStorage
      localStorage.setItem(APP_CONFIG.AUTH.TOKEN_KEY, data.token);
      
      const user: User = {
        id: data.user.id,
        name: data.user.email.split('@')[0], // Temporary name from email
        email: data.user.email,
        role: data.user.role as User['role'],
        createdAt: new Date(data.user.createdAt || Date.now()),
      };
      
      setUser(user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      // Re-throw the error so the login page can display it
      throw error;
    }
  }

  const logout = () => {
    console.log('Logout - Clearing token and user state');
    localStorage.removeItem(APP_CONFIG.AUTH.TOKEN_KEY);
    setUser(null);
  }

  const clearAuth = () => {
    console.log('Clear auth - Forcing logout');
    localStorage.removeItem(APP_CONFIG.AUTH.TOKEN_KEY);
    setUser(null);
  }

  return {
    user,
    login,
    logout,
    clearAuth,
    isLoading,
  }
}
