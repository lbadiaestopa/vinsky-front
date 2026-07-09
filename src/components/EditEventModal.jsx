import FormInput from './FormInput'
import { EVENT_TYPES_ORDER, EVENT_TYPE_LABELS } from '../constants/eventTypes'
import { useEventForm } from '../hooks/useEventForm'

function EditEventModal({
    open,
    event,
    programId,
    onClose,
    onSaved
}) {
    const {
        form,
        setForm,
        isSaving,
        error,
        save,
        reset
    } = useEventForm(event, programId)

    if (!open) return null

    const handleClose = () => {
        reset()
        onClose()
    }

    const handleSave = async () => {
        const updated = await save()

        if (!updated) return

        onSaved(updated)
        handleClose()
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 px-4">
            <div className="bg-white rounded-lg p-4 w-full max-w-sm flex flex-col gap-3">
                <h3 className="text-base font-semibold">Edit event</h3>

                <FormInput
                    label="Repertoire"
                    value={form.repertoire}
                    onChange={(e) =>
                        setForm({ ...form, repertoire: e.target.value })
                    }
                    disabled={isSaving}
                />

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Type</span>

                    <select
                        value={form.type}
                        onChange={(e) =>
                            setForm({ ...form, type: e.target.value })
                        }
                        disabled={isSaving}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    >
                        {EVENT_TYPES_ORDER.map((type) => (
                            <option
                                key={type}
                                value={type}
                            >
                                {EVENT_TYPE_LABELS[type]}
                            </option>
                        ))}
                    </select>
                </label>

                <FormInput
                    label="Location"
                    value={form.location}
                    onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                    }
                    disabled={isSaving}
                />

                <FormInput
                    label="Start"
                    type="datetime-local"
                    value={form.start_date}
                    onChange={(e) =>
                        setForm({ ...form, start_date: e.target.value })
                    }
                    disabled={isSaving}
                />

                <FormInput
                    label="End"
                    type="datetime-local"
                    value={form.end_date}
                    onChange={(e) =>
                        setForm({ ...form, end_date: e.target.value })
                    }
                    disabled={isSaving}
                />

                {error && (
                    <p className="text-sm text-red">
                        {error}
                    </p>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 rounded-lg border border-black bg-black text-white text-sm font-medium py-2 cursor-pointer focus:outline-none disabled:opacity-60"
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>

                    <button
                        onClick={handleClose}
                        disabled={isSaving}
                        className="flex-1 rounded-lg border border-gray text-sm font-medium py-2 hover:bg-card-gray transition-colors focus:outline-none disabled:opacity-60 cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditEventModal