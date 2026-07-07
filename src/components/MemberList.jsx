import { useState, useEffect } from 'react'
import {
    getOrchestraMemberships,
    updateMembership,
    deleteMembership
} from '../services/membershipService'

const SECTION_ORDER = [
    'violin_1', 'violin_2', 'viola', 'cello', 'double_bass',
    'french_horn', 'trumpet', 'trombone', 'tuba', 'flute',
    'oboe', 'clarinet', 'bassoon', 'percussion', 'mallet',
    'vocal', 'other'
]

const MEMBER_TYPE_ORDER = ['core', 'substitute', 'guest']

function MemberList({ orchestraId, refreshKey }) {
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingMember, setEditingMember] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true)
            try {
                const data = await getOrchestraMemberships(orchestraId)
                setMembers(data)
            } catch (err) {
                console.error('MemberList load error:', err)
                setError('Failed to load members')
            } finally {
                setLoading(false)
            }
        }

        fetchMembers()
    }, [orchestraId, refreshKey])

    const handleUpdate = async (membership) => {
        setIsSaving(true)
        setError(null)

        try {
            const updated = await updateMembership(membership.id, {
                role: membership.role,
                member_type: membership.member_type,
                instrument: membership.instrument,
                section: membership.section
            })

            setMembers((prev) =>
                prev.map((m) => (m.id === updated.id ? updated : m))
            )
        } catch (err) {
            console.error('Update membership error:', err)
            setError('Failed to update member')
        } finally {
            setIsSaving(false)
        }
    }

    const handleRemove = async (membershipId) => {
        setError(null)

        try {
            await deleteMembership(membershipId)
            setMembers((prev) => prev.filter((m) => m.id !== membershipId))
        } catch (err) {
            console.error('Remove membership error:', err)
            setError('Failed to remove member')
        }
    }

    if (loading) return <p className="text-sm">Loading members...</p>
    if (error) return <p className="text-sm text-red">{error}</p>
    if (members.length === 0) return <p className="text-sm">No members found</p>

    const grouped = members.reduce((acc, member) => {
        const section = member.section || 'other'
        if (!acc[section]) acc[section] = []
        acc[section].push(member)
        return acc
    }, {})

    return (
        <div>
            {SECTION_ORDER.map((section) => {
                const sectionMembers = grouped[section]
                if (!sectionMembers?.length) return null

                const sorted = [...sectionMembers].sort((a, b) => {
                    const typeDiff =
                        MEMBER_TYPE_ORDER.indexOf(a.member_type) -
                        MEMBER_TYPE_ORDER.indexOf(b.member_type)

                    if (typeDiff !== 0) return typeDiff

                    return (a.user.last_name || '').localeCompare(
                        b.user.last_name || ''
                    )
                })

                return (
                    <div key={section} className="mb-4">
                        <h4 className="text-sm font-semibold mb-2">{section.replace('_', ' ').toUpperCase()}</h4>

                        <ul className="flex flex-col gap-1">
                            {sorted.map((m) => (
                                <li
                                    key={m.id}
                                    className="flex justify-between items-center gap-4 bg-card-gray rounded-lg px-3 py-2"
                                >
                                    <span className="text-sm">
                                        {m.user.last_name}, {m.user.name}{' '}
                                        <span className="text-xs opacity-70">
                                            [{m.member_type}]
                                        </span>
                                    </span>

                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setEditingMember({ ...m })}
                                            className="rounded-full px-2 py-1 hover:bg-gray transition-colors focus:outline-none cursor-pointer flex items-center"
                                        >
                                            <span className="material-symbols-outlined text-base!">edit</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleRemove(m.id)}
                                            className="rounded-full text-red px-2 py-1 hover:bg-gray transition-colors focus:outline-none cursor-pointer flex items-center"
                                        >
                                            <span className="material-symbols-outlined text-base!">delete</span>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            })}

            {editingMember && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 px-4">
                    <div className="bg-white rounded-lg p-4 w-full max-w-sm flex flex-col gap-3">
                        <h3 className="text-base font-semibold">Edit member</h3>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Role</span>
                            <select
                                value={editingMember.role}
                                onChange={(e) =>
                                    setEditingMember({ ...editingMember, role: e.target.value })
                                }
                                disabled={isSaving}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            >
                                <option value="admin">admin</option>
                                <option value="member">member</option>
                            </select>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Member type</span>
                            <select
                                value={editingMember.member_type}
                                onChange={(e) =>
                                    setEditingMember({ ...editingMember, member_type: e.target.value })
                                }
                                disabled={isSaving}
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
                                value={editingMember.instrument}
                                onChange={(e) =>
                                    setEditingMember({ ...editingMember, instrument: e.target.value })
                                }
                                disabled={isSaving}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium ms-1">Section</span>
                            <select
                                value={editingMember.section}
                                onChange={(e) =>
                                    setEditingMember({ ...editingMember, section: e.target.value })
                                }
                                disabled={isSaving}
                                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                            >
                                {SECTION_ORDER.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={async () => {
                                    await handleUpdate(editingMember)
                                    setEditingMember(null)
                                }}
                                disabled={isSaving}
                                className="flex-1 rounded-lg border border-black bg-black text-white text-sm font-medium py-2 cursor-pointer focus:outline-none disabled:opacity-60"
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>

                            <button
                                onClick={() => setEditingMember(null)}
                                disabled={isSaving}
                                className="flex-1 rounded-lg border border-gray text-sm font-medium py-2 hover:bg-card-gray transition-colors focus:outline-none disabled:opacity-60 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MemberList