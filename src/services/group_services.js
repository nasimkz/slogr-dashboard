import apiClient from './apiClient'

export async function getGroups() {
    const resp = await apiClient.get('/api/groups')
    return resp.data
}

export async function GroupListForm(size = 1000) {
    const resp = await apiClient.get(`/api/groups?size=${size}`)
    return resp.data
}

export async function GroupsSessionsData(id) {
    const resp = await apiClient.get(`/api/get-group/${id}`)
    return resp.data
}

export async function createGroup(payload) {
    const resp = await apiClient.post('/api/add-group', payload)
    return resp.data
}

export async function deleteGroup(id) {
    const resp = await apiClient.post('/api/delete-group', { id })
    return resp.data
}

export async function updateGroup(payload) {
    const resp = await apiClient.post('/api/edit-group', payload)
    return resp.data
}
