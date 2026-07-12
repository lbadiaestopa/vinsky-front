import FormInput from '../FormInput'

function PasswordForm({
    passwordForm,
    isSaving,
    passwordStatus,
    passwordError,
    onChange,
    onSave,
}) {
    return (
        <>
            <h2 className="text-base font-semibold mb-4 ms-1">
                Change password
            </h2>

            <div className="flex flex-col gap-4 max-w-sm">
                <FormInput
                    label="Current password"
                    name="current_password"
                    type="password"
                    value={passwordForm.current_password}
                    onChange={onChange}
                    disabled={isSaving}
                />

                <FormInput
                    label="New password"
                    name="password"
                    type="password"
                    value={passwordForm.password}
                    onChange={onChange}
                    disabled={isSaving}
                />

                <button
                    type="button"
                    onClick={onSave}
                    disabled={isSaving}
                    className="rounded-lg border border-black bg-black text-white text-sm font-medium py-2 hover:cursor-pointer focus:outline-none disabled:opacity-60"
                >
                    {isSaving ? 'Saving...' : 'Change password'}
                </button>

                {passwordStatus === 'success' && (
                    <p className="text-sm">
                        Password updated successfully
                    </p>
                )}

                {passwordError && (
                    <p className="text-sm text-red">
                        {passwordError}
                    </p>
                )}
            </div>
        </>
    )
}

export default PasswordForm