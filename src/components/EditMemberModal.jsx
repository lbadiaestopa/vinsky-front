import { SECTION_ORDER, SECTION_ORDER_LABELS } from '../constants/membership'

function EditMemberModal({
    open,
    member,
    setMember,
    isSaving,
    onSave,
    onClose
}) {
    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 px-4">
            <div className="bg-white rounded-lg p-4 w-full max-w-sm flex flex-col gap-3">
                <h3 className="text-base font-semibold">Edit member</h3>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Role</span>

                    <select
                        value={member.role}
                        onChange={(e) =>
                            setMember({ ...member, role: e.target.value })
                        }
                        disabled={isSaving}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    >
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                    </select>
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Member type</span>

                    <select
                        value={member.member_type}
                        onChange={(e) =>
                            setMember({
                                ...member,
                                member_type: e.target.value
                            })
                        }
                        disabled={isSaving}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    >
                        <option value="core">Core</option>
                        <option value="substitute">Substitute</option>
                        <option value="guest">Guest</option>
                    </select>
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Instrument</span>

                    <input
                        value={member.instrument}
                        onChange={(e) =>
                            setMember({
                                ...member,
                                instrument: e.target.value
                            })
                        }
                        disabled={isSaving}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium ms-1">Section</span>

                    <select
                        value={member.section}
                        onChange={(e) =>
                            setMember({
                                ...member,
                                section: e.target.value
                            })
                        }
                        disabled={isSaving}
                        className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    >
                        {SECTION_ORDER.map((section) => (
                            <option key={section} value={section}>
                                {SECTION_ORDER_LABELS[section]}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="flex gap-2 mt-1">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="flex-1 rounded-lg border border-gray text-sm font-medium py-2 hover:bg-card-gray transition-colors focus:outline-none disabled:opacity-60 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onSave(member)}
                        disabled={isSaving}
                        className="flex-1 rounded-lg border border-black bg-black text-white text-sm font-medium py-2 cursor-pointer focus:outline-none disabled:opacity-60"
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>

                    
                </div>
            </div>
        </div>
    )
}

export default EditMemberModal