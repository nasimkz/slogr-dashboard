import axios from "axios"
import store from "../store/store"

let base_url = import.meta.env.VITE_BASE_URL

const getHeaders = () => ({
    "Authorization": `Bearer ${store.getters.getToken}`
})

export async function ProfileList() {
    const resp = await axios.get(`${base_url}/api/profiles`, {headers: getHeaders()})
    return resp.data
}

export async function ProfileListForm(size=1000) {
    const resp = await axios.get(`${base_url}/api/profiles?size=${size}`, {headers: getHeaders()})
    return resp.data
}

export async function createMonitor(payload) {
    const resp = await axios.post(`${base_url}/api/add-profile`, payload, {headers: getHeaders()})
    return resp.data
}
export async function updateMonitor(payload) {
    const resp = await axios.post(`${base_url}/api/add-profile`, payload, {headers: getHeaders()})
    return resp.data
}

export async function deleteMonitor(id) {
    const resp = await axios.post(`${base_url}/api/delete-profile`, {id: id}, {headers: getHeaders()})
    return resp.data
}
