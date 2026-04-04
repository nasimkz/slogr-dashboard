import apiClient from './apiClient'

export async function getOrganization() {
    const resp = await apiClient.get('/api/organizations')
    return resp.data
}

export async function editOrganization(payload) {
    const resp = await apiClient.post('/api/edit-organization', payload)
    return resp.data
}

export async function addOrganization(payload) {
    const resp = await apiClient.post('/api/add-organization', payload)
    return resp.data
}

export async function assignOrganization(payload) {
    const resp = await apiClient.post('/api/assign-organization', payload)
    return resp.data
}
