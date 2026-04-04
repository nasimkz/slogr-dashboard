import apiClient from './apiClient'

export async function sessionsList(page = 1, size = 10) {
    const resp = await apiClient.get(`/api/sessions?page=${page}&size=${size}`)
    return resp.data
}

export async function getSessionsResults(id, page = 1) {
    const resp = await apiClient.get(`/api/analytics?sid=${id}&page=${page}`)
    return resp.data
}

export async function addSessions(payload) {
    const resp = await apiClient.post('/api/add-session', payload)
    return resp.data
}

export async function updateSessions(payload) {
    const resp = await apiClient.post('/api/add-session', payload)
    return resp.data
}

export async function deleteSessions(payload) {
    const resp = await apiClient.post('/api/delete-session', payload)
    return resp.data
}

export async function getSessionsNames() {
    const resp = await apiClient.get('/api/sessionnames')
    return resp.data
}

export async function runSession(id) {
    const resp = await apiClient.post('/api/run-session', { sid: id })
    return resp.data
}
