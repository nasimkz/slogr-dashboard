import { computed } from 'vue'
import store from '../store/store'

export function usePermission() {
    const can = (permission) => store.getters.hasPermission(permission)
    const canWrite = computed(() => !store.getters.isReadOnly)
    const role = computed(() => store.getters.userRole)
    const isAdmin = computed(() => store.getters.isAdmin)
    const isOperator = computed(() => store.getters.isOperator)
    const isViewer = computed(() => store.getters.isViewer)
    const readOnlyTitle = computed(() =>
        store.getters.isReadOnly ? 'License expired. Renew at license@slogr.io to enable.' : null
    )

    return { can, canWrite, role, isAdmin, isOperator, isViewer, readOnlyTitle }
}
