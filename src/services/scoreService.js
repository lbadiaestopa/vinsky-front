import client from '../api/client'

export const getScores = async (programId) => {
    // TODO: endpoint encara no connectat / sense scores a la DB.
    // Ajusta la ruta quan tinguis l'endpoint real.
    try {
        const res = await client.get(`/programs/${programId}/scores`)
        return res.data.data ?? res.data
    } catch (error) {
        console.error('getScores error:', error)
        return []
    }
}