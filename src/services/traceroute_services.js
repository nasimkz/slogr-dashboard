import axios from "axios";
import store from "../store/store";

let base_url = import.meta.env.VITE_BASE_URL

const getHeaders = () => ({
    "Authorization": `Bearer ${store.getters.getToken}`
})

export async function getTraceroutes(sessionId = null, page = 1, size = 50) {
    const params = new URLSearchParams({ page, size });
    if (sessionId) params.append('session_id', sessionId);
    const resp = await axios.get(`${base_url}/api/traceroutes?${params}`, { headers: getHeaders() })
    return resp.data
}

export async function getTracerouteBySession(sessionId) {
    const resp = await axios.get(`${base_url}/api/traceroutes/${sessionId}`, { headers: getHeaders() })
    return resp.data
}
