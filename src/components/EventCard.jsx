import { useState, useEffect, useRef } from 'react'
import { EVENT_TYPE_LABELS } from '../constants/eventTypes'
import { deleteEvent } from '../services/eventService'
import EditEventModal from './EditEventModal'

function EventCard({
    event,
    program,
    orchestra,
    onProgramClick,
    canManage,
    programId,
    onEventUpdated,
    onEventDeleted
}) {
    const start = new Date(event.start_date)
    const end = new Date(event.end_date)

    const [menuOpen, setMenuOpen] = useState(false)
    const [editing, setEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const menuRef = useRef(null)

    const openEdit = () => {
        setMenuOpen(false)
        setEditing(true)
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

    useEffect(() => {
        if (!menuOpen) return

        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [menuOpen])

    return (
        <>
            <div className={`bg-card-gray rounded-lg p-4 mb-3 relative ${isDeleting ? 'opacity-50' : ''}`}>
                <span className="text-sm border border-gray rounded-lg px-2 py-1 -ms-1">
                    {EVENT_TYPE_LABELS[event.type]}
                </span>

                <div className="flex justify-between items-start mt-2">
                    <h3 className="text-base font-semibold">
                        {event.repertoire}
                    </h3>

                    <div className="flex items-center gap-2">
                        <p className="text-sm my-1 font-semibold">
                            {start.toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            })}
                            {' · '}
                            {start.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            {' - '}
                            {end.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>

                        <p className="text-sm">
                            {' · '}
                            {event.location}
                        </p>

                        {canManage && (
                            <div
                                ref={menuRef}
                                className="relative">
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                    className="bg-transparent border-none text-lg cursor-pointer px-2 focus:outline-none"
                                >
                                    <span className="material-symbols-outlined text-xl! rounded-full hover:bg-gray transition-colors px-2 py-1">
                                        more_vert
                                    </span>
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
            </div>

            <EditEventModal
                open={editing}
                event={event}
                programId={programId}
                onClose={() => setEditing(false)}
                onSaved={onEventUpdated}
            />
        </>
    )
}

export default EventCard