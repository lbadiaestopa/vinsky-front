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

    if (loading) return <p>Loading...</p>

    return (
        <div>
            <h1>My Profile</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
                <label>
                    Name
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={isSaving}
                        style={{ opacity: isSaving ? 0.6 : 1 }}
                    />
                </label>

                <label>
                    Last name
                    <input
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        disabled={isSaving}
                        style={{ opacity: isSaving ? 0.6 : 1 }}
                    />
                </label>

                <label>
                    Email
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={isSaving}
                        style={{ opacity: isSaving ? 0.6 : 1 }}
                    />
                </label>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{ opacity: isSaving ? 0.6 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </button>

                {saveStatus === 'success' && (
                    <p style={{ color: 'green' }}>Changes saved successfully</p>
                )}
                {saveError && (
                    <p style={{ color: 'red' }}>{saveError}</p>
                )}
            </div>

            <hr style={{ margin: '2rem 0' }} />

            <h2>Change password</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
                <label>
                    Current password
                    <input
                        name="current_password"
                        type="password"
                        value={passwordForm.current_password}
                        onChange={handlePasswordChange}
                        disabled={isSavingPassword}
                        style={{ opacity: isSavingPassword ? 0.6 : 1 }}
                    />
                </label>

                <label>
                    New password
                    <input
                        name="password"
                        type="password"
                        value={passwordForm.password}
                        onChange={handlePasswordChange}
                        disabled={isSavingPassword}
                        style={{ opacity: isSavingPassword ? 0.6 : 1 }}
                    />
                </label>

                <button
                    type="button"
                    onClick={handleSavePassword}
                    disabled={isSavingPassword}
                    style={{ opacity: isSavingPassword ? 0.6 : 1, cursor: isSavingPassword ? 'not-allowed' : 'pointer' }}
                >
                    {isSavingPassword ? 'Saving...' : 'Change password'}
                </button>

                {passwordStatus === 'success' && (
                    <p style={{ color: 'green' }}>Password updated successfully</p>
                )}
                {passwordError && (
                    <p style={{ color: 'red' }}>{passwordError}</p>
                )}
            </div>

            <hr style={{ margin: '2rem 0' }} />

            <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                style={{ color: 'red' }}
            >
                {isDeletingAccount ? 'Deleting...' : 'Delete account'}
            </button>
        </div>
    )
}

export default Profile