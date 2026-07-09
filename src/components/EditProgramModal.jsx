import FormInput from './FormInput'

function EditProgramModal({
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
                <h3 className="text-base font-semibold ms-1">Edit details</h3>

                <FormInput
                    label="Name"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                    disabled={isSaving}
                />

                <FormInput
                    label="Start date"
                    type="date"
                    value={form.start_date}
                    onChange={(e) =>
                        setForm({ ...form, start_date: e.target.value })
                    }
                    disabled={isSaving}
                />

                <FormInput
                    label="End date"
                    type="date"
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

export default EditProgramModal