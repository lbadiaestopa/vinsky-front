import client from '../api/client'

export const getScores = async (programId) => {
    try {
        const res = await client.get(`/programs/${programId}/scores`)
        return res.data.data ?? res.data
    } catch (error) {
        console.error('getScores error:', error)
        return []
    }
}

export const createScore = async (programId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('original_name', file.name)

    const res = await client.post(`/programs/${programId}/scores`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data.data ?? res.data
}

export const downloadScore = async (programId, scoreId, filename) => {
    const res = await client.get(`/programs/${programId}/scores/${scoreId}/download`, {
        responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}

export const deleteScore = async (programId, scoreId) => {
    await client.delete(`/programs/${programId}/scores/${scoreId}`)
}