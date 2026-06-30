import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { orchestras } from '../mock/orchestras'
import { memberships } from '../mock/memberships'
import { programs } from '../mock/programs'
import ProgramCard from '../components/ProgramCard'
import MemberList from '../components/MemberList'

function OrchestraDashboard() {
    const { id } = useParams()

    const [activeTab, setActiveTab] = useState('programs')

    const [currentOrchestra, setCurrentOrchestra] = useState(
        orchestras.find((o) => o.id === Number(id))
    )

    const [isSaving, setIsSaving] = useState(false)

    const [saveStatus, setSaveStatus] = useState(null) // 'success' | null

    const handleChange = (e) => {
        const { name, value } = e.target

        setCurrentOrchestra((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        setSaveStatus(null)

        // simulació d'API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        setCurrentOrchestra((prev) => ({
            ...prev
        }))

        setIsSaving(false)
        setSaveStatus('success')

        setTimeout(() => {
            setSaveStatus(null)
        }, 2000)
    }

    if (!currentOrchestra) {
        return <h1>Orchestra not found</h1>
    }

    const hasAccess = memberships.some(
        (m) =>
            m.user_id === 1 &&
            m.orchestra_id === Number(id) &&
            m.role === 'admin'
    )

    if (!hasAccess) {
        return <h1>Access denied</h1>
    }

    return (
        <div>
            <h1>{currentOrchestra.name}</h1>
            <p>{currentOrchestra.city}</p>

            <nav style={{ display: 'flex', gap: '1rem', margin: '2rem 0' }}>

                <button
                    type="button"
                    onClick={() => setActiveTab('programs')}
                    style={{
                        fontWeight: activeTab === 'programs' ? 'bold' : 'normal'
                    }}
                >
                    Programs
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('members')}
                    style={{
                        fontWeight: activeTab === 'members' ? 'bold' : 'normal'
                    }}
                >
                    Members
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    style={{
                        fontWeight: activeTab === 'settings' ? 'bold' : 'normal'
                    }}
                >
                    Settings
                </button>

            </nav>

            {activeTab === 'programs' && (
                <div>
                    <h2>Programs</h2>

                    {programs
                        .filter((p) => p.orchestra_id === currentOrchestra.id)
                        .map((program) => (
                            <ProgramCard key={program.id} program={program} />
                        ))}
                </div>
            )}

            {activeTab === 'members' && (
                <div>
                    <h2>Members</h2>

                    <MemberList orchestraId={currentOrchestra.id} />
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
                                style={{
                                    opacity: isSaving ? 0.6 : 1
                                }}
                            />
                        </label>

                        <label>
                            City
                            <input
                                name="city"
                                value={currentOrchestra.city}
                                onChange={handleChange}
                                disabled={isSaving}
                                style={{
                                    opacity: isSaving ? 0.6 : 1
                                }}
                            />
                        </label>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            style={{
                                opacity: isSaving ? 0.6 : 1,
                                cursor: isSaving ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>

                        {saveStatus === 'success' && (
                            <p style={{ color: 'green', marginTop: '8px' }}>
                                Changes saved successfully
                            </p>
                        )}

                    </div>
                </div>
            )}
        </div>
    )
}

export default OrchestraDashboard