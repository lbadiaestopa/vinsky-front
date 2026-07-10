import { useState, useEffect } from 'react'
import {
    getOrchestraMemberships,
    updateMembership,
    deleteMembership
} from '../services/membershipService'
import EditMemberModal from './EditMemberModal'
import { useMemberList } from '../hooks/useMemberList'
import {
    SECTION_ORDER,
    MEMBER_TYPE_ORDER
} from '../constants/membership'

function MemberList({ orchestraId, refreshKey }) {
    const [editingMember, setEditingMember] = useState(null)

    const {
        members,
        loading,
        isSaving,
        error,
        updateMember,
        removeMember
    } = useMemberList(orchestraId, refreshKey)

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
                                            onClick={() => {
                                                const confirmed = window.confirm(
                                                    `Remove ${m.user.name} ${m.user.last_name} from the orchestra?`
                                                )

                                                if (!confirmed) return

                                                removeMember(m.id)
                                            }}
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

            <EditMemberModal
                open={!!editingMember}
                member={editingMember}
                setMember={setEditingMember}
                isSaving={isSaving}
                onSave={async (member) => {
                    await updateMember(member)
                    setEditingMember(null)
                }}
                onClose={() => setEditingMember(null)}
            />
        </div>
    )
}

export default MemberList