import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getMe } from '../services/userService'
import { createOrchestra } from '../services/orchestraService'
import client from '../api/client'

function Sidebar() {
    const { user, token, logout, updateUser } = useAuth()
    const navigate = useNavigate()

    const [memberships, setMemberships] = useState([])
    const [orchestras, setOrchestras] = useState([])

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [form, setForm] = useState({ name: '', location: '' })
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState(null)

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

    const fetchData = async () => {
        try {
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

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (user && !user.email) {
            getMe()
                .then((me) => updateUser({ email: me.email }))
                .catch((error) => console.error('Sidebar getMe error:', error))
        }
    }, [user])

    const openCreateModal = () => {
        setForm({ name: '', location: '' })
        setError(null)
        setShowCreateModal(true)
    }

    const handleCreate = async () => {
        setIsSaving(true)
        setError(null)

        try {
            await createOrchestra(form)
            await fetchData()
            setShowCreateModal(false)
        } catch (err) {
            console.error('Create orchestra error:', err)
            setError(err?.response?.data?.message ?? 'Failed to create orchestra')
        } finally {
            setIsSaving(false)
        }
    }

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

            <div>
                <h4>My Orchestras</h4>

                {adminOrchestras.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {adminOrchestras.map((orch) => (
                            <li key={orch.id}>
                                <Link to={`/orchestras/${orch.id}`}>
                                    {orch.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                <button type="button" onClick={openCreateModal} style={{ marginTop: '8px' }}>
                    + Add orchestra
                </button>
            </div>

            <hr />

            {user && (
                <Link
                    to="/profile"
                    style={{
                        display: 'block',
                        marginTop: '1rem',
                        marginBottom: '1rem',
                        textDecoration: 'none',
                        color: 'inherit'
                    }}
                >
                    <strong>{user.name} {user.last_name}</strong>
                    <div style={{ fontSize: '0.85rem', opacity: 0.75 }}>
                        {user.email}
                    </div>
                </Link>
            )}

            {token && (
                <button onClick={handleLogout}>
                    Logout
                </button>
            )}

            {showCreateModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.4)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{
                        background: 'white', padding: '1rem', width: '320px',
                        display: 'flex', flexDirection: 'column', gap: '0.5rem'
                    }}>
                        <h3>Create orchestra</h3>

                        <label>
                            Name
                            <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                disabled={isSaving}
                            />
                        </label>

                        <label>
                            Location
                            <input
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                disabled={isSaving}
                            />
                        </label>

                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={handleCreate} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Create'}
                            </button>
                            <button onClick={() => setShowCreateModal(false)} disabled={isSaving}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </aside>
    )
}

export default Sidebar