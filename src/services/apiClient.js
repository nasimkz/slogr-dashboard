import axios from 'axios'
import store from '../store/store'
import router from '../router/index'

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || '',
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use(config => {
    const token = store.getters.getToken
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            store.dispatch('logout')
            router.push({ name: 'Login' })
        }
        return Promise.reject(error)
    }
)

export default apiClient
