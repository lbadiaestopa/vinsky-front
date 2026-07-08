import { createContext, useContext, useState, useEffect } from 'react'
import client from '../api/client'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('token')

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser))
            setToken(storedToken)
        }

        setLoading(false)
    }, [])

    const persistSession = (data) => {
        setUser(data.user)
        setToken(data.token)

        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
    }

    const login = async (email, password) => {
        const response = await client.post('/login', {
            email,
            password,
        })

        persistSession(response.data)

        return response.data
    }

    const logout = () => {
        setUser(null)
        setToken(null)

        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    const updateUser = (updatedFields) => {
        setUser((prev) => {
            const next = { ...prev, ...updatedFields }
            localStorage.setItem('user', JSON.stringify(next))
            return next
        })
    }

    const value = {
        user,
        token,
        login,
        logout,
        updateUser,
        persistSession,
        loading,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}