import apiClient from './apiClient'

export async function agentList(page = 1) {
    const resp = await apiClient.get(`/api/agents?page=${page}`)
    return resp.data
}

export async function agentListForm(size = 1000) {
    const resp = await apiClient.get(`/api/agents?size=${size}`)
    return resp.data
}

export async function createAgent(payload) {
    const resp = await apiClient.post('/api/add-agent', payload)
    return resp.data
}

export async function agentUpdate(payload) {
    const resp = await apiClient.post('/api/edit-agent', payload)
    return resp.data
}

export async function fetchClusters(id) {
    const resp = await apiClient.get(`/api/cluster?group=${id}`)
    return resp.data
}

export async function fetchSessions(group_id) {
    const resp = await apiClient.get(`/api/links?group=${group_id}`)
    return resp.data
}

export async function fetchAgentlinks(id) {
    const resp = await apiClient.get(`/api/agentlinks?aid=${id}`)
    return resp.data
}

export async function fetchGroups() {
    const resp = await apiClient.get('/api/groups')
    return resp.data
}

export async function fetchGroupData() {
    const resp = await apiClient.get('/api/groups')
    const groups = resp.data
    const linkResults = await Promise.all(
        groups.map(group =>
            apiClient.get(`/api/links?group=${group.id}&profiles=true`)
        )
    )
    const linkData = {}
    groups.forEach((group, i) => {
        linkData[group.id] = linkResults[i].data
    })
    return linkData
}

export async function fetchClustersData() {
    const resp = await apiClient.get('/api/groups')
    const groups = resp.data
    const clusterResults = await Promise.all(
        groups.map(group =>
            apiClient.get(`/api/cluster?group=${group.id}`)
        )
    )
    const clusterdata = {}
    groups.forEach((group, i) => {
        clusterdata[group.id] = clusterResults[i].data
    })
    return clusterdata
}

export async function agentRefSessions(id) {
    const resp = await apiClient.get(`/api/get-ref-sessions?aid=${id}`)
    return resp.data
}
