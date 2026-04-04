import axios from "axios"
import store from "../store/store"

let base_url = import.meta.env.VITE_BASE_URL

const getHeaders = () => ({
    "Authorization": `Bearer ${store.getters.getToken}`
})

export async function getAlerts(){
    const resp = await axios.get(`${base_url}/api/alerts`, {headers: getHeaders()})
    return resp.data
}

export async function createAlert(payload) {
    const resp = await axios.post(`${base_url}/api/add-alert`, payload, {headers: getHeaders()})
    return resp.data
}

export async function updateAlert(payload) {
    const resp = await axios.post(`${base_url}/api/edit-alert`, payload, {headers: getHeaders()})
    return resp.data
}

export async function deleteAlert(payload) {
    const resp = await axios.post(`${base_url}/api/delete-alert`, payload, {headers: getHeaders()})
    return resp.data
}
