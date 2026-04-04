import apiClient from './apiClient'

export async function ProfileList() {
    const resp = await apiClient.get('/api/profiles')
    return resp.data
}

export async function ProfileListForm(size = 1000) {
    const resp = await apiClient.get(`/api/profiles?size=${size}`)
    return resp.data
}

export async function createMonitor(payload) {
    const resp = await apiClient.post('/api/add-profile', payload)
    return resp.data
}

export async function updateMonitor(payload) {
    const resp = await apiClient.post('/api/add-profile', payload)
    return resp.data
}

export async function deleteMonitor(id) {
    const resp = await apiClient.post('/api/delete-profile', { id })
    return resp.data
}
