import { useState, useEffect, useRef } from 'react'
import { getScores, createScore, downloadScore, deleteScore } from '../services/scoreService'
import { getEvents, createEvent } from '../services/eventService'
import { updateProgram, deleteProgram } from '../services/programService'
import EventCard from './EventCard'
import { toDatetimeLocal, fromDatetimeLocal } from '../utils/dates'

const EVENT_TYPES = ['rehearsal', 'concert', 'soundcheck']

function ProgramCard({ program, isOpen, onToggle, canManage, onProgramUpdated, onProgramDeleted }) {
    const [scores, setScores] = useState([])
    const [loadingScores, setLoadingScores] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState(null)
    const fileInputRef = useRef(null)

    const [events, setEvents] = useState([])
    const [loadingEvents, setLoadingEvents] = useState(false)

    const [menuOpen, setMenuOpen] = useState(false)
    const [activeModal, setActiveModal] = useState(null) // 'addEvent' | 'editDetails' | null

    const [eventForm, setEventForm] = useState({
        repertoire: '', type: 'rehearsal', location: '', start_date: '', end_date: ''
    })
    const [isSavingEvent, setIsSavingEvent] = useState(false)
    const [eventError, setEventError] = useState(null)

    const [detailsForm, setDetailsForm] = useState({
        name: program.name, start_date: program.start_date, end_date: program.end_date
    })
    const [isSavingDetails, setIsSavingDetails] = useState(false)
    const [detailsError, setDetailsError] = useState(null)

    const [isDeleting, setIsDeleting] = useState(false)

    const [downloadingId, setDownloadingId] = useState(null)

    const [deletingScoreId, setDeletingScoreId] = useState(null)

    useEffect(() => {
        if (!isOpen) return

        const fetchScores = async () => {
            setLoadingScores(true)
            const data = await getScores(program.id)
            setScores(data)
            setLoadingScores(false)
        }

        const fetchEvents = async () => {
            setLoadingEvents(true)
            try {
                const data = await getEvents(program.id)
                setEvents(data)
            } catch (error) {
                console.error('ProgramCard events error:', error)
                setEvents([])
            } finally {
                setLoadingEvents(false)
            }
        }

        fetchScores()
        fetchEvents()
    }, [isOpen, program.id])

    const sortedEvents = [...events].sort(
        (a, b) => new Date(a.start_date) - new Date(b.start_date)
    )

    const openModal = (modal) => {
        setMenuOpen(false)
        setEventError(null)
        setDetailsError(null)

        if (modal === 'editDetails') {
            setDetailsForm({
                name: program.name,
                start_date: program.start_date,
                end_date: program.end_date
            })
        }

        if (modal === 'addEvent') {
            setEventForm({ repertoire: '', type: 'rehearsal', location: '', start_date: '', end_date: '' })
        }

        setActiveModal(modal)
    }

    const handleCreateEvent = async () => {
        setIsSavingEvent(true)
        setEventError(null)

        const handleEventUpdated = (updated) => {
            setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
        }

        const handleEventDeleted = (eventId) => {
            setEvents((prev) => prev.filter((e) => e.id !== eventId))
        }

        try {
            const created = await createEvent(program.id, {
                repertoire: eventForm.repertoire,
                type: eventForm.type,
                location: eventForm.location,
                start_date: fromDatetimeLocal(eventForm.start_date),
                end_date: fromDatetimeLocal(eventForm.end_date)
            })

            setEvents((prev) => [...prev, created])
            setActiveModal(null)
        } catch (error) {
            console.error('Create event error:', error)
            setEventError(error?.response?.data?.message ?? 'Failed to create event')
        } finally {
            setIsSavingEvent(false)
        }
    }

    const handleUpdateDetails = async () => {
        setIsSavingDetails(true)
        setDetailsError(null)

        try {
            const updated = await updateProgram(program.id, {
                name: detailsForm.name,
                start_date: detailsForm.start_date,
                end_date: detailsForm.end_date
            })

            onProgramUpdated(updated)
            setActiveModal(null)
        } catch (error) {
            console.error('Update program error:', error)
            setDetailsError(error?.response?.data?.message ?? 'Failed to update program')
        } finally {
            setIsSavingDetails(false)
        }
    }

    const MAX_SCORE_SIZE = 10 * 1024 * 1024 // 10MB

    const handleFileSelected = async (e) => {
        const file = e.target.files[0]
        e.target.value = ''

        if (!file) return

        setUploadError(null)

        if (file.type !== 'application/pdf') {
            setUploadError('Only PDF files are allowed')
            return
        }

        if (file.size > MAX_SCORE_SIZE) {
            setUploadError('File must be under 10MB')
            return
        }

        setIsUploading(true)
        try {
            const created = await createScore(program.id, file)
            setScores((prev) => [...prev, created])
        } catch (error) {
            console.error('Upload score error:', error)
            setUploadError(error?.response?.data?.message ?? 'Failed to upload score')
        } finally {
            setIsUploading(false)
        }
    }

    const handleDownload = async (score) => {
        setDownloadingId(score.id)
        try {
            await downloadScore(program.id, score.id, score.original_name)
        } catch (error) {
            console.error('Download score error:', error)
            alert('Failed to download score')
        } finally {
            setDownloadingId(null)
        }
    }

    const handleDeleteScore = async (score) => {
        const confirmed = window.confirm(
            `Delete "${score.original_name}"? This action cannot be undone.`
        )
        if (!confirmed) return

        setDeletingScoreId(score.id)
        try {
            await deleteScore(program.id, score.id)
            setScores((prev) => prev.filter((s) => s.id !== score.id))
        } catch (error) {
            console.error('Delete score error:', error)
            alert('Failed to delete score')
        } finally {
            setDeletingScoreId(null)
        }
    }

    const handleDelete = async () => {
        setMenuOpen(false)

        const confirmed = window.confirm(
            `Delete "${program.name}"? This will also delete all its events and scores. This action cannot be undone.`
        )
        if (!confirmed) return

        setIsDeleting(true)
        try {
            await deleteProgram(program.id)
            onProgramDeleted(program.id)
        } catch (error) {
            console.error('Delete program error:', error)
            alert('Failed to delete program')
            setIsDeleting(false)
        }
    }

    const handleEventUpdated = (updated) => {
        setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
    }

    const handleEventDeleted = (eventId) => {
        setEvents((prev) => prev.filter((e) => e.id !== eventId))
    }

    return (
        <div style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '12px', position: 'relative', opacity: isDeleting ? 0.5 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div onClick={onToggle} style={{ cursor: 'pointer', flex: 1 }}>
                    <h3 style={{ margin: 0 }}>{program.name}</h3>
                    <p style={{ margin: '4px 0', fontSize: '0.9rem', opacity: 0.85 }}>
                        {new Date(program.start_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                        {' → '}
                        {new Date(program.end_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                </div>

                {canManage && (
                    <div style={{ position: 'relative' }}>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                setMenuOpen((prev) => !prev)
                            }}
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
                                <button type="button" onClick={(e) => { e.stopPropagation(); openModal('addEvent') }}
                                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer' }}>
                                    Add event
                                </button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); openModal('editDetails') }}
                                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer' }}>
                                    Edit details
                                </button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete() }}
                                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', color: 'red' }}>
                                    Delete program
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isOpen && (
                <div style={{ marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                    <h4>Events</h4>

                    {loadingEvents && <p>Loading...</p>}
                    {!loadingEvents && sortedEvents.length === 0 && <p>No events scheduled</p>}
                    {!loadingEvents && sortedEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            programId={program.id}
                            canManage={true}
                            onEventUpdated={handleEventUpdated}
                            onEventDeleted={handleEventDeleted}
                        />
                    ))}

                    <h4>Scores</h4>

                    <input
                        type="file"
                        accept="application/pdf"
                        ref={fileInputRef}
                        onChange={handleFileSelected}
                        style={{ display: 'none' }}
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        style={{ marginBottom: '8px' }}
                    >
                        {isUploading ? 'Uploading...' : 'Add score'}
                    </button>

                    {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}

                    {loadingScores && <p>Loading...</p>}
                    {!loadingScores && scores.length === 0 && <p>No scores available</p>}
                    {!loadingScores && scores.length > 0 && (
                        <ul>
                            {scores.map((score) => (
                                <li key={score.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                                    <span>{score.original_name}</span>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleDownload(score)}
                                            disabled={downloadingId === score.id}
                                        >
                                            {downloadingId === score.id ? 'Downloading...' : 'Download'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteScore(score)}
                                            disabled={deletingScoreId === score.id}
                                            style={{ color: 'red' }}
                                        >
                                            {deletingScoreId === score.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* MODAL: Add event */}
            {activeModal === 'addEvent' && (
                <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                        <h3>Add event</h3>

                        <label>
                            Repertoire
                            <input
                                value={eventForm.repertoire}
                                onChange={(e) => setEventForm({ ...eventForm, repertoire: e.target.value })}
                                disabled={isSavingEvent}
                            />
                        </label>

                        <label>
                            Type
                            <select
                                value={eventForm.type}
                                onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                                disabled={isSavingEvent}
                            >
                                {EVENT_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Location
                            <input
                                value={eventForm.location}
                                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                                disabled={isSavingEvent}
                            />
                        </label>

                        <label>
                            Start
                            <input
                                type="datetime-local"
                                value={eventForm.start_date}
                                onChange={(e) => setEventForm({ ...eventForm, start_date: e.target.value })}
                                disabled={isSavingEvent}
                            />
                        </label>

                        <label>
                            End
                            <input
                                type="datetime-local"
                                value={eventForm.end_date}
                                onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })}
                                disabled={isSavingEvent}
                            />
                        </label>

                        {eventError && <p style={{ color: 'red' }}>{eventError}</p>}

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={handleCreateEvent} disabled={isSavingEvent}>
                                {isSavingEvent ? 'Saving...' : 'Save'}
                            </button>
                            <button onClick={() => setActiveModal(null)} disabled={isSavingEvent}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: Edit details */}
            {activeModal === 'editDetails' && (
                <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                        <h3>Edit details</h3>

                        <label>
                            Name
                            <input
                                value={detailsForm.name}
                                onChange={(e) => setDetailsForm({ ...detailsForm, name: e.target.value })}
                                disabled={isSavingDetails}
                            />
                        </label>

                        <label>
                            Start date
                            <input
                                type="date"
                                value={detailsForm.start_date}
                                onChange={(e) => setDetailsForm({ ...detailsForm, start_date: e.target.value })}
                                disabled={isSavingDetails}
                            />
                        </label>

                        <label>
                            End date
                            <input
                                type="date"
                                value={detailsForm.end_date}
                                onChange={(e) => setDetailsForm({ ...detailsForm, end_date: e.target.value })}
                                disabled={isSavingDetails}
                            />
                        </label>

                        {detailsError && <p style={{ color: 'red' }}>{detailsError}</p>}

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={handleUpdateDetails} disabled={isSavingDetails}>
                                {isSavingDetails ? 'Saving...' : 'Save'}
                            </button>
                            <button onClick={() => setActiveModal(null)} disabled={isSavingDetails}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.4)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 100
}

const modalBoxStyle = {
    background: 'white', padding: '1rem', width: '320px',
    display: 'flex', flexDirection: 'column', gap: '0.5rem'
}

export default ProgramCard