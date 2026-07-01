import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getMe } from '../services/userService'
import client from '../api/client'

function Sidebar() {
    const { user, token, logout } = useAuth()
    const navigate = useNavigate()

    const [memberships, setMemberships] = useState([])
    const [orchestras, setOrchestras] = useState([])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const adminOrchestraIds = memberships
        .filter((m) => m.role === 'admin')
        .map((m) => m.orchestra.id)

    const adminOrchestras = orchestras.filter((o) =>
        adminOrchestraIds.includes(o.id)
    )

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getMe()

                const membershipsRes = await client.get('/memberships')
                const membershipsData =
                    membershipsRes.data.data ?? membershipsRes.data

                setMemberships(membershipsData)

                const orchestrasRes = await client.get('/orchestras')
                const orchestrasData =
                    orchestrasRes.data.data ?? orchestrasRes.data

                setOrchestras(orchestrasData)

            } catch (error) {
                console.error('Sidebar load error:', error)
            }
        }

        fetchData()
    }, [])

    return (
        <aside style={{
            width: '250px',
            padding: '1rem',
            borderRight: '1px solid #ddd'
        }}>

            <nav>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </ul>
            </nav>

            <hr />

            {adminOrchestras.length > 0 && (
                <div>
                    <h4>My Orchestras</h4>

                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {adminOrchestras.map((orch) => (
                            <li key={orch.id}>
                                <Link to={`/orchestras/${orch.id}`}>
                                    {orch.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {user && (
                <div style={{ marginBottom: '1rem' }}>
                    <strong>{user.name} {user.last_name}</strong>
                </div>
            )}

            {token && (
                <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
                    Logout
                </button>
            )}

        </aside>
    )
}

export default Sidebar