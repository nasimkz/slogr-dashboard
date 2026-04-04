import axios from "axios";
import store from "../store/store";

let base_url = import.meta.env.VITE_BASE_URL

const getHeaders = () => ({
    "Authorization": `Bearer ${store.getters.getToken}`
})

export async function getGroups(){
    const resp = await axios.get(`${base_url}/api/groups`, {headers: getHeaders()})
    return resp.data
}

export async function GroupListForm(size=1000) {
    const resp = await axios.get(`${base_url}/api/groups?size=${size}`, {headers: getHeaders()})
    return resp.data
}

export async function GroupsSessionsData(id){
    const resp = await axios.get(`${base_url}/api/get-group/${id}`, {headers: getHeaders()})
    return resp.data
}

export async function createGroup(payload) {
    const resp = await axios.post(`${base_url}/api/add-group`, payload, {headers: getHeaders()})
    return resp.data
}

export async function deleteGroup(id) {
    const resp = await axios.post(`${base_url}/api/delete-group`,{id: id}, {headers: getHeaders()})
    return resp.data
}

export async function updateGroup(payload) {
    const resp = await axios.post(`${base_url}/api/edit-group`, payload, {headers: getHeaders()})
    return resp.data
}
