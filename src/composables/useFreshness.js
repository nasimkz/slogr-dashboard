import { computed } from 'vue'

/**
 * Returns a reactive freshness label and staleness flag for a timestamp.
 *
 * @param {Ref<string|number|null>} timestampRef - A Vue ref holding the ISO timestamp or epoch ms.
 * @param {object} [options]
 * @param {number} [options.staleAfterMinutes=15] - Minutes after which data is considered stale.
 * @returns {{ label: ComputedRef<string>, isStale: ComputedRef<boolean> }}
 */
export function useFreshness(timestampRef, { staleAfterMinutes = 15 } = {}) {
    const label = computed(() => {
        const ts = timestampRef.value
        if (!ts) return 'Unknown'
        const diffMs = Date.now() - new Date(ts).getTime()
        if (isNaN(diffMs) || diffMs < 0) return 'Unknown'
        const minutes = Math.floor(diffMs / 60_000)
        if (minutes < 1) return 'Just now'
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        return `${days}d ago`
    })

    const isStale = computed(() => {
        const ts = timestampRef.value
        if (!ts) return true
        const diffMs = Date.now() - new Date(ts).getTime()
        if (isNaN(diffMs) || diffMs < 0) return true
        return diffMs > staleAfterMinutes * 60_000
    })

    return { label, isStale }
}
