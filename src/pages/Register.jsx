import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'

function Register() {
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const { token, login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            const response = await client.post('/register', {
                name,
                last_name: lastName,
                email,
                password,
            })

            login(response.data)

            navigate('/')
        } catch (err) {
            console.error('REGISTER ERROR:', err.response?.data || err.message)
            setError(err.response?.data?.message ?? 'Failed to register')
        }
    }

    useEffect(() => {
        if (token) {
            navigate('/')
        }
    }, [token])

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-semibold mb-6">Create a Vinsky account</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium ms-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium ms-1">Last name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium ms-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium ms-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="rounded-lg border border-black bg-black text-white text-sm font-medium py-2 mt-2 hover:bg-gray-800 transition-colors focus:outline-none"
                    >
                        Register
                    </button>
                </form>

                <p className="text-sm mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register