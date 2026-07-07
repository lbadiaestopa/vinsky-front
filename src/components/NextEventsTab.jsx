import { useState } from 'react'
import EventCard from './EventCard'
import { EVENT_TYPES_ORDER, EVENT_TYPE_LABELS } from '../utils/eventTypes'

function NextEventsTab({ events, programsData, orchestrasData, onProgramClick }) {
    const [orchestraFilter, setOrchestraFilter] = useState('')
    const [programFilter, setProgramFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState('')

    const now = new Date()

    const activePrograms = programsData.filter(
        (p) => new Date(p.end_date) >= now
    )

    const availablePrograms = activePrograms
        .filter((p) =>
            orchestraFilter ? p.orchestra.id === Number(orchestraFilter) : true
        )
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))

    const filteredEvents = events
        .filter((event) => {
            const eventProgram = programsData.find((p) => p.id === event.program_id)
            if (!eventProgram) return false

            if (new Date(event.end_date) < now) return false

            if (typeFilter && event.type !== typeFilter) return false
            if (programFilter && event.program_id !== Number(programFilter)) return false
            if (orchestraFilter && eventProgram.orchestra.id !== Number(orchestraFilter)) return false

            return true
        })
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))

    return (
        <div>
            <div className="grid grid-cols-3 gap-3 mb-6">
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Orchestra</span>
                    <select
                        value={orchestraFilter}
                        onChange={(e) => {
                            setOrchestraFilter(e.target.value)
                            setProgramFilter('')
                        }}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none"
                    >
                        <option value="">All</option>
                        {orchestrasData.map((o) => (
                            <option key={o.id} value={o.id}>
                                {o.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Program</span>
                    <select
                        value={programFilter}
                        onChange={(e) => setProgramFilter(e.target.value)}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none"
                    >
                        <option value="">All</option>
                        {availablePrograms.map((p) => (
                            <option key={p.id} value={p.id}>
                                {orchestraFilter ? p.name : `${p.orchestra.name} · ${p.name}`}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Type</span>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-lg border border-gray px-3 py-2 text-sm capitalize focus:outline-none"
                    >
                        <option value="">All</option>
                        {EVENT_TYPES_ORDER.map((type) => (
                            <option key={type} value={type} className="capitalize">
                                {EVENT_TYPE_LABELS[type]}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {filteredEvents.length === 0 && <p className="text-sm">No upcoming events.</p>}

            <div className="flex flex-col gap-3">
                {filteredEvents.map((event) => {
                    const program = programsData.find((p) => p.id === event.program_id)
                    const orchestra = program
                        ? orchestrasData.find((o) => o.id === program.orchestra.id)
                        : null

                    return (
                        <EventCard
                            key={event.id}
                            event={event}
                            program={program}
                            orchestra={orchestra}
                            onProgramClick={onProgramClick}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default NextEventsTab