import { useState, useEffect } from 'react'
import { getOrchestras } from '../services/orchestraService'
import { getPrograms } from '../services/programService'
import { getEvents } from '../services/eventService'
import NextEventsTab from '../components/NextEventsTab'
import ProgramsTab from '../components/ProgramsTab'
import { useHomeData } from '../hooks/useHomeData'
import HomeTabs from '../components/HomeTabs'

function Home() {
    const [activeTab, setActiveTab] = useState('events') // 'events' | 'programs'
    const [selectedProgramId, setSelectedProgramId] = useState(null)

    const {
        orchestrasData,
        programsData,
        eventsData,
    } = useHomeData()

    const handleProgramClick = (programId) => {
        setSelectedProgramId(programId)
        setActiveTab('programs')
    }

    const today = new Date()

    const visiblePrograms = programsData.filter(program =>
        new Date(program.end_date) >= today
    )

    return (
        <div className="bg-white min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
                <HomeTabs
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />

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
                        programs={visiblePrograms}
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