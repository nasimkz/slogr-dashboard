import apiClient from './apiClient'

export async function getAlerts() {
    const resp = await apiClient.get('/api/alerts')
    return resp.data
}

export async function createAlert(payload) {
    const resp = await apiClient.post('/api/add-alert', payload)
    return resp.data
}

export async function updateAlert(payload) {
    const resp = await apiClient.post('/api/edit-alert', payload)
    return resp.data
}

export async function deleteAlert(payload) {
    const resp = await apiClient.post('/api/delete-alert', payload)
    return resp.data
}
