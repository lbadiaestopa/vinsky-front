import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import client from '../api/client'
import { getPrograms, createProgram } from '../services/programService'
import { updateOrchestra, deleteOrchestra } from '../services/orchestraService'
import ProgramCard from '../components/ProgramCard'
import MemberList from '../components/MemberList'
import { createMembership } from '../services/membershipService'

function OrchestraDashboard() {
    const { id } = useParams()
    const orchestraId = Number(id)

    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('programs')
    const [selectedProgramId, setSelectedProgramId] = useState(null)

    const [showCreateProgramModal, setShowCreateProgramModal] = useState(false)
    const [programForm, setProgramForm] = useState({ name: '', start_date: '', end_date: '' })
    const [isSavingProgram, setIsSavingProgram] = useState(false)
    const [programError, setProgramError] = useState(null)

    const [currentOrchestra, setCurrentOrchestra] = useState(null)
    const [programs, setPrograms] = useState([])
    const [hasAccess, setHasAccess] = useState(null)
    const [loading, setLoading] = useState(true)

    const [isSaving, setIsSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const [showAddMemberModal, setShowAddMemberModal] = useState(false)
    const [memberForm, setMemberForm] = useState({
        email: '', role: 'member', member_type: 'core', instrument: '', section: 'violin_1'
    })
    const [isSavingMember, setIsSavingMember] = useState(false)
    const [memberError, setMemberError] = useState(null)
    const [membersRefreshKey, setMembersRefreshKey] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const membershipsRes = await client.get('/memberships')
                const membershipsData = membershipsRes.data.data ?? membershipsRes.data

                const isAdmin = membershipsData.some(
                    (m) => m.orchestra.id === orchestraId && m.role === 'admin'
                )
                setHasAccess(isAdmin)

                if (!isAdmin) {
                    setLoading(false)
                    return
                }

                const orchestraRes = await client.get(`/orchestras/${orchestraId}`)
                setCurrentOrchestra(orchestraRes.data.data ?? orchestraRes.data)

                const programsData = await getPrograms(orchestraId)
                setPrograms(programsData)
            } catch (error) {
                console.error('OrchestraDashboard load error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [orchestraId])

    const handleChange = (e) => {
        const { name, value } = e.target
        setCurrentOrchestra((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        setSaveStatus(null)

        try {
            const updated = await updateOrchestra(orchestraId, {
                name: currentOrchestra.name,
                location: currentOrchestra.location
            })
            setCurrentOrchestra(updated)
            setSaveStatus('success')
        } catch (error) {
            console.error('Save orchestra error:', error)
            setSaveStatus('error')
        } finally {
            setIsSaving(false)
            setTimeout(() => setSaveStatus(null), 2000)
        }
    }

    const handleDeleteOrchestra = async () => {
        const confirmed = window.confirm(
            `Delete "${currentOrchestra.name}"? This will permanently delete the orchestra, its programs, events, scores and memberships. This action cannot be undone.`
        )
        if (!confirmed) return

        setIsDeleting(true)
        try {
            await deleteOrchestra(orchestraId)
            navigate('/')
        } catch (error) {
            console.error('Delete orchestra error:', error)
            alert('Failed to delete orchestra')
            setIsDeleting(false)
        }
    }

    if (loading) return <p className="p-8 text-sm">Loading...</p>
    if (hasAccess === false) return <h1 className="p-8 text-2xl font-semibold">Access denied</h1>
    if (!currentOrchestra) return <h1 className="p-8 text-2xl font-semibold">Orchestra not found</h1>

    const now = new Date()
    const activePrograms = programs
        .filter((p) => new Date(p.end_date) >= now)
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))

    const pastPrograms = programs
        .filter((p) => new Date(p.end_date) < now)
        .sort((a, b) => new Date(b.end_date) - new Date(a.end_date))

    const handleProgramUpdated = (updated) => {
        setPrograms((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    }

    const handleProgramDeleted = (programId) => {
        setPrograms((prev) => prev.filter((p) => p.id !== programId))
        if (selectedProgramId === programId) setSelectedProgramId(null)
    }

    const openCreateProgramModal = () => {
        setProgramForm({ name: '', start_date: '', end_date: '' })
        setProgramError(null)
        setShowCreateProgramModal(true)
    }

    const handleCreateProgram = async () => {
        setIsSavingProgram(true)
        setProgramError(null)

        try {
            const created = await createProgram(orchestraId, programForm)
            setPrograms((prev) => [...prev, created])
            setShowCreateProgramModal(false)
        } catch (error) {
            console.error('Create program error:', error)
            setProgramError(error?.response?.data?.message ?? 'Failed to create program')
        } finally {
            setIsSavingProgram(false)
        }
    }

    const SECTION_OPTIONS = [
        'violin_1', 'violin_2', 'viola', 'cello', 'double_bass',
        'french_horn', 'trumpet', 'trombone', 'tuba', 'flute',
        'oboe', 'clarinet', 'bassoon', 'percussion', 'mallet',
        'vocal', 'other'
    ]

    const openAddMemberModal = () => {
        setMemberForm({ email: '', role: 'member', member_type: 'core', instrument: '', section: 'violin_1' })
        setMemberError(null)
        setShowAddMemberModal(true)
    }

    const handleAddMember = async () => {
        setIsSavingMember(true)
        setMemberError(null)

        try {
            await createMembership({
                email: memberForm.email,
                orchestra_name: currentOrchestra.name,
                role: memberForm.role,
                member_type: memberForm.member_type,
                instrument: memberForm.instrument,
                section: memberForm.section
            })

            setMembersRefreshKey((prev) => prev + 1)
            setShowAddMemberModal(false)
        } catch (error) {
            console.error('Add member error:', error)
            setMemberError(error?.response?.data?.message ?? 'Failed to add member')
        } finally {
            setIsSavingMember(false)
        }
    }

    const tabClass = (tab) =>
        `rounded-lg text-sm font-medium px-4 py-2 cursor-pointer focus:outline-none disabled:cursor-default ${
            activeTab === tab ? 'bg-black text-white' : 'text-black hover:bg-card-gray transition-colors'
        }`

    return (
        <div className="bg-white min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-semibold">{currentOrchestra.name}</h1>
                <p className="text-sm opacity-75 mb-6">{currentOrchestra.location}</p>

                <nav className="flex gap-2 mb-6">
                    <button type="button" onClick={() => setActiveTab('programs')} disabled={activeTab === 'programs'} className={tabClass('programs')}>
                        Programs
                    </button>
                    <button type="button" onClick={() => setActiveTab('past-programs')} disabled={activeTab === 'past-programs'} className={tabClass('past-programs')}>
                        Past Programs
                    </button>
                    <button type="button" onClick={() => setActiveTab('members')} disabled={activeTab === 'members'} className={tabClass('members')}>
                        Members
                    </button>
                    <button type="button" onClick={() => setActiveTab('settings')} disabled={activeTab === 'settings'} className={tabClass('settings')}>
                        Settings
                    </button>
                </nav>

                {activeTab === 'programs' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Programs</h2>
                            <button
                                type="button"
                                onClick={openCreateProgramModal}
                                className="rounded-lg border border-black bg-black text-white text-sm font-medium px-3 py-1.5 cursor-pointer focus:outline-none flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-xl!">add</span>
                                Add program
                            </button>
                        </div>

                        {activePrograms.length === 0 && <p className="text-sm">No active programs.</p>}

                        <div className="flex flex-col gap-3">
                            {activePrograms.map((program) => (
                                <ProgramCard
                                    key={program.id}
                                    program={program}
                                    isOpen={selectedProgramId === program.id}
                                    onToggle={() =>
                                        setSelectedProgramId(selectedProgramId === program.id ? null : program.id)
                                    }
                                    canManage={true}
                                    onProgramUpdated={handleProgramUpdated}
                                    onProgramDeleted={handleProgramDeleted}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'past-programs' && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Past Programs</h2>

                        {pastPrograms.length === 0 && <p className="text-sm">No past programs.</p>}

                        <div className="flex flex-col gap-3">
                            {pastPrograms.map((program) => (
                                <ProgramCard
                                    key={program.id}
                                    program={program}
                                    isOpen={selectedProgramId === program.id}
                                    onToggle={() =>
                                        setSelectedProgramId(selectedProgramId === program.id ? null : program.id)
                                    }
                                    canManage={true}
                                    onProgramUpdated={handleProgramUpdated}
                                    onProgramDeleted={handleProgramDeleted}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'members' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Members</h2>
                            <button
                                type="button"
                                onClick={openAddMemberModal}
                                className="rounded-lg border border-black bg-black text-white text-sm font-medium px-3 py-1.5 cursor-pointer focus:outline-none flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-xl!">add</span>
                                Add members
                            </button>
                        </div>

                        <MemberList orchestraId={currentOrchestra.id} refreshKey={membersRefreshKey} />
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Settings</h2>

                        <div className="flex flex-col gap-4 max-w-sm">
                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium ms-1">Name</span>
                                <input
                                    name="name"
                                    value={currentOrchestra.name}
                                    onChange={handleChange}
                                    disabled={isSaving}
                                    className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                                />
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium ms-1">Location</span>
                                <input
                                    name="location"
                                    value={currentOrchestra.location}
                                    onChange={handleChange}
                                    disabled={isSaving}
                                    className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                                />
                            </label>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="rounded-lg border border-black bg-black text-white text-sm font-medium py-2 cursor-pointer focus:outline-none disabled:opacity-60"
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>

                            {saveStatus === 'success' && (
                                <p className="text-sm text-green-600">Changes saved successfully</p>
                            )}
                            {saveStatus === 'error' && (
                                <p className="text-sm text-red">Error saving changes</p>
                            )}

                            <hr className="border-gray my-4" />

                            <button
                                type="button"
                                onClick={handleDeleteOrchestra}
                                disabled={isDeleting}
                                className="rounded-lg bg-red border border-red text-white text-sm font-medium py-2 px-4 focus:outline-none disabled:opacity-60 cursor-pointer"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete orchestra'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showCreateProgramModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 px-4">
                    <div className="bg-white rounded-lg p-4 w-full max-w-sm flex flex-col gap-3">
                        <h3 className="text-base font-semibold">Add program</h3>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Name</span>
                            <input
                                value={programForm.name}
                                onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                                disabled={isSavingProgram}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Start date</span>
                            <input
                                type="date"
                                value={programForm.start_date}
                                onChange={(e) => setProgramForm({ ...programForm, start_date: e.target.value })}
                                disabled={isSavingProgram}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">End date</span>
                            <input
                                type="date"
                                value={programForm.end_date}
                                onChange={(e) => setProgramForm({ ...programForm, end_date: e.target.value })}
                                disabled={isSavingProgram}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        {programError && <p className="text-sm text-red">{programError}</p>}

                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={handleCreateProgram}
                                disabled={isSavingProgram}
                                className="flex-1 rounded-lg border border-black bg-black text-white text-sm font-medium py-2 cursor-pointer focus:outline-none disabled:opacity-60"
                            >
                                {isSavingProgram ? 'Saving...' : 'Create'}
                            </button>
                            <button
                                onClick={() => setShowCreateProgramModal(false)}
                                disabled={isSavingProgram}
                                className="flex-1 rounded-lg border border-gray text-sm font-medium py-2 hover:bg-card-gray transition-colors focus:outline-none disabled:opacity-60 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddMemberModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 px-4">
                    <div className="bg-white rounded-lg p-4 w-full max-w-sm flex flex-col gap-3">
                        <h3 className="text-base font-semibold">Add member</h3>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Email</span>
                            <input
                                type="email"
                                value={memberForm.email}
                                onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                                disabled={isSavingMember}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Role</span>
                            <select
                                value={memberForm.role}
                                onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                                disabled={isSavingMember}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            >
                                <option value="admin">admin</option>
                                <option value="member">member</option>
                            </select>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Member type</span>
                            <select
                                value={memberForm.member_type}
                                onChange={(e) => setMemberForm({ ...memberForm, member_type: e.target.value })}
                                disabled={isSavingMember}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            >
                                <option value="core">core</option>
                                <option value="substitute">substitute</option>
                                <option value="guest">guest</option>
                            </select>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Instrument</span>
                            <input
                                value={memberForm.instrument}
                                onChange={(e) => setMemberForm({ ...memberForm, instrument: e.target.value })}
                                disabled={isSavingMember}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Section</span>
                            <select
                                value={memberForm.section}
                                onChange={(e) => setMemberForm({ ...memberForm, section: e.target.value })}
                                disabled={isSavingMember}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            >
                                {SECTION_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </label>

                        {memberError && <p className="text-sm text-red">{memberError}</p>}

                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={handleAddMember}
                                disabled={isSavingMember}
                                className="flex-1 rounded-lg border border-black bg-black text-white text-sm font-medium py-2 cursor-pointer focus:outline-none disabled:opacity-60"
                            >
                                {isSavingMember ? 'Saving...' : 'Create'}
                            </button>
                            <button
                                onClick={() => setShowAddMemberModal(false)}
                                disabled={isSavingMember}
                                className="flex-1 rounded-lg border border-gray text-sm font-medium py-2 hover:bg-card-gray transition-colors focus:outline-none disabled:opacity-60 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OrchestraDashboard