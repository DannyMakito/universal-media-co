"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type Role = "admin" | "client" | "editor"

interface AuthContextType {
    user: { name: string; email: string } | null
    role: Role | null
    loading: boolean
    login: (role: Role) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<{ name: string; email: string } | null>(null)
    const [role, setRole] = useState<Role | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Simulate fetching user from session/localstorage
        const savedRole = localStorage.getItem("user-role") as Role | null
        if (savedRole) {
            setRole(savedRole)
            setUser({ name: "Satnaing", email: "satnaingdev@gmail.com" })
        }
        setLoading(false)
    }, [])

    const login = (selectedRole: Role) => {
        setRole(selectedRole)
        setUser({ name: "Satnaing", email: "satnaingdev@gmail.com" })
        localStorage.setItem("user-role", selectedRole)
        router.push("/dashboard")
    }

    const logout = () => {
        setRole(null)
        setUser(null)
        localStorage.removeItem("user-role")
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ user, role, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
