import { describe, it, expect, vi } from 'vitest'
import { useApi } from '../useApi'

describe('useApi', () => {
    it('sets loading true during request', async () => {
        let resolveRequest
        const slowFn = () => new Promise(r => { resolveRequest = r })
        const { loading, execute } = useApi(slowFn)

        const promise = execute()
        expect(loading.value).toBe(true)

        resolveRequest()
        await promise
        expect(loading.value).toBe(false)
    })

    it('sets data on success', async () => {
        const { data, execute } = useApi(() =>
            Promise.resolve({ items: [1, 2, 3] })
        )
        await execute()
        expect(data.value).toEqual({ items: [1, 2, 3] })
    })

    it('sets error message from err.message on failure', async () => {
        const { error, execute } = useApi(() =>
            Promise.reject(new Error('Network error'))
        )
        await execute()
        expect(error.value).toBe('Network error')
    })

    it('prefers err.response.data.message when available', async () => {
        const apiError = { response: { data: { message: 'Not Found' } }, message: 'Request failed' }
        const { error, execute } = useApi(() => Promise.reject(apiError))
        await execute()
        expect(error.value).toBe('Not Found')
    })

    it('falls back to generic message when no message available', async () => {
        const { error, execute } = useApi(() => Promise.reject({}))
        await execute()
        expect(error.value).toBe('An error occurred')
    })

    it('loading is false after error', async () => {
        const { loading, execute } = useApi(() =>
            Promise.reject(new Error('fail'))
        )
        await execute()
        expect(loading.value).toBe(false)
    })

    it('clears error on retry', async () => {
        let calls = 0
        const fn = () => {
            calls++
            if (calls === 1) return Promise.reject(new Error('fail'))
            return Promise.resolve('ok')
        }
        const { error, execute } = useApi(fn)
        await execute()
        expect(error.value).toBeTruthy()
        await execute()
        expect(error.value).toBeNull()
    })

    it('uses initialData option', () => {
        const { data } = useApi(() => Promise.resolve(), { initialData: [] })
        expect(data.value).toEqual([])
    })

    it('passes arguments through to the API function', async () => {
        const mockFn = vi.fn().mockResolvedValue('result')
        const { execute } = useApi(mockFn)
        await execute('arg1', 'arg2')
        expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('error is null before first call', () => {
        const { error } = useApi(() => Promise.resolve())
        expect(error.value).toBeNull()
    })
})
