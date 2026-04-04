import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { useFreshness } from '../useFreshness'

const NOW = new Date('2024-06-01T12:00:00Z').getTime()

describe('useFreshness — label', () => {
    beforeEach(() => {
        vi.setSystemTime(NOW)
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('returns "Just now" for a timestamp less than 1 minute ago', () => {
        const ts = ref(new Date(NOW - 30_000).toISOString())
        const { label } = useFreshness(ts)
        expect(label.value).toBe('Just now')
    })

    it('returns "Xm ago" for minutes ago', () => {
        const ts = ref(new Date(NOW - 5 * 60_000).toISOString())
        const { label } = useFreshness(ts)
        expect(label.value).toBe('5m ago')
    })

    it('returns "Xh ago" for hours ago', () => {
        const ts = ref(new Date(NOW - 3 * 60 * 60_000).toISOString())
        const { label } = useFreshness(ts)
        expect(label.value).toBe('3h ago')
    })

    it('returns "Xd ago" for days ago', () => {
        const ts = ref(new Date(NOW - 2 * 24 * 60 * 60_000).toISOString())
        const { label } = useFreshness(ts)
        expect(label.value).toBe('2d ago')
    })

    it('returns "Unknown" for null timestamp', () => {
        const ts = ref(null)
        const { label } = useFreshness(ts)
        expect(label.value).toBe('Unknown')
    })

    it('returns "Unknown" for invalid timestamp string', () => {
        const ts = ref('not-a-date')
        const { label } = useFreshness(ts)
        expect(label.value).toBe('Unknown')
    })
})

describe('useFreshness — isStale', () => {
    beforeEach(() => {
        vi.setSystemTime(NOW)
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('is not stale within the threshold', () => {
        const ts = ref(new Date(NOW - 5 * 60_000).toISOString())
        const { isStale } = useFreshness(ts, { staleAfterMinutes: 15 })
        expect(isStale.value).toBe(false)
    })

    it('is stale beyond the threshold', () => {
        const ts = ref(new Date(NOW - 20 * 60_000).toISOString())
        const { isStale } = useFreshness(ts, { staleAfterMinutes: 15 })
        expect(isStale.value).toBe(true)
    })

    it('is stale when timestamp is null', () => {
        const ts = ref(null)
        const { isStale } = useFreshness(ts)
        expect(isStale.value).toBe(true)
    })

    it('uses custom staleAfterMinutes', () => {
        const ts = ref(new Date(NOW - 2 * 60_000).toISOString())
        const { isStale } = useFreshness(ts, { staleAfterMinutes: 1 })
        expect(isStale.value).toBe(true)
    })

    it('reacts to timestamp ref changes', () => {
        const ts = ref(new Date(NOW - 20 * 60_000).toISOString())
        const { isStale } = useFreshness(ts, { staleAfterMinutes: 15 })
        expect(isStale.value).toBe(true)
        ts.value = new Date(NOW - 5 * 60_000).toISOString()
        expect(isStale.value).toBe(false)
    })
})
