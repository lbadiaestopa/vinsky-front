import client from '../api/client'

export async function getPrograms(orchestraId) {
    const response = await client.get(`/orchestras/${orchestraId}/programs`)

    return response.data.data
}