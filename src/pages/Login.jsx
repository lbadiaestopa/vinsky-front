import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FormInput from '../components/FormInput'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { token, login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            setIsSubmitting(true)

            await login(email, password)

            navigate('/')
        } catch {
            setError('Incorrect email or password')
        } finally {
            setIsSubmitting(false)
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
                <h1 className="text-2xl font-semibold mb-6 ms-1">
                    Login to Vinsky
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <FormInput
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        value={email}
                        autoComplete="email"
                        required
                        disabled={isSubmitting}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <FormInput
                        label="Password"
                        type="password"
                        value={password}
                        autoComplete="current-password"
                        required
                        disabled={isSubmitting}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <p className="text-sm text-red-600 ms-1">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-black text-white text-sm font-medium py-2 mt-2 border border-black hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-sm mt-4">
                    I don't have an account.{` `}
                    <Link to="/register" className="font-medium underline">
                        Register now
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login