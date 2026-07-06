import client from '../api/client'

export async function getMe() {
    const response = await client.get('/me')
    return response.data
}

export async function updateMe(data) {
    const response = await client.put('/me', data)
    return response.data.data ?? response.data
}

export async function updatePassword(data) {
    const response = await client.put('/me/password', data)
    return response.data.data ?? response.data
}

export async function deleteAccount() {
    await client.delete('/me')
}