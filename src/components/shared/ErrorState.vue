<template>
    <div class="alert alert-danger d-flex align-items-center" role="alert">
        <i class="fa-solid fa-circle-exclamation me-2"></i>
        <div>
            {{ message || 'Something went wrong. Please try again.' }}
            <button v-if="onRetry" @click="onRetry" class="btn btn-sm btn-outline-danger ms-2">
                Retry
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ErrorState',
    props: {
        message: {
            type: String,
            default: null
        },
        onRetry: {
            type: Function,
            default: null
        }
    }
}
</script>
