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
        <>
            <aside className="w-80 min-h-screen bg-white border-r border-gray pb-4 pt-2 pl-4 pr-4 flex flex-col">

                <nav>
                    <ul className="list-none p-0">
                        <li>
                            <Link to="/" className="block text-sm w-full text-left rounded-lg py-2 px-4 hover:bg-card-gray transition-all">Home</Link>
                        </li>
                    </ul>
                </nav>

                <hr className="border-gray mb-4 mt-2 -mr-4 -ml-8" />

                <div className="flex-1 min-h-0 flex flex-col">
                    <h4 className="text-sm font-semibold mb-2 px-4">My Orchestras</h4>

                    {adminOrchestras.length > 0 && (
                        <ul className="flex-1 min-h-0 overflow-y-auto list-none p-0 flex flex-col gap-1">
                            {adminOrchestras.map((orch) => (
                                <li key={orch.id}>
                                    <Link to={`/orchestras/${orch.id}`} className="block text-sm rounded-lg px-4 py-2 hover:bg-card-gray transition-all">
                                        {orch.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    <hr className="border-gray my-2 -mr-4 -ml-8" />

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="text-sm rounded-lg py-1.5 px-3 w-full text-left hover:cursor-pointer hover:px-4 hover:bg-card-gray transition-all focus:outline-none flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-base!">add_2</span>
                        Add orchestra
                    </button>
                </div>

                <hr className="border-gray my-2 -mr-4 -ml-8" />

                {user && (
                    <Link
                        to="/profile"
                        className="block no-underline rounded-lg py-2 px-4 text-black hover:bg-card-gray transition-all"
                    >
                        <strong className="text-sm font-semibold">{user.name} {user.last_name}</strong>
                        <div className="text-sm opacity-75">
                            {user.email}
                        </div>
                    </Link>
                )}

                {token && (
                    <button
                        onClick={handleLogout}
                        className="text-sm rounded-lg py-1.5 px-3 w-full text-left hover:cursor-pointer hover:px-4 hover:bg-card-gray transition-all focus:outline-none flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-base!">logout</span>
                        Logout
                    </button>
                )}
            </aside>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 px-4">
                    <div className="bg-white rounded-lg p-4 w-full max-w-sm flex flex-col gap-3 border border-gray">
                        <h3 className="text-base font-semibold ms-1">Create orchestra</h3>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm ms-1">Name</span>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                disabled={isSaving}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm ms-1">Location</span>
                            <input
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                disabled={isSaving}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none"
                            />
                        </label>

                        {error && <p className="text-sm text-red">{error}</p>}

                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                disabled={isSaving}
                                className="flex-1 rounded-lg text-sm py-2 border border-gray hover:cursor-pointer focus:outline-none"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={isSaving}
                                className="flex-1 rounded-lg border border-black bg-black text-white text-sm py-2 hover:cursor-pointer focus:outline-none"
                            >
                                {isSaving ? 'Saving...' : 'Create'}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Sidebar