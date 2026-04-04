<template>
    <div class="text-center py-5 text-muted">
        <i :class="icon" class="fs-1 mb-3 d-block"></i>
        <h5>{{ title }}</h5>
        <p v-if="message">{{ message }}</p>
        <slot />
    </div>
</template>

<script>
export default {
    name: 'EmptyState',
    props: {
        icon: {
            type: String,
            default: 'fa-solid fa-inbox'
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            default: null
        }
    }
}
</script>
