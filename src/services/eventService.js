import client from '../api/client'

export async function getEvents(programId) {
    const response = await client.get(`/programs/${programId}/events`)
    return response.data.data
}

export async function createEvent(programId, data) {
    const response = await client.post(`/programs/${programId}/events`, data)
    return response.data.data ?? response.data
}

export async function updateEvent(programId, eventId, data) {
    const response = await client.put(`/programs/${programId}/events/${eventId}`, data)
    return response.data.data ?? response.data
}

export async function deleteEvent(programId, eventId) {
    await client.delete(`/programs/${programId}/events/${eventId}`)
}