import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const { token, login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            const response = await client.post('/login', {
                email,
                password,
            })

            login(response.data)

            navigate('/')
        } catch (error) {
            console.error('LOGIN ERROR:', error.response?.data || error.message)
            setError('Incorrect email or password')
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
                <h1 className="text-2xl font-semibold mb-6">Login to Vinsky</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                        <p className="text-sm text-red-600 ms-1">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="rounded-lg bg-black text-white text-sm font-medium py-2 mt-2 border border-black hover:cursor-pointer"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm mt-4">
                    I don't have an account.{' '}
                    <Link to="/register" className="font-medium underline">
                        Register now
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login