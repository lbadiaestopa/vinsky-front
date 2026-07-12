function CreateProgramModal({
    open,
    form,
    setForm,
    loading,
    error,
    onCreate,
    onClose
}) {
    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 px-4">
            <div className="bg-white rounded-lg p-4 w-full max-w-sm flex flex-col gap-3">
                <h3 className="text-base font-semibold">Add program</h3>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Name</span>
                    <input
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        disabled={loading}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Start date</span>
                    <input
                        type="date"
                        value={form.start_date}
                        onChange={(e) =>
                            setForm({ ...form, start_date: e.target.value })
                        }
                        disabled={loading}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">End date</span>
                    <input
                        type="date"
                        value={form.end_date}
                        onChange={(e) =>
                            setForm({ ...form, end_date: e.target.value })
                        }
                        disabled={loading}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    />
                </label>

                {error && (
                    <p className="text-sm text-red">
                        {error}
                    </p>
                )}

                <div className="flex gap-2 mt-1">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 rounded-lg border border-gray text-sm font-medium py-2 hover:bg-card-gray transition-colors focus:outline-none disabled:opacity-60 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onCreate}
                        disabled={loading}
                        className="flex-1 rounded-lg border border-black bg-black text-white text-sm font-medium py-2 cursor-pointer focus:outline-none disabled:opacity-60"
                    >
                        {loading ? 'Saving...' : 'Create'}
                    </button>


                </div>
            </div>
        </div>
    )
}

export default CreateProgramModal