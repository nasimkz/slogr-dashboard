import { ref } from 'vue'

export function useApi(apiFn, options = {}) {
    const data = ref(options.initialData ?? null)
    const loading = ref(false)
    const error = ref(null)

    async function execute(...args) {
        loading.value = true
        error.value = null
        try {
            data.value = await apiFn(...args)
        } catch (err) {
            error.value = err.response?.data?.message
                ?? err.message
                ?? 'An error occurred'
        } finally {
            loading.value = false
        }
    }

    return { data, loading, error, execute }
}
