import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMe, updateMe, updatePassword, deleteAccount } from '../services/userService'
import { useNavigate } from 'react-router-dom'

function extractErrorMessage(error, fallback) {
    const laravelErrors = error?.response?.data?.errors
    if (laravelErrors) {
        return Object.values(laravelErrors).flat().join(' ')
    }

    return error?.response?.data?.message ?? fallback
}

function Profile() {
    const { updateUser, logout } = useAuth()
    const navigate = useNavigate()

    const [isDeletingAccount, setIsDeletingAccount] = useState(false)

    const [form, setForm] = useState({ name: '', last_name: '', email: '' })
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState(null)
    const [saveError, setSaveError] = useState(null)

    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        password: '',
    })
    const [isSavingPassword, setIsSavingPassword] = useState(false)
    const [passwordStatus, setPasswordStatus] = useState(null)
    const [passwordError, setPasswordError] = useState(null)

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const me = await getMe()
                const meData = me.data ?? me

                setForm({
                    name: meData.name ?? '',
                    last_name: meData.last_name ?? '',
                    email: meData.email ?? ''
                })
            } catch (error) {
                console.error('Profile load error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMe()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        setSaveStatus(null)
        setSaveError(null)

        try {
            const updated = await updateMe(form)

            setForm({
                name: updated.name ?? '',
                last_name: updated.last_name ?? '',
                email: updated.email ?? ''
            })

            updateUser({
                name: updated.name,
                last_name: updated.last_name,
                email: updated.email
            })

            setSaveStatus('success')
        } catch (error) {
            console.error('Update profile error:', error)
            setSaveError(extractErrorMessage(error, 'Failed to update profile'))
        } finally {
            setIsSaving(false)
            setTimeout(() => setSaveStatus(null), 2000)
        }
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSavePassword = async () => {
        setIsSavingPassword(true)
        setPasswordStatus(null)
        setPasswordError(null)

        try {
            await updatePassword(passwordForm)

            setPasswordForm({
                current_password: '',
                password: '',
                password_confirmation: ''
            })

            setPasswordStatus('success')
        } catch (error) {
            console.error('Update password error:', error)
            setPasswordError(extractErrorMessage(error, 'Failed to update password'))
        } finally {
            setIsSavingPassword(false)
            setTimeout(() => setPasswordStatus(null), 2000)
        }
    }

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Delete your account? This will permanently remove your profile and all your memberships. This action cannot be undone.'
        )
        if (!confirmed) return

        setIsDeletingAccount(true)
        try {
            await deleteAccount()
            logout()
            navigate('/login')
        } catch (error) {
            console.error('Delete account error:', error)
            alert('Failed to delete account')
            setIsDeletingAccount(false)
        }
    }

    if (loading) return <p className="p-8 text-sm">Loading...</p>

    return (
        <div className="bg-white min-h-screen p-8">
            <h1 className="text-2xl font-semibold mb-6 ms-1">My Profile</h1>

            <div className="flex flex-col gap-4 max-w-sm">
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Name</span>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={isSaving}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Last name</span>
                    <input
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        disabled={isSaving}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Email</span>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={isSaving}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    />
                </label>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-lg border border-black bg-black text-white text-sm font-medium py-2 hover:cursor-pointer focus:outline-none disabled:opacity-60"
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </button>

                {saveStatus === 'success' && (
                    <p className="text-sm">Changes saved successfully</p>
                )}
                {saveError && (
                    <p className="text-sm text-red">{saveError}</p>
                )}
            </div>

            <hr className="border-gray-200 my-8 max-w-sm" />

            <h2 className="text-base font-semibold mb-4 ms-1">Change password</h2>

            <div className="flex flex-col gap-4 max-w-sm">
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Current password</span>
                    <input
                        name="current_password"
                        type="password"
                        value={passwordForm.current_password}
                        onChange={handlePasswordChange}
                        disabled={isSavingPassword}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">New password</span>
                    <input
                        name="password"
                        type="password"
                        value={passwordForm.password}
                        onChange={handlePasswordChange}
                        disabled={isSavingPassword}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    />
                </label>

                <button
                    type="button"
                    onClick={handleSavePassword}
                    disabled={isSavingPassword}
                    className="rounded-lg border border-black bg-black text-white text-sm font-medium py-2 hover:cursor-pointer focus:outline-none disabled:opacity-60"
                >
                    {isSavingPassword ? 'Saving...' : 'Change password'}
                </button>

                {passwordStatus === 'success' && (
                    <p className="text-sm">Password updated successfully</p>
                )}
                {passwordError && (
                    <p className="text-sm text-red">{passwordError}</p>
                )}
            </div>

            <hr className="border-gray-200 my-8 max-w-sm" />

            <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="rounded-lg border bg-red text-white text-sm font-medium py-2 px-4 hover:cursor-pointer focus:outline-none disabled:opacity-60"
            >
                {isDeletingAccount ? 'Deleting...' : 'Delete account'}
            </button>
        </div>
    )
}

export default Profile