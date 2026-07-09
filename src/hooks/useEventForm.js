import { useState } from 'react'
import { updateEvent } from '../services/eventService'
import { toDatetimeLocal, fromDatetimeLocal } from '../utils/dates'

function createForm(event) {
    return {
        repertoire: event.repertoire,
        type: event.type,
        location: event.location,
        start_date: toDatetimeLocal(event.start_date),
        end_date: toDatetimeLocal(event.end_date)
    }
}

export function useEventForm(event, programId) {
    const [form, setForm] = useState(() => createForm(event))
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState(null)

    const reset = () => {
        setError(null)
        setForm(createForm(event))
    }

    const save = async () => {
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

            return updated
        } catch (err) {
            console.error('Update event error:', err)
            setError(err?.response?.data?.message ?? 'Failed to update event')
            return null
        } finally {
            setIsSaving(false)
        }
    }

    return {
        form,
        setForm,
        isSaving,
        error,
        save,
        reset
    }
}