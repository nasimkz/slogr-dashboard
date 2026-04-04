import axios from "axios"
import store from "../store/store"

let base_url = import.meta.env.VITE_BASE_URL

const getHeaders = () => ({
    "Authorization": `Bearer ${store.getters.getToken}`
})

export async function getOrganization(){
    const resp = await axios.get(`${base_url}/api/organizations`, {headers: getHeaders()})
    return resp.data
}

export async function editOrganization(payload){
    const resp = await axios.post(`${base_url}/api/edit-organization`,payload, {headers: getHeaders()})
    return resp.data
}

export async function addOrganization(payload){
    const resp = await axios.post(`${base_url}/api/add-organization`,payload, {headers: getHeaders()})
    return resp.data
}

export async function assignOrganization(payload){
    const resp = await axios.post(`${base_url}/api/assign-organization`,payload, {headers: getHeaders()})
    return resp.data
}
