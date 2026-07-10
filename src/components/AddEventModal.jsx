import FormInput from './FormInput'
import { EVENT_TYPES_ORDER, EVENT_TYPE_LABELS } from '../constants/eventTypes'

function AddEventModal({
    open,
    form,
    setForm,
    isSaving,
    error,
    onSave,
    onClose
}) {
    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 px-4">
            <div className="bg-white rounded-lg p-4 w-full max-w-sm flex flex-col gap-3">
                <h3 className="text-base font-semibold ms-1">Add event</h3>

                <FormInput
                    label="Repertoire"
                    value={form.repertoire}
                    onChange={(e) =>
                        setForm({ ...form, repertoire: e.target.value })
                    }
                    disabled={isSaving}
                />

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium ms-1">
                        Type
                    </label>

                    <select
                        value={form.type}
                        onChange={(e) =>
                            setForm({ ...form, type: e.target.value })
                        }
                        disabled={isSaving}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                    >
                        {EVENT_TYPES_ORDER.map((type) => (
                            <option key={type} value={type}>
                                {EVENT_TYPE_LABELS[type]}
                            </option>
                        ))}
                    </select>
                </div>

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

                {error && <p className="text-sm text-red">{error}</p>}

                <div className="flex gap-2 mt-1">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="flex-1 rounded-lg border border-gray text-sm font-medium py-2 hover:bg-card-gray transition-colors focus:outline-none disabled:opacity-60 cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onSave}
                        disabled={isSaving}
                        className="flex-1 rounded-lg border border-black bg-black text-white text-sm font-medium py-2 cursor-pointer focus:outline-none disabled:opacity-60"
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddEventModal