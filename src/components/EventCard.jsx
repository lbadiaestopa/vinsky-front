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
        <div className={`bg-card-gray rounded-lg p-4 mb-3 relative ${isDeleting ? 'opacity-50' : ''}`}>
            <span className="text-sm border border-gray rounded-lg px-2 py-1 -ms-1">{EVENT_TYPE_LABELS[event.type]}</span>

            <div className="flex justify-between items-start mt-2">
                <h3 className="text-base font-semibold">{event.repertoire}</h3>

                <div className="flex items-center gap-2">
                    <p className="text-sm my-1 font-semibold">
                        {start.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}{' '}
                        · {start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        {' - '}
                        {end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>

                    <p className="text-sm">
                        {' · '}
                        {event.location}
                    </p>

                    {canManage && (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setMenuOpen((prev) => !prev)}
                                className="bg-transparent border-none text-lg cursor-pointer px-2 focus:outline-none"
                            >
                                <span className="material-symbols-outlined text-xl! rounded-full hover:bg-gray transition-colors px-2 py-1">more_vert</span>
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-full bg-white border border-gray rounded-lg shadow-md z-10 min-w-35">
                                    <button
                                        type="button"
                                        onClick={openEdit}
                                        className="block w-full text-left text-sm px-3 py-2 hover:bg-card-gray transition-colors focus:outline-none cursor-pointer"
                                    >
                                        Edit details
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="block w-full text-left text-sm px-3 py-2 text-red hover:bg-card-gray transition-colors focus:outline-none cursor-pointer"
                                    >
                                        Delete event
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {onProgramClick && (
                <p className="text-sm opacity-80 my-1">
                    {program ? (
                        <button
                            type="button"
                            onClick={() => onProgramClick(program.id)}
                            className="bg-transparent border-none p-0 underline cursor-pointer text-sm focus:outline-none"
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
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 px-4">
                    <div className="bg-white rounded-lg p-4 w-full max-w-sm flex flex-col gap-3">
                        <h3 className="text-base font-semibold">Edit event</h3>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Repertoire</span>
                            <input
                                value={form.repertoire}
                                onChange={(e) => setForm({ ...form, repertoire: e.target.value })}
                                disabled={isSaving}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Type</span>
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                disabled={isSaving}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            >
                                {EVENT_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Location</span>
                            <input
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                disabled={isSaving}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Start</span>
                            <input
                                type="datetime-local"
                                value={form.start_date}
                                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                disabled={isSaving}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">End</span>
                            <input
                                type="datetime-local"
                                value={form.end_date}
                                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                                disabled={isSaving}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        {error && <p className="text-sm text-red">{error}</p>}

                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 rounded-lg border border-black bg-black text-white text-sm font-medium py-2 cursor-pointer focus:outline-none disabled:opacity-60"
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                onClick={() => setEditing(false)}
                                disabled={isSaving}
                                className="flex-1 rounded-lg border border-gray text-sm font-medium py-2 hover:bg-card-gray transition-colors focus:outline-none disabled:opacity-60 cursor-pointer"
                            >
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