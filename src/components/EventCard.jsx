import { useState } from 'react'
import { programs } from '../mock/programs'
import { orchestras } from '../mock/orchestras'
import { EVENT_TYPE_LABELS } from '../utils/eventTypes'

function EventCard({ event, onSelectProgram }) {
    const [open, setOpen] = useState(false)

    const program = programs.find(
        (p) => p.id === event.program_id
    )

    const orchestra = program
        ? orchestras.find((o) => o.id === program.orchestra_id)
        : null

    const start = new Date(event.start_date)
    const end = new Date(event.end_date)

    const handleToggle = () => {
        const next = !open
        setOpen(next)
        if (program) {
            onSelectProgram?.(next ? program.id : null)
        }
    }

    return (
        <div style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '12px' }}>

            {/* HEADER */}
            <div
                onClick={handleToggle}
                style={{ cursor: 'pointer' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0 }}>{event.repertoire}</h3>

                    <span>
                        {EVENT_TYPE_LABELS[event.type]}
                    </span>
                </div>

                <p style={{ margin: '4px 0', fontSize: '0.9rem', opacity: 0.85 }}>
                    {start.toLocaleDateString(undefined, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}{' '}
                    · {start.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                    {' → '}
                    {end.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                    {' · '}
                    {event.venue}
                </p>

                <p style={{ margin: '4px 0', fontSize: '0.9rem', opacity: 0.8 }}>
                    {program?.name ?? 'No program'} · {orchestra?.name ?? 'No orchestra'}
                </p>
            </div>

            {/* ACCORDION */}
            {open && program && (
                <div style={{ marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '12px' }}>

                    <p>{program.name}</p>

                    <p>
                        {new Date(program.start_date).toLocaleDateString(undefined, {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}{' '}
                        →
                        {' '}
                        {new Date(program.end_date).toLocaleDateString(undefined, {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </p>

                </div>
            )}

        </div>
    )
}

export default EventCard