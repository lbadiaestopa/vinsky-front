function OrchestraSettings({
    orchestra,
    isSaving,
    isDeleting,
    saveStatus,
    onChange,
    onSave,
    onDelete,
}) {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>

            <div className="flex flex-col gap-4 max-w-sm">
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Name</span>
                    <input
                        name="name"
                        value={orchestra.name}
                        onChange={onChange}
                        disabled={isSaving}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Location</span>
                    <input
                        name="location"
                        value={orchestra.location}
                        onChange={onChange}
                        disabled={isSaving}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    />
                </label>

                <button
                    type="button"
                    onClick={onSave}
                    disabled={isSaving}
                    className="rounded-lg border border-black bg-black text-white text-sm font-medium py-2 cursor-pointer focus:outline-none disabled:opacity-60"
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </button>

                {saveStatus === 'success' && (
                    <p className="text-sm text-green-600">
                        Changes saved successfully
                    </p>
                )}

                {saveStatus === 'error' && (
                    <p className="text-sm text-red">
                        Error saving changes
                    </p>
                )}

                <hr className="border-gray my-4" />

                <button
                    type="button"
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="rounded-lg bg-red border border-red text-white text-sm font-medium py-2 px-4 cursor-pointer focus:outline-none disabled:opacity-60"
                >
                    {isDeleting ? 'Deleting...' : 'Delete orchestra'}
                </button>
            </div>
        </div>
    )
}

export default OrchestraSettings