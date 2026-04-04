import { computed } from 'vue'

/**
 * Derives a reactive online/offline status for an agent based on its last-seen timestamp.
 *
 * @param {Ref<string|number|null>} timestampRef - A Vue ref holding the last-seen ISO timestamp or epoch ms.
 * @param {object} [options]
 * @param {number} [options.offlineAfterMinutes=5] - Minutes of silence before the agent is considered offline.
 * @returns {{ status: ComputedRef<'online'|'offline'|'unknown'>, label: ComputedRef<string> }}
 */
export function useAgentStatus(timestampRef, { offlineAfterMinutes = 5 } = {}) {
    const status = computed(() => {
        const ts = timestampRef.value
        if (!ts) return 'unknown'
        const diffMs = Date.now() - new Date(ts).getTime()
        if (isNaN(diffMs) || diffMs < 0) return 'unknown'
        return diffMs <= offlineAfterMinutes * 60_000 ? 'online' : 'offline'
    })

    const label = computed(() => {
        const s = status.value
        if (s === 'online') return 'Online'
        if (s === 'offline') return 'Offline'
        return 'Unknown'
    })

    return { status, label }
}
