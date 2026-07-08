import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import client from '../api/client'
import { getPrograms, createProgram } from '../services/programService'
import { updateOrchestra, deleteOrchestra } from '../services/orchestraService'
import ProgramCard from '../components/ProgramCard'
import MemberList from '../components/MemberList'
import { createMembership } from '../services/membershipService'
import CreateProgramModal from '../components/CreateProgramModal'
import AddMemberModal from '../components/AddMemberModal'
import ProgramList from '../components/ProgramList'
import { SECTION_OPTIONS } from '../constants/sections'
import OrchestraSettings from '../components/OrchestraSettings'
import DashboardTabs from '../components/DashboardTabs'

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

                const [orchestraRes, programsData] = await Promise.all([
                    client.get(`/orchestras/${orchestraId}`),
                    getPrograms(orchestraId)
                ])

                setCurrentOrchestra(orchestraRes.data.data ?? orchestraRes.data)
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
        `rounded-lg text-sm font-medium px-4 py-2 cursor-pointer focus:outline-none disabled:cursor-default ${activeTab === tab ? 'bg-black text-white' : 'text-black hover:bg-card-gray transition-colors'
        }`

    const tabs = [
        { id: 'programs', label: 'Programs' },
        { id: 'past-programs', label: 'Past Programs' },
        { id: 'members', label: 'Members' },
        { id: 'settings', label: 'Settings' },
    ]

    return (
        <div className="bg-white min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-semibold">{currentOrchestra.name}</h1>
                <p className="text-sm opacity-75 mb-6">{currentOrchestra.location}</p>

                <DashboardTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />

                {activeTab === 'programs' && (
                    <ProgramList
                        title="Programs"
                        programs={activePrograms}
                        selectedProgramId={selectedProgramId}
                        setSelectedProgramId={setSelectedProgramId}
                        canManage
                        onProgramUpdated={handleProgramUpdated}
                        onProgramDeleted={handleProgramDeleted}
                        action={
                            <button
                                type="button"
                                onClick={openCreateProgramModal}
                                className="rounded-lg border border-black bg-black text-white text-sm font-medium px-3 py-1.5 cursor-pointer focus:outline-none flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-xl!">
                                    add
                                </span>

                                Add program
                            </button>
                        }
                    />
                )}

                {activeTab === 'past-programs' && (
                    <ProgramList
                        title="Past Programs"
                        programs={pastPrograms}
                        selectedProgramId={selectedProgramId}
                        setSelectedProgramId={setSelectedProgramId}
                        canManage
                        onProgramUpdated={handleProgramUpdated}
                        onProgramDeleted={handleProgramDeleted}
                    />
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
                    <OrchestraSettings
                        orchestra={currentOrchestra}
                        isSaving={isSaving}
                        isDeleting={isDeleting}
                        saveStatus={saveStatus}
                        onChange={handleChange}
                        onSave={handleSave}
                        onDelete={handleDeleteOrchestra}
                    />
                )}
            </div>

            <CreateProgramModal
                open={showCreateProgramModal}
                form={programForm}
                setForm={setProgramForm}
                loading={isSavingProgram}
                error={programError}
                onCreate={handleCreateProgram}
                onClose={() => setShowCreateProgramModal(false)}
            />

            <AddMemberModal
                open={showAddMemberModal}
                form={memberForm}
                setForm={setMemberForm}
                loading={isSavingMember}
                error={memberError}
                sectionOptions={SECTION_OPTIONS}
                onCreate={handleAddMember}
                onClose={() => setShowAddMemberModal(false)}
            />
        </div>
    )
}

export default OrchestraDashboard