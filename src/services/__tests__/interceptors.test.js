import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock dependencies before importing the module
vi.mock('../../store/store', () => ({
    default: {
        dispatch: vi.fn(),
    },
}))

vi.mock('../../router/index', () => ({
    default: {
        push: vi.fn(),
    },
}))

vi.mock('axios', () => {
    const interceptors = {
        request: { use: vi.fn(), handlers: [] },
        response: { use: vi.fn(), handlers: [] },
    }
    return {
        default: {
            interceptors,
        },
    }
})

import axios from 'axios'
import store from '../../store/store'
import router from '../../router/index'
import { setupInterceptors } from '../interceptors'

describe('setupInterceptors', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('registers a response interceptor', () => {
        setupInterceptors()
        expect(axios.interceptors.response.use).toHaveBeenCalledOnce()
    })

    it('the error handler dispatches logout on 401', async () => {
        setupInterceptors()
        const [, errorHandler] = axios.interceptors.response.use.mock.calls[0]

        const error = { response: { status: 401 } }
        await expect(errorHandler(error)).rejects.toEqual(error)

        expect(store.dispatch).toHaveBeenCalledWith('logout')
        expect(router.push).toHaveBeenCalledWith({ name: 'Login' })
    })

    it('the error handler does not redirect on non-401 errors', async () => {
        setupInterceptors()
        const [, errorHandler] = axios.interceptors.response.use.mock.calls[0]

        const error = { response: { status: 403 } }
        await expect(errorHandler(error)).rejects.toEqual(error)

        expect(store.dispatch).not.toHaveBeenCalled()
        expect(router.push).not.toHaveBeenCalled()
    })

    it('the success handler passes the response through unchanged', () => {
        setupInterceptors()
        const [successHandler] = axios.interceptors.response.use.mock.calls[0]

        const response = { data: { foo: 'bar' }, status: 200 }
        expect(successHandler(response)).toBe(response)
    })
})
