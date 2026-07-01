import { EVENT_TYPE_LABELS } from '../utils/eventTypes'

function EventCard({ event, program, orchestra, onProgramClick }) {
    const start = new Date(event.start_date)
    const end = new Date(event.end_date)

    return (
        <div style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0 }}>{event.repertoire}</h3>
                <span>{EVENT_TYPE_LABELS[event.type]}</span>
            </div>

            <p style={{ margin: '4px 0', fontSize: '0.9rem', opacity: 0.85 }}>
                {start.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}{' '}
                · {start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                {' → '}
                {end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                {' · '}
                {event.venue}
            </p>

            <p style={{ margin: '4px 0', fontSize: '0.9rem', opacity: 0.8 }}>
                {program ? (
                    <button
                        type="button"
                        onClick={() => onProgramClick(program.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            color: '#0066cc',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: 'inherit'
                        }}
                    >
                        {program.name}
                    </button>
                ) : (
                    'No program'
                )}
                {' · '}
                {orchestra?.name ?? 'No orchestra'}
            </p>
        </div>
    )
}

export default EventCard