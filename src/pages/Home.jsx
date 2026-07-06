import { useState, useEffect } from 'react'
import { getOrchestras } from '../services/orchestraService'
import { getPrograms } from '../services/programService'
import { getEvents } from '../services/eventService'
import NextEventsTab from '../components/NextEventsTab'
import ProgramsTab from '../components/ProgramsTab'

function Home() {
    const [activeTab, setActiveTab] = useState('events') // 'events' | 'programs'
    const [selectedProgramId, setSelectedProgramId] = useState(null)

    const [orchestrasData, setOrchestrasData] = useState([])
    const [programsData, setProgramsData] = useState([])
    const [eventsData, setEventsData] = useState([])

    const handleProgramClick = (programId) => {
        setSelectedProgramId(programId)
        setActiveTab('programs')
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orchestras = await getOrchestras()
                setOrchestrasData(orchestras)

                let allPrograms = []
                let allEvents = []

                for (const orchestra of orchestras) {
                    const programs = await getPrograms(orchestra.id)
                    allPrograms = [...allPrograms, ...programs]

                    for (const program of programs) {
                        const events = await getEvents(program.id)
                        allEvents = [...allEvents, ...events]
                    }
                }

                setProgramsData(allPrograms)
                setEventsData(allEvents)
            } catch (error) {
                console.error('Home load error:', error)
            }
        }

        fetchData()
    }, [])

    return (
        <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <button type="button" onClick={() => setActiveTab('events')} disabled={activeTab === 'events'}>
                    Next events
                </button>
                <button type="button" onClick={() => setActiveTab('programs')} disabled={activeTab === 'programs'}>
                    Programs
                </button>
            </div>

            {activeTab === 'events' && (
                <NextEventsTab
                    events={eventsData}
                    programsData={programsData}
                    orchestrasData={orchestrasData}
                    onProgramClick={handleProgramClick}
                />
            )}

            {activeTab === 'programs' && (
                <ProgramsTab
                    programs={programsData}
                    orchestras={orchestrasData}
                    selectedProgramId={selectedProgramId}
                    onToggleProgram={setSelectedProgramId}
                />
            )}
        </div>
    )
}

export default Home