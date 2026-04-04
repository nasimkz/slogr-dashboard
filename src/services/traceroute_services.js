import axios from "axios";
import store from "../store/store";

let base_url = import.meta.env.VITE_BASE_URL

const getHeaders = () => ({
    "Authorization": `Bearer ${store.getters.getToken}`
})

export async function getTraceroute(sessionId) {
    const resp = await axios.get(`${base_url}/api/traceroute?sid=${sessionId}`, { headers: getHeaders() })
    return resp.data
}
