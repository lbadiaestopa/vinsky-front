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
        <div className="bg-white min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex gap-2 mb-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab('events')}
                        disabled={activeTab === 'events'}
                        className={`rounded-lg text-sm font-medium px-4 py-2 cursor-pointer focus:outline-none disabled:cursor-default ${activeTab === 'events'
                                ? 'bg-black text-white'
                                : 'text-black hover:bg-card-gray transition-colors'
                            }`}
                    >
                        Next events
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('programs')}
                        disabled={activeTab === 'programs'}
                        className={`rounded-lg text-sm font-medium px-4 py-2 cursor-pointer focus:outline-none disabled:cursor-default ${activeTab === 'programs'
                                ? 'bg-black text-white'
                                : 'text-black hover:bg-card-gray transition-colors'
                            }`}
                    >
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
        </div>
    )
}

export default Home