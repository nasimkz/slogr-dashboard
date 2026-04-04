import axios from "axios";
import store from "../store/store";

let base_url = import.meta.env.VITE_BASE_URL

const getHeaders = () => ({
    "Authorization": `Bearer ${store.getters.getToken}`
})

export async function ReportsList() {
    const resp = await axios.get(`${base_url}/api/reports`, {headers: getHeaders()})
    return resp.data
}

export async function AddReports(payload) {
    const resp = await axios.post(`${base_url}/api/add-report`,payload, {headers: getHeaders()})
    return resp.data
}

export async function ReportDetail(id) {
    const resp = await axios.get(`${base_url}/api/get-report/${id}`, {headers: getHeaders()})
    return resp.data
}

export async function UpdateReport(payload) {
    const resp = await axios.post(`${base_url}/api/edit-report`,payload, {headers: getHeaders()})
    return resp.data
}

export async function DeleteReport(payload) {
    const resp = await axios.post(`${base_url}/api/delete-report`,payload, {headers: getHeaders()})
    return resp.data
}
