import client from '../api/client'

export async function getPrograms(orchestraId) {
    const response = await client.get(`/orchestras/${orchestraId}/programs`)
    return response.data.data
}

export async function updateProgram(programId, data) {
    const response = await client.put(`/programs/${programId}`, data)
    return response.data.data ?? response.data
}

export async function deleteProgram(programId) {
    await client.delete(`/programs/${programId}`)
}

export async function createProgram(orchestraId, data) {
    const response = await client.post(`/orchestras/${orchestraId}/programs`, data)
    return response.data.data ?? response.data
}