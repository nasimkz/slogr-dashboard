import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { useAgentStatus } from '../useAgentStatus'

const NOW = new Date('2024-06-01T12:00:00Z').getTime()

describe('useAgentStatus — status', () => {
    beforeEach(() => {
        vi.setSystemTime(NOW)
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('is "online" when last seen within offlineAfterMinutes', () => {
        const ts = ref(new Date(NOW - 2 * 60_000).toISOString())
        const { status } = useAgentStatus(ts, { offlineAfterMinutes: 5 })
        expect(status.value).toBe('online')
    })

    it('is "offline" when last seen beyond offlineAfterMinutes', () => {
        const ts = ref(new Date(NOW - 10 * 60_000).toISOString())
        const { status } = useAgentStatus(ts, { offlineAfterMinutes: 5 })
        expect(status.value).toBe('offline')
    })

    it('is "unknown" when timestamp is null', () => {
        const ts = ref(null)
        const { status } = useAgentStatus(ts)
        expect(status.value).toBe('unknown')
    })

    it('is "unknown" when timestamp is invalid', () => {
        const ts = ref('not-a-date')
        const { status } = useAgentStatus(ts)
        expect(status.value).toBe('unknown')
    })

    it('uses default offlineAfterMinutes of 5', () => {
        const ts = ref(new Date(NOW - 4 * 60_000).toISOString())
        const { status } = useAgentStatus(ts)
        expect(status.value).toBe('online')
        const ts2 = ref(new Date(NOW - 6 * 60_000).toISOString())
        const { status: status2 } = useAgentStatus(ts2)
        expect(status2.value).toBe('offline')
    })

    it('reacts to timestamp ref changes', () => {
        const ts = ref(new Date(NOW - 10 * 60_000).toISOString())
        const { status } = useAgentStatus(ts, { offlineAfterMinutes: 5 })
        expect(status.value).toBe('offline')
        ts.value = new Date(NOW - 1 * 60_000).toISOString()
        expect(status.value).toBe('online')
    })
})

describe('useAgentStatus — label', () => {
    beforeEach(() => {
        vi.setSystemTime(NOW)
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('returns "Online" when online', () => {
        const ts = ref(new Date(NOW - 1 * 60_000).toISOString())
        const { label } = useAgentStatus(ts)
        expect(label.value).toBe('Online')
    })

    it('returns "Offline" when offline', () => {
        const ts = ref(new Date(NOW - 10 * 60_000).toISOString())
        const { label } = useAgentStatus(ts)
        expect(label.value).toBe('Offline')
    })

    it('returns "Unknown" when no timestamp', () => {
        const ts = ref(null)
        const { label } = useAgentStatus(ts)
        expect(label.value).toBe('Unknown')
    })
})
