import axios from 'axios'
import store from '../store/store'
import router from '../router/index'

export function setupInterceptors() {
    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                store.dispatch('logout')
                router.push({ name: 'Login' })
            }
            return Promise.reject(error)
        }
    )
}
