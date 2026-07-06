import client from '../api/client'

export const getOrchestraMemberships = async (orchestraId) => {
    const res = await client.get(`/orchestras/${orchestraId}/memberships`)
    return res.data.data ?? res.data
}

export const updateMembership = async (membershipId, data) => {
    const res = await client.put(`/memberships/${membershipId}`, data)
    return res.data.data ?? res.data
}

export const deleteMembership = async (membershipId) => {
    await client.delete(`/memberships/${membershipId}`)
}

export const createMembership = async (data) => {
    const res = await client.post('/memberships', data)
    return res.data.data ?? res.data
}