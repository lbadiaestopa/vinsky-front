import FormInput from '../FormInput'

function ProfileForm({
    form,
    isSaving,
    saveStatus,
    saveError,
    onChange,
    onSave,
}) {
    return (
        <div className="flex flex-col gap-4 max-w-sm">
            <FormInput
                label="Name"
                name="name"
                value={form.name}
                onChange={onChange}
                disabled={isSaving}
            />

            <FormInput
                label="Last name"
                name="last_name"
                value={form.last_name}
                onChange={onChange}
                disabled={isSaving}
            />

            <FormInput
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                disabled={isSaving}
            />

            <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="rounded-lg border border-black bg-black text-white text-sm font-medium py-2 hover:cursor-pointer focus:outline-none disabled:opacity-60"
            >
                {isSaving ? 'Saving...' : 'Save'}
            </button>

            {saveStatus === 'success' && (
                <p className="text-sm">
                    Changes saved successfully
                </p>
            )}

            {saveError && (
                <p className="text-sm text-red">
                    {saveError}
                </p>
            )}
        </div>
    )
}

export default ProfileForm