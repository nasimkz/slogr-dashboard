import { ref, computed, isRef } from 'vue'

/**
 * Reactive search filter over a list.
 *
 * @param {Ref<Array>|Function} source - A Vue ref containing the array, or a getter function that returns the array.
 * @param {string[]} fields - Object fields to search against (default: ['name']).
 * @returns {{ query: Ref<string>, results: ComputedRef<Array> }}
 */
export function useSearch(source, fields = ['name']) {
    const query = ref('')

    const results = computed(() => {
        const items = isRef(source) ? source.value : source()
        const q = query.value.trim().toLowerCase()
        if (!q) return items ?? []
        return (items ?? []).filter(item =>
            fields.some(field => String(item[field] ?? '').toLowerCase().includes(q))
        )
    })

    return { query, results }
}
