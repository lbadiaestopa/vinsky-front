import ProfileForm from '../components/profile/ProfileForm'
import PasswordForm from '../components/profile/PasswordForm'
import DeleteAccountSection from '../components/profile/DeleteAccountSection'
import { useProfile } from '../hooks/useProfile'

function Profile() {
    const profile = useProfile()

    if (profile.loading) {
        return <p className="p-8 text-sm">Loading...</p>
    }

    return (
        <div className="bg-white min-h-screen p-8">
            <h1 className="text-2xl font-semibold mb-6 ms-1">
                My Profile
            </h1>

            <ProfileForm
                form={profile.form}
                isSaving={profile.isSaving}
                saveStatus={profile.saveStatus}
                saveError={profile.saveError}
                onChange={profile.handleChange}
                onSave={profile.handleSave}
            />

            <hr className="border-gray-200 my-8 max-w-sm" />

            <PasswordForm
                passwordForm={profile.passwordForm}
                isSaving={profile.isSavingPassword}
                passwordStatus={profile.passwordStatus}
                passwordError={profile.passwordError}
                onChange={profile.handlePasswordChange}
                onSave={profile.handleSavePassword}
            />

            <hr className="border-gray-200 my-8 max-w-sm" />

            <DeleteAccountSection
                isDeleting={profile.isDeletingAccount}
                onDelete={profile.handleDeleteAccount}
            />
        </div>
    )
}

export default Profile