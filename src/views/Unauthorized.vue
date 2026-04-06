<template>
    <div class="pageHeight">
        <div class="bg">
            <Header />
            <div class="unauthorized-container">
                <div class="unauthorized-card">
                    <i class="fa-solid fa-lock unauthorized-icon"></i>
                    <h2>Access Restricted</h2>
                    <p>You don't have permission to view this page.</p>
                    <p class="subtitle">Contact your administrator to request access.</p>
                    <button @click="$router.go(-1)" class="btn-back">← Go Back</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../components/common/Header.vue'
export default {
    name: 'Unauthorized',
    components: { Header }
}
</script>

<style scoped>
.unauthorized-container { min-height: 60vh; display: flex; align-items: center; justify-content: center; }
.unauthorized-card { background: #121821; border: 1px solid #1E2835; border-radius: 12px; padding: 48px; text-align: center; max-width: 400px; }
.unauthorized-icon { font-size: 3rem; color: #4b5563; margin-bottom: 20px; display: block; }
h2 { color: #6b7280; margin-bottom: 12px; }
p { color: #9ca3af; margin-bottom: 8px; }
.subtitle { font-size: 0.9rem; margin-bottom: 24px; }
.btn-back { background: #1E2835; color: #9ca3af; border: none; border-radius: 8px; padding: 10px 20px; cursor: pointer; }
.btn-back:hover { background: #2d3a4a; color: white; }
</style>
