import client from '../api/client'

export async function getOrchestras() {
    const response = await client.get('/orchestras')

    return response.data.data
}