import { useState, useEffect } from 'react'
import {
    getOrchestraMemberships,
    updateMembership,
    deleteMembership
} from '../services/membershipService'

export function useMemberList(orchestraId, refreshKey) {
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchMembers() {
            setLoading(true)
            setError(null)

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

    async function updateMember(member) {
        setIsSaving(true)
        setError(null)

        try {
            const updated = await updateMembership(member.id, {
                role: member.role,
                member_type: member.member_type,
                instrument: member.instrument,
                section: member.section
            })

            setMembers((prev) =>
                prev.map((m) => (m.id === updated.id ? updated : m))
            )
        } catch (err) {
            console.error('Update membership error:', err)
            setError('Failed to update member')
            throw err
        } finally {
            setIsSaving(false)
        }
    }

    async function removeMember(membershipId) {
        setError(null)

        try {
            await deleteMembership(membershipId)

            setMembers((prev) =>
                prev.filter((m) => m.id !== membershipId)
            )
        } catch (err) {
            console.error('Remove membership error:', err)
            setError('Failed to remove member')
            throw err
        }
    }

    return {
        members,
        loading,
        isSaving,
        error,
        updateMember,
        removeMember
    }
}