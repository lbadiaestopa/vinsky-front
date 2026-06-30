import { useState } from 'react'
import { events } from '../mock/events'
import { scores } from '../mock/scores'
import EventCard from './EventCard'

function ProgramCard({ program }) {
    const [open, setOpen] = useState(false)

    const programEvents = events.filter(
        (e) => e.program_id === program.id
    ).map((e) => ({
        ...e,
        scores: e.scores ?? []
    }))

    const programScores = scores.filter(
        (s) => s.program_id === program.id
    )

    return (
        <div style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '12px' }}>

            <div
                onClick={() => setOpen(!open)}
                style={{ cursor: 'pointer' }}
            >
                <h3 style={{ margin: 0 }}>{program.name}</h3>

                <p style={{ margin: '4px 0' }}>
                    {new Date(program.start_date).toLocaleDateString()} →
                    {new Date(program.end_date).toLocaleDateString()}
                </p>
            </div>

            {open && (
                <div style={{ marginTop: '12px' }}>
                    {programEvents.length === 0 ? (
                        <p>No events</p>
                    ) : (
                        programEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                scores={event.scores || []}
                            />
                        ))
                    )}

                    <h4>Scores</h4>

                    {programScores.length > 0 ? (
                        <ul>
                            {programScores.map((score) => (
                                <li
                                    key={score.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <span>{score.original_name}</span>
                                    <button type="button">
                                        Download
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No scores available</p>
                    )}
                </div>
            )}

        </div>
    )
}

export default ProgramCard