import apiClient from './apiClient'

export async function getTraceroutes(sessionId = null, page = 1, size = 50) {
    const params = new URLSearchParams({ page, size })
    if (sessionId) params.append('session_id', sessionId)
    const resp = await apiClient.get(`/api/traceroutes?${params}`)
    return resp.data
}

export async function getTracerouteBySession(sessionId) {
    const resp = await apiClient.get(`/api/traceroutes/${sessionId}`)
    return resp.data
}
