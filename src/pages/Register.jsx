import { useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import FormInput from '../components/FormInput'

function Register() {
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [registered, setRegistered] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError(null)
        setLoading(true)

        try {
            await client.post('/register', {
                name,
                last_name: lastName,
                email,
                password,
                password_confirmation: passwordConfirmation,
            })

            setRegistered(true)
        } catch (err) {
            console.error('REGISTER ERROR:', err.response?.data || err.message)
            setError(err.response?.data?.message ?? 'Failed to register')
        } finally {
            setLoading(false)
        }
    }

    if (registered) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="w-full max-w-sm">
                    <h1 className="text-2xl font-semibold mb-6 ms-1">
                        Check your email!
                    </h1>

                    <p className="text-sm text-gray-600 mb-6 ms-1">
                        We've sent a verification link to <strong>{email}</strong>.
                        Please verify your email address before logging in.
                    </p>

                    <Link
                        to="/login"
                        className="block text-center rounded-lg bg-black text-white text-sm font-medium py-2 border border-black hover:cursor-pointer"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-semibold mb-6 ms-1">
                    Create a Vinsky account
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <FormInput
                        label="Name"
                        value={name}
                        disabled={loading}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <FormInput
                        label="Last name"
                        value={lastName}
                        disabled={loading}
                        onChange={(e) => setLastName(e.target.value)}
                    />

                    <FormInput
                        label="Email"
                        type="email"
                        value={email}
                        disabled={loading}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <FormInput
                        label="Password"
                        type="password"
                        value={password}
                        disabled={loading}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <FormInput
                        label="Confirm password"
                        type="password"
                        value={passwordConfirmation}
                        disabled={loading}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                    />

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg border border-black bg-black text-white text-sm font-medium py-2 mt-2 hover:cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Register'}
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