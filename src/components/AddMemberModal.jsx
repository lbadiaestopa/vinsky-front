import { formatSection } from '../utils/formatSection'

function AddMemberModal({
    open,
    form,
    setForm,
    loading,
    error,
    sectionOptions,
    onCreate,
    onClose
}) {
    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 px-4">
            <div className="bg-white rounded-lg p-4 w-full max-w-sm flex flex-col gap-3">
                <h3 className="text-base font-semibold">Add member</h3>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Email</span>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        disabled={loading}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Role</span>
                    <select
                        value={form.role}
                        onChange={(e) =>
                            setForm({ ...form, role: e.target.value })
                        }
                        disabled={loading}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    >
                        <option value="admin">admin</option>
                        <option value="member">member</option>
                    </select>
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Member type</span>
                    <select
                        value={form.member_type}
                        onChange={(e) =>
                            setForm({ ...form, member_type: e.target.value })
                        }
                        disabled={loading}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    >
                        <option value="core">core</option>
                        <option value="substitute">substitute</option>
                        <option value="guest">guest</option>
                    </select>
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Instrument</span>
                    <input
                        value={form.instrument}
                        onChange={(e) =>
                            setForm({ ...form, instrument: e.target.value })
                        }
                        disabled={loading}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Section</span>
                    <select
                        value={form.section}
                        onChange={(e) =>
                            setForm({ ...form, section: e.target.value })
                        }
                        disabled={loading}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    >
                        {sectionOptions.map((section) => (
                            <option key={section} value={section}>
                                {formatSection(section)}
                            </option>
                        ))}
                    </select>
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

export default AddMemberModal