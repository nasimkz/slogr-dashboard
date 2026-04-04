import apiClient from './apiClient'

export async function ReportsList() {
    const resp = await apiClient.get('/api/reports')
    return resp.data
}

export async function AddReports(payload) {
    const resp = await apiClient.post('/api/add-report', payload)
    return resp.data
}

export async function ReportDetail(id) {
    const resp = await apiClient.get(`/api/get-report/${id}`)
    return resp.data
}

export async function UpdateReport(payload) {
    const resp = await apiClient.post('/api/edit-report', payload)
    return resp.data
}

export async function DeleteReport(payload) {
    const resp = await apiClient.post('/api/delete-report', payload)
    return resp.data
}
