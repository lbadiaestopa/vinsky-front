import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import { useEffect } from 'react'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { token } = useAuth()
    const navigate = useNavigate()

    const { login } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await client.post('/login', {
                email,
                password,
            })

            login(response.data)

            navigate('/')
        } catch (error) {
            console.error('LOGIN ERROR:', error.response?.data || error.message)
        }
    }

    useEffect(() => {
        if (token) {
            navigate('/')
        }
    }, [token])

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email</label>
                    <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label>Password</label>
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login