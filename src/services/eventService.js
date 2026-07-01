import client from '../api/client'

export async function getEvents(programId) {
    const response = await client.get(`/programs/${programId}/events`)
    return response.data.data
}