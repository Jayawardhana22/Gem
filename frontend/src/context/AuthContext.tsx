import { createContext, useContext, useState, ReactNode } from 'react'
import { api } from '../services/api'

interface AuthUser {
  email: string
  fullName: string
  roles: string[]
}

interface AuthContextType {
  user: AuthUser | null
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string, country: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('gem_user')
    return stored ? JSON.parse(stored) : null
  })

  function persist(token: string, authUser: AuthUser) {
    localStorage.setItem('gem_token', token)
    localStorage.setItem('gem_user', JSON.stringify(authUser))
    setUser(authUser)
  }

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password })
    persist(data.token, { email: data.email, fullName: data.fullName, roles: data.roles })
  }

  async function register(fullName: string, email: string, password: string, country: string) {
    const { data } = await api.post('/auth/register', { fullName, email, password, country })
    persist(data.token, { email: data.email, fullName: data.fullName, roles: data.roles })
  }

  function logout() {
    localStorage.removeItem('gem_token')
    localStorage.removeItem('gem_user')
    setUser(null)
  }

  const isAdmin = !!user?.roles.includes('Admin')

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
