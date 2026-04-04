import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../store/store', () => ({
    default: {
        getters: { getToken: null },
        dispatch: vi.fn(),
    },
}))

vi.mock('../../router/index', () => ({
    default: { push: vi.fn() },
}))

import store from '../../store/store'
import router from '../../router/index'
import apiClient from '../apiClient'

describe('apiClient', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        store.getters.getToken = null
    })

    it('base URL comes from env var', () => {
        expect(apiClient.defaults.baseURL).toBe(
            import.meta.env.VITE_BASE_URL || ''
        )
    })

    it('has a 15 second timeout', () => {
        expect(apiClient.defaults.timeout).toBe(15000)
    })

    it('sets Content-Type to application/json by default', () => {
        expect(apiClient.defaults.headers['Content-Type']).toBe('application/json')
    })

    it('request interceptor adds Authorization header when token exists', async () => {
        store.getters.getToken = 'test-token-123'

        const [requestInterceptor] = apiClient.interceptors.request.handlers
        const config = { headers: {} }
        const result = requestInterceptor.fulfilled(config)

        expect(result.headers.Authorization).toBe('Bearer test-token-123')
    })

    it('request interceptor does not add Authorization when token is null', async () => {
        store.getters.getToken = null

        const [requestInterceptor] = apiClient.interceptors.request.handlers
        const config = { headers: {} }
        const result = requestInterceptor.fulfilled(config)

        expect(result.headers.Authorization).toBeUndefined()
    })

    it('response interceptor dispatches logout on 401', async () => {
        const [responseInterceptor] = apiClient.interceptors.response.handlers
        const error = { response: { status: 401 } }

        await expect(responseInterceptor.rejected(error)).rejects.toEqual(error)

        expect(store.dispatch).toHaveBeenCalledWith('logout')
        expect(router.push).toHaveBeenCalledWith({ name: 'Login' })
    })

    it('response interceptor does not redirect on non-401 errors', async () => {
        const [responseInterceptor] = apiClient.interceptors.response.handlers
        const error = { response: { status: 500 } }

        await expect(responseInterceptor.rejected(error)).rejects.toEqual(error)

        expect(store.dispatch).not.toHaveBeenCalled()
    })

    it('response interceptor passes successful responses through', () => {
        const [responseInterceptor] = apiClient.interceptors.response.handlers
        const response = { status: 200, data: { ok: true } }

        expect(responseInterceptor.fulfilled(response)).toBe(response)
    })
})
