import { useState } from 'react'
import { memberships, setMemberships } from '../mock/memberships'
import { users } from '../mock/users'

const SECTION_ORDER = [
    'violin_1', 'violin_2', 'viola', 'cello', 'double_bass',
    'french_horn', 'trumpet', 'trombone', 'tuba', 'flute',
    'oboe', 'clarinet', 'bassoon', 'percussion', 'mallet',
    'vocal', 'other'
]

const MEMBER_TYPE_ORDER = ['core', 'substitute', 'guest']

function MemberList({ orchestraId }) {

    const [members, setMembers] = useState(() =>
        memberships
            .filter((m) => m.orchestra_id === Number(orchestraId))
            .map((m) => ({
                ...m,
                user: users.find((u) => u.id === m.user_id)
            }))
    )

    const [editingMember, setEditingMember] = useState(null)

    const handleUpdate = (userId, updates) => {
        setMembers((prev) =>
            prev.map((m) =>
                m.user_id === userId
                    ? { ...m, ...updates }
                    : m
            )
        )

        setMembershipsStore((prev) =>
            prev.map((m) =>
                m.user_id === userId && m.orchestra_id === Number(orchestraId)
                    ? { ...m, ...updates }
                    : m
            )
        )
    }

    const handleRemove = (userId) => {
        setMembers((prev) =>
            prev.filter((m) => m.user_id !== userId)
        )

        setMembershipsStore((prev) =>
            prev.filter(
                (m) =>
                    !(m.user_id === userId &&
                        m.orchestra_id === Number(orchestraId))
            )
        )
    }

    const handleEdit = (userId, field, value) => {
        setMembers((prev) =>
            prev.map((m) =>
                m.user_id === userId
                    ? { ...m, [field]: value }
                    : m
            )
        )
    }

    if (members.length === 0) {
        return <p>No members found</p>
    }

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
                    <div key={section} style={{ marginBottom: '1rem' }}>
                        <h4>{section.replace('_', ' ').toUpperCase()}</h4>

                        <ul>
                            {sorted.map((m) => (
                                <li
                                    key={m.user_id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '1rem'
                                    }}
                                >
                                    <span>
                                        {m.user.last_name}, {m.user.name}{' '}
                                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                            [{m.member_type}]
                                        </span>
                                    </span>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>

                                        <button
                                            type="button"
                                            onClick={() => setEditingMember(m)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleRemove(m.user_id)}
                                            style={{ color: 'red' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            })}
            {editingMember && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '1rem',
                        width: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                    }}>

                        <h3>Edit member</h3>

                        {/* ROLE */}
                        <select
                            value={editingMember.role}
                            onChange={(e) =>
                                setEditingMember({
                                    ...editingMember,
                                    role: e.target.value
                                })
                            }
                        >
                            <option value="admin">admin</option>
                            <option value="member">member</option>
                        </select>

                        {/* MEMBER TYPE */}
                        <select
                            value={editingMember.member_type}
                            onChange={(e) =>
                                setEditingMember({
                                    ...editingMember,
                                    member_type: e.target.value
                                })
                            }
                        >
                            <option value="core">core</option>
                            <option value="substitute">substitute</option>
                            <option value="guest">guest</option>
                        </select>

                        {/* INSTRUMENT */}
                        <input
                            value={editingMember.instrument}
                            onChange={(e) =>
                                setEditingMember({
                                    ...editingMember,
                                    instrument: e.target.value
                                })
                            }
                        />

                        {/* SECTION */}
                        <select
                            value={editingMember.section}
                            onChange={(e) =>
                                setEditingMember({
                                    ...editingMember,
                                    section: e.target.value
                                })
                            }
                        >
                            {SECTION_ORDER.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>

                        {/* ACTIONS */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => {
                                    handleUpdate(editingMember.user_id, editingMember)
                                    setEditingMember(null)
                                }}
                            >
                                Save
                            </button>

                            <button onClick={() => setEditingMember(null)}>
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