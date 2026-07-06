import client from '../api/client'

export async function getOrchestras() {
    const response = await client.get('/orchestras')

    return response.data.data
}

export const updateOrchestra = async (id, data) => {
    const res = await client.put(`/orchestras/${id}`, data)
    return res.data.data ?? res.data
}

export const createOrchestra = async (data) => {
    const res = await client.post('/orchestras', data)
    return res.data.data ?? res.data
}

export const deleteOrchestra = async (id) => {
    await client.delete(`/orchestras/${id}`)
}