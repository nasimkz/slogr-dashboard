import apiClient from './apiClient'

export async function getSessionsDetails(id) {
    const resp = await apiClient.get(`/api/getsession?sid=${id}`)
    return resp.data
}
