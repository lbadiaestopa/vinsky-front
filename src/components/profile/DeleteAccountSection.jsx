function DeleteAccountSection({
    isDeleting,
    onDelete,
}) {
    return (
        <div className="max-w-sm">
            <h2 className="text-base font-semibold mb-2 ms-1">
                Delete account
            </h2>

            <p className="text-sm text-gray-600 mb-4 ms-1">
                Permanently delete your account and all your memberships. This
                action cannot be undone.
            </p>

            <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className="rounded-lg border bg-red text-white text-sm font-medium py-2 px-4 hover:cursor-pointer focus:outline-none disabled:opacity-60"
            >
                {isDeleting ? 'Deleting...' : 'Delete account'}
            </button>
        </div>
    )
}

export default DeleteAccountSection