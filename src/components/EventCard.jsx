import { useState } from 'react'
import { EVENT_TYPE_LABELS } from '../utils/eventTypes'
import { updateEvent, deleteEvent } from '../services/eventService'
import { toDatetimeLocal, fromDatetimeLocal } from '../utils/dates'

const EVENT_TYPES = ['rehearsal', 'concert', 'soundcheck']

function EventCard({ event, program, orchestra, onProgramClick, canManage, programId, onEventUpdated, onEventDeleted }) {
    const start = new Date(event.start_date)
    const end = new Date(event.end_date)

    const [menuOpen, setMenuOpen] = useState(false)
    const [editing, setEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const [form, setForm] = useState({
        repertoire: event.repertoire,
        type: event.type,
        location: event.location,
        start_date: toDatetimeLocal(event.start_date),
        end_date: toDatetimeLocal(event.end_date)
    })
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState(null)

    const openEdit = () => {
        setMenuOpen(false)
        setError(null)
        setForm({
            repertoire: event.repertoire,
            type: event.type,
            location: event.location,
            start_date: toDatetimeLocal(event.start_date),
            end_date: toDatetimeLocal(event.end_date)
        })
        setEditing(true)
    }

    const handleSave = async () => {
        setIsSaving(true)
        setError(null)

        try {
            const updated = await updateEvent(programId, event.id, {
                repertoire: form.repertoire,
                type: form.type,
                location: form.location,
                start_date: fromDatetimeLocal(form.start_date),
                end_date: fromDatetimeLocal(form.end_date)
            })

            onEventUpdated(updated)
            setEditing(false)
        } catch (err) {
            console.error('Update event error:', err)
            setError(err?.response?.data?.message ?? 'Failed to update event')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        setMenuOpen(false)

        const confirmed = window.confirm(
            `Delete "${event.repertoire}"? This action cannot be undone.`
        )
        if (!confirmed) return

        setIsDeleting(true)
        try {
            await deleteEvent(programId, event.id)
            onEventDeleted(event.id)
        } catch (err) {
            console.error('Delete event error:', err)
            alert('Failed to delete event')
            setIsDeleting(false)
        }
    }

    return (
        <div style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '12px', position: 'relative', opacity: isDeleting ? 0.5 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0 }}>{event.repertoire}</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{EVENT_TYPE_LABELS[event.type]}</span>

                    {canManage && (
                        <div style={{ position: 'relative' }}>
                            <button
                                type="button"
                                onClick={() => setMenuOpen((prev) => !prev)}
                                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '0 8px' }}
                            >
                                ⋮
                            </button>

                            {menuOpen && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '100%',
                                        background: 'white',
                                        border: '1px solid #ddd',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                        zIndex: 10,
                                        minWidth: '140px'
                                    }}
                                >
                                    <button type="button" onClick={openEdit}
                                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer' }}>
                                        Edit details
                                    </button>
                                    <button type="button" onClick={handleDelete}
                                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', color: 'red' }}>
                                        Delete event
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <p style={{ margin: '4px 0', fontSize: '0.9rem', opacity: 0.85 }}>
                {start.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}{' '}
                · {start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                {' → '}
                {end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                {' · '}
                {event.location}
            </p>

            {onProgramClick && (
                <p style={{ margin: '4px 0', fontSize: '0.9rem', opacity: 0.8 }}>
                    {program ? (
                        <button
                            type="button"
                            onClick={() => onProgramClick(program.id)}
                            style={{
                                background: 'none', border: 'none', padding: 0,
                                color: '#0066cc', textDecoration: 'underline',
                                cursor: 'pointer', fontSize: 'inherit'
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
            )}

            {editing && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.4)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{
                        background: 'white', padding: '1rem', width: '320px',
                        display: 'flex', flexDirection: 'column', gap: '0.5rem'
                    }}>
                        <h3>Edit event</h3>

                        <label>
                            Repertoire
                            <input
                                value={form.repertoire}
                                onChange={(e) => setForm({ ...form, repertoire: e.target.value })}
                                disabled={isSaving}
                            />
                        </label>

                        <label>
                            Type
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                disabled={isSaving}
                            >
                                {EVENT_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Location
                            <input
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                disabled={isSaving}
                            />
                        </label>

                        <label>
                            Start
                            <input
                                type="datetime-local"
                                value={form.start_date}
                                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                disabled={isSaving}
                            />
                        </label>

                        <label>
                            End
                            <input
                                type="datetime-local"
                                value={form.end_date}
                                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                                disabled={isSaving}
                            />
                        </label>

                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button onClick={() => setEditing(false)} disabled={isSaving}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EventCard