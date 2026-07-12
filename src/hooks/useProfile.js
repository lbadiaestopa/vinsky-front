import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    getMe,
    updateMe,
    updatePassword,
    deleteAccount,
} from '../services/userService'

function extractErrorMessage(error, fallback) {
    const laravelErrors = error?.response?.data?.errors

    if (laravelErrors) {
        return Object.values(laravelErrors).flat().join(' ')
    }

    return error?.response?.data?.message ?? fallback
}

export function useProfile() {
    const { updateUser, logout } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    const [form, setForm] = useState({
        name: '',
        last_name: '',
        email: '',
    })

    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        password: '',
    })

    const [isSaving, setIsSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState(null)
    const [saveError, setSaveError] = useState(null)

    const [isSavingPassword, setIsSavingPassword] = useState(false)
    const [passwordStatus, setPasswordStatus] = useState(null)
    const [passwordError, setPasswordError] = useState(null)

    const [isDeletingAccount, setIsDeletingAccount] = useState(false)

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const me = await getMe()
                const meData = me.data ?? me

                setForm({
                    name: meData.name ?? '',
                    last_name: meData.last_name ?? '',
                    email: meData.email ?? '',
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

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target

        setPasswordForm((prev) => ({
            ...prev,
            [name]: value,
        }))
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
                email: updated.email ?? '',
            })

            updateUser({
                name: updated.name,
                last_name: updated.last_name,
                email: updated.email,
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

    const handleSavePassword = async () => {
        setIsSavingPassword(true)
        setPasswordStatus(null)
        setPasswordError(null)

        try {
            await updatePassword(passwordForm)

            setPasswordForm({
                current_password: '',
                password: '',
                password_confirmation: '',
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

    return {
        loading,

        form,
        isSaving,
        saveStatus,
        saveError,

        passwordForm,
        isSavingPassword,
        passwordStatus,
        passwordError,

        isDeletingAccount,

        handleChange,
        handlePasswordChange,
        handleSave,
        handleSavePassword,
        handleDeleteAccount,
    }
}