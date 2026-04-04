import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDebounceFn } from '../useDebounceFn'

describe('useDebounceFn', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('does not call fn immediately', () => {
        const fn = vi.fn()
        const debounced = useDebounceFn(fn, 300)
        debounced('a')
        expect(fn).not.toHaveBeenCalled()
    })

    it('calls fn after the delay elapses', () => {
        const fn = vi.fn()
        const debounced = useDebounceFn(fn, 300)
        debounced('a')
        vi.advanceTimersByTime(300)
        expect(fn).toHaveBeenCalledOnce()
    })

    it('passes arguments through to fn', () => {
        const fn = vi.fn()
        const debounced = useDebounceFn(fn, 300)
        debounced('hello', 42)
        vi.advanceTimersByTime(300)
        expect(fn).toHaveBeenCalledWith('hello', 42)
    })

    it('cancels the previous pending call when called again', () => {
        const fn = vi.fn()
        const debounced = useDebounceFn(fn, 300)
        debounced('first')
        vi.advanceTimersByTime(100)
        debounced('second')
        vi.advanceTimersByTime(300)
        expect(fn).toHaveBeenCalledOnce()
        expect(fn).toHaveBeenCalledWith('second')
    })

    it('uses the default delay of 300ms', () => {
        const fn = vi.fn()
        const debounced = useDebounceFn(fn)
        debounced()
        vi.advanceTimersByTime(299)
        expect(fn).not.toHaveBeenCalled()
        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledOnce()
    })

    it('can be called multiple times after delay elapses', () => {
        const fn = vi.fn()
        const debounced = useDebounceFn(fn, 100)
        debounced('a')
        vi.advanceTimersByTime(100)
        debounced('b')
        vi.advanceTimersByTime(100)
        expect(fn).toHaveBeenCalledTimes(2)
    })
})
