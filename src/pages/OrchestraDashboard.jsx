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

    if (loading) return <p>Loading...</p>
    if (hasAccess === false) return <h1>Access denied</h1>
    if (!currentOrchestra) return <h1>Orchestra not found</h1>

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

    return (
        <div>
            <h1>{currentOrchestra.name}</h1>
            <p>{currentOrchestra.location}</p>

            <nav style={{ display: 'flex', gap: '1rem', margin: '2rem 0' }}>
                <button type="button" onClick={() => setActiveTab('programs')}
                    style={{ fontWeight: activeTab === 'programs' ? 'bold' : 'normal' }}>
                    Programs
                </button>
                <button type="button" onClick={() => setActiveTab('past-programs')}
                    style={{ fontWeight: activeTab === 'past-programs' ? 'bold' : 'normal' }}>
                    Past Programs
                </button>
                <button type="button" onClick={() => setActiveTab('members')}
                    style={{ fontWeight: activeTab === 'members' ? 'bold' : 'normal' }}>
                    Members
                </button>
                <button type="button" onClick={() => setActiveTab('settings')}
                    style={{ fontWeight: activeTab === 'settings' ? 'bold' : 'normal' }}>
                    Settings
                </button>
            </nav>

            {activeTab === 'programs' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Programs</h2>
                        <button type="button" onClick={openCreateProgramModal}>
                            + Add program
                        </button>
                    </div>

                    {activePrograms.length === 0 && <p>No active programs.</p>}
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
            )}

            {activeTab === 'past-programs' && (
                <div>
                    <h2>Past Programs</h2>
                    {pastPrograms.length === 0 && <p>No past programs.</p>}
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
            )}

            {activeTab === 'members' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Members</h2>
                        <button type="button" onClick={openAddMemberModal}>
                            + Add members
                        </button>
                    </div>

                    <MemberList orchestraId={currentOrchestra.id} refreshKey={membersRefreshKey} />
                </div>
            )}

            {activeTab === 'settings' && (
                <div>
                    <h2>Settings</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
                        <label>
                            Name
                            <input
                                name="name"
                                value={currentOrchestra.name}
                                onChange={handleChange}
                                disabled={isSaving}
                                style={{ opacity: isSaving ? 0.6 : 1 }}
                            />
                        </label>

                        <label>
                            Location
                            <input
                                name="location"
                                value={currentOrchestra.location}
                                onChange={handleChange}
                                disabled={isSaving}
                                style={{ opacity: isSaving ? 0.6 : 1 }}
                            />
                        </label>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            style={{ opacity: isSaving ? 0.6 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>

                        {saveStatus === 'success' && (
                            <p style={{ color: 'green', marginTop: '8px' }}>Changes saved successfully</p>
                        )}
                        {saveStatus === 'error' && (
                            <p style={{ color: 'red', marginTop: '8px' }}>Error saving changes</p>
                        )}

                        <hr style={{ margin: '2rem 0' }} />

                        <button
                            type="button"
                            onClick={handleDeleteOrchestra}
                            disabled={isDeleting}
                            style={{ color: 'red' }}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete orchestra'}
                        </button>
                    </div>
                </div>
            )}

            {showCreateProgramModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.4)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{
                        background: 'white', padding: '1rem', width: '320px',
                        display: 'flex', flexDirection: 'column', gap: '0.5rem'
                    }}>
                        <h3>Add program</h3>

                        <label>
                            Name
                            <input
                                value={programForm.name}
                                onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                                disabled={isSavingProgram}
                            />
                        </label>

                        <label>
                            Start date
                            <input
                                type="date"
                                value={programForm.start_date}
                                onChange={(e) => setProgramForm({ ...programForm, start_date: e.target.value })}
                                disabled={isSavingProgram}
                            />
                        </label>

                        <label>
                            End date
                            <input
                                type="date"
                                value={programForm.end_date}
                                onChange={(e) => setProgramForm({ ...programForm, end_date: e.target.value })}
                                disabled={isSavingProgram}
                            />
                        </label>

                        {programError && <p style={{ color: 'red' }}>{programError}</p>}

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={handleCreateProgram} disabled={isSavingProgram}>
                                {isSavingProgram ? 'Saving...' : 'Create'}
                            </button>
                            <button onClick={() => setShowCreateProgramModal(false)} disabled={isSavingProgram}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddMemberModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.4)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{
                        background: 'white', padding: '1rem', width: '320px',
                        display: 'flex', flexDirection: 'column', gap: '0.5rem'
                    }}>
                        <h3>Add member</h3>

                        <label>
                            Email
                            <input
                                type="email"
                                value={memberForm.email}
                                onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                                disabled={isSavingMember}
                            />
                        </label>

                        <label>
                            Role
                            <select
                                value={memberForm.role}
                                onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                                disabled={isSavingMember}
                            >
                                <option value="admin">admin</option>
                                <option value="member">member</option>
                            </select>
                        </label>

                        <label>
                            Member type
                            <select
                                value={memberForm.member_type}
                                onChange={(e) => setMemberForm({ ...memberForm, member_type: e.target.value })}
                                disabled={isSavingMember}
                            >
                                <option value="core">core</option>
                                <option value="substitute">substitute</option>
                                <option value="guest">guest</option>
                            </select>
                        </label>

                        <label>
                            Instrument
                            <input
                                value={memberForm.instrument}
                                onChange={(e) => setMemberForm({ ...memberForm, instrument: e.target.value })}
                                disabled={isSavingMember}
                            />
                        </label>

                        <label>
                            Section
                            <select
                                value={memberForm.section}
                                onChange={(e) => setMemberForm({ ...memberForm, section: e.target.value })}
                                disabled={isSavingMember}
                            >
                                {SECTION_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </label>

                        {memberError && <p style={{ color: 'red' }}>{memberError}</p>}

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={handleAddMember} disabled={isSavingMember}>
                                {isSavingMember ? 'Saving...' : 'Create'}
                            </button>
                            <button onClick={() => setShowAddMemberModal(false)} disabled={isSavingMember}>
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