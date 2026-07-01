import client from '../api/client'

export async function getMe() {
  const response = await client.get('/me')
  return response.data
}