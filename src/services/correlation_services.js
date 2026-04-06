import apiClient from './apiClient'

export function getPathCorrelation(sessionId, from, to) {
    const params = new URLSearchParams()
    if (from) params.append('from', from)
    if (to) params.append('to', to)
    const qs = params.toString()
    return apiClient.get(`/api/sessions/${sessionId}/analytics/path-correlation${qs ? '?' + qs : ''}`)
}
