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
        <div className={`border border-gray rounded-lg p-4 mb-3 relative ${isDeleting ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-start">
                <div onClick={onToggle} className="cursor-pointer flex-1">
                    <h3 className="text-base font-semibold">{program.name}</h3>
                    <p className="text-sm opacity-85 my-1">
                        {new Date(program.start_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {' - '}
                        {new Date(program.end_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                </div>

                {canManage && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                setMenuOpen((prev) => !prev)
                            }}
                            className="bg-transparent border-none text-lg cursor-pointer px-2 focus:outline-none"
                        >
                            <span className="material-symbols-outlined text-xl! rounded-full hover:bg-gray transition-colors px-2 py-1">more_vert</span>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-full bg-white border border-gray rounded-lg shadow-md z-10 min-w-35">
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); openModal('editDetails') }}
                                    className="block w-full text-left text-sm px-3 py-2 hover:bg-card-gray transition-colors focus:outline-none cursor-pointer"
                                >
                                    Edit details
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleDelete() }}
                                    className="block w-full text-left text-sm px-3 py-2 text-red hover:bg-card-gray transition-colors focus:outline-none cursor-pointer"
                                >
                                    Delete program
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isOpen && (
                <div className="mt-3 border-t border-gray pt-3">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-semibold">Events</h4>

                        <button
                            type="button"
                            onClick={() => openModal('addEvent')}
                            className="rounded-lg border border-gray hover:bg-card-gray transition-colors text-sm font-medium pl-2 pr-3 py-1.5 cursor-pointer focus:outline-none flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-xl!">add</span>
                            Add event
                        </button>
                    </div>

                    {loadingEvents && <p className="text-sm">Loading...</p>}
                    {!loadingEvents && sortedEvents.length === 0 && <p className="text-sm">No events scheduled</p>}
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

                    <hr className="border-gray mb-4 mt-4" />

                    <div className="flex justify-between items-center mt-4 mb-2">
                        <h4 className="text-sm font-semibold ms-1">Scores</h4>

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="rounded-lg border border-gray hover:bg-card-gray transition-colors text-sm font-medium pl-2 pr-3 py-1.5 cursor-pointer focus:outline-none flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-xl!">add</span>
                            {isUploading ? 'Uploading...' : 'Add score'}
                        </button>
                    </div>

                    {uploadError && <p className="text-sm text-red">{uploadError}</p>}

                    {loadingScores && <p className="text-sm">Loading...</p>}
                    {!loadingScores && scores.length === 0 && <p className="text-sm">No scores available</p>}
                    {!loadingScores && scores.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                            {scores.map((score) => (
                                <div key={score.id} className="bg-card-gray rounded-lg p-3 flex justify-between items-center gap-2">
                                    <span className="text-sm truncate">{score.original_name}</span>
                                    <div className="flex gap-1 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleDownload(score)}
                                            disabled={downloadingId === score.id}
                                            className="px-2 py-1 hover:bg-gray rounded-full transition-colors focus:outline-none cursor-pointer disabled:opacity-60 flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-lg!">
                                                {downloadingId === score.id ? 'progress_activity' : 'download'}
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteScore(score)}
                                            disabled={deletingScoreId === score.id}
                                            className="rounded-full text-sm px-2 py-1 text-red hover:bg-gray transition-colors focus:outline-none cursor-pointer disabled:opacity-60"
                                        >
                                            <span className="material-symbols-outlined text-lg!">
                                                {deletingScoreId === score.id ? 'progress_activity' : 'delete'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* MODAL: Add event */}
            {activeModal === 'addEvent' && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 px-4">
                    <div className="bg-white rounded-lg p-4 w-full max-w-sm flex flex-col gap-3">
                        <h3 className="text-base font-semibold ms-1">Add event</h3>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Repertoire</span>
                            <input
                                value={eventForm.repertoire}
                                onChange={(e) => setEventForm({ ...eventForm, repertoire: e.target.value })}
                                disabled={isSavingEvent}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Type</span>
                            <select
                                value={eventForm.type}
                                onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                                disabled={isSavingEvent}
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
                                value={eventForm.location}
                                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                                disabled={isSavingEvent}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Start</span>
                            <input
                                type="datetime-local"
                                value={eventForm.start_date}
                                onChange={(e) => setEventForm({ ...eventForm, start_date: e.target.value })}
                                disabled={isSavingEvent}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">End</span>
                            <input
                                type="datetime-local"
                                value={eventForm.end_date}
                                onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })}
                                disabled={isSavingEvent}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        {eventError && <p className="text-sm text-red">{eventError}</p>}

                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={() => setActiveModal(null)}
                                disabled={isSavingEvent}
                                className="flex-1 rounded-lg border border-gray text-sm font-medium py-2 hover:bg-card-gray transition-colors focus:outline-none disabled:opacity-60 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateEvent}
                                disabled={isSavingEvent}
                                className="flex-1 rounded-lg border border-black bg-black text-white text-sm font-medium py-2 cursor-pointer focus:outline-none disabled:opacity-60"
                            >
                                {isSavingEvent ? 'Saving...' : 'Save'}
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: Edit details */}
            {activeModal === 'editDetails' && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 px-4">
                    <div className="bg-white rounded-lg p-4 w-full max-w-sm flex flex-col gap-3">
                        <h3 className="text-base font-semibold ms-1">Edit details</h3>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Name</span>
                            <input
                                value={detailsForm.name}
                                onChange={(e) => setDetailsForm({ ...detailsForm, name: e.target.value })}
                                disabled={isSavingDetails}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Start date</span>
                            <input
                                type="date"
                                value={detailsForm.start_date}
                                onChange={(e) => setDetailsForm({ ...detailsForm, start_date: e.target.value })}
                                disabled={isSavingDetails}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">End date</span>
                            <input
                                type="date"
                                value={detailsForm.end_date}
                                onChange={(e) => setDetailsForm({ ...detailsForm, end_date: e.target.value })}
                                disabled={isSavingDetails}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        {detailsError && <p className="text-sm text-red">{detailsError}</p>}

                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={() => setActiveModal(null)}
                                disabled={isSavingDetails}
                                className="flex-1 rounded-lg border border-gray text-sm font-medium py-2 hover:bg-card-gray transition-colors focus:outline-none disabled:opacity-60 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateDetails}
                                disabled={isSavingDetails}
                                className="flex-1 rounded-lg border border-black bg-black text-white text-sm font-medium py-2 cursor-pointer focus:outline-none disabled:opacity-60"
                            >
                                {isSavingDetails ? 'Saving...' : 'Save'}
                            </button>
                            
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProgramCard