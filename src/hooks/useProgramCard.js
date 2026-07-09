import { useState, useEffect, useRef } from 'react'
import { getScores, createScore, downloadScore, deleteScore } from '../services/scoreService'
import { getEvents, createEvent } from '../services/eventService'
import { updateProgram, deleteProgram } from '../services/programService'
import { fromDatetimeLocal } from '../utils/dates'
import { MAX_SCORE_SIZE } from '../constants/score'

export function useProgramCard(program, isOpen, onProgramUpdated, onProgramDeleted) {
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

    const closeModal = () => setActiveModal(null)

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

    const toggleMenu = () => setMenuOpen((prev) => !prev)
    const closeMenu = () => setMenuOpen(false)

    return {
        // scores
        scores,
        loadingScores,
        isUploading,
        uploadError,
        fileInputRef,
        handleFileSelected,
        handleDownload,
        downloadingId,
        handleDeleteScore,
        deletingScoreId,

        // events
        events,
        sortedEvents,
        loadingEvents,
        handleEventUpdated,
        handleEventDeleted,

        // menu
        menuOpen,
        toggleMenu,
        closeMenu,

        // modal (shared)
        activeModal,
        openModal,
        closeModal,

        // add event form
        eventForm,
        setEventForm,
        isSavingEvent,
        eventError,
        handleCreateEvent,

        // edit details form
        detailsForm,
        setDetailsForm,
        isSavingDetails,
        detailsError,
        handleUpdateDetails,

        // delete program
        isDeleting,
        handleDelete
    }
}