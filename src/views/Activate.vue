<template>
    <div class="activate-page">
        <div class="activate-card">
            <div class="logo">slog<span>r</span></div>
            <h2>Welcome to Slogr Enterprise</h2>
            <p class="subtitle">Activate your license to get started</p>

            <div class="label">Your Installation ID</div>
            <div class="id-box">
                <code>{{ installationId || 'Loading...' }}</code>
                <button class="copy-btn" @click="copyId">{{ copied ? 'Copied!' : 'Copy' }}</button>
            </div>

            <a :href="mailtoLink" class="btn btn-mailto">&#9993; Request License Key</a>

            <div class="divider">Already have a key?</div>

            <div v-if="error" class="alert alert-error">{{ error }}</div>
            <div v-if="success" class="alert alert-success">{{ success }}</div>

            <input type="text" v-model="licenseKey" placeholder="SLOGR-XXXX-XXXX-XXXX-..." class="key-input" />

            <button class="btn btn-activate" @click="activate" :disabled="!licenseKey || loading">
                {{ loading ? 'Activating...' : 'Activate' }}
            </button>
        </div>
    </div>
</template>

<script>
import apiClient from '../services/apiClient'

export default {
    name: 'Activate',
    data() {
        return {
            licenseKey: '',
            error: '',
            success: '',
            loading: false,
            copied: false,
        }
    },
    computed: {
        installationId() {
            return this.$store.getters.installationId
        },
        mailtoLink() {
            const id = this.installationId || ''
            return `mailto:license@slogr.io?subject=Slogr%20Enterprise%20License%20Request&body=Installation%20ID%3A%20${id}%0A%0ACompany%20Name%3A%20%5Bplease%20fill%20in%5D%0AYour%20Name%3A%20%5Bplease%20fill%20in%5D%0A%0ANote%3A%20Please%20send%20this%20email%20from%20your%20corporate%20email%20address.`
        }
    },
    async mounted() {
        await this.$store.dispatch('fetchLicenseStatus')
    },
    methods: {
        async copyId() {
            try {
                await navigator.clipboard.writeText(this.installationId)
                this.copied = true
                setTimeout(() => { this.copied = false }, 2000)
            } catch {
                // fallback
            }
        },
        async activate() {
            this.error = ''
            this.success = ''
            this.loading = true
            try {
                const res = await apiClient.post('/api/license/activate', {
                    license_key: this.licenseKey
                })
                if (res.data.success) {
                    this.success = 'License activated! Redirecting...'
                    await this.$store.dispatch('fetchLicenseStatus')
                    setTimeout(() => { this.$router.push('/sentinel') }, 2000)
                }
            } catch (err) {
                this.error = err.response?.data?.error || 'Activation failed.'
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.activate-page { background: #0B0F14; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.activate-card { background: #121821; border: 1px solid #1E2835; border-radius: 12px; padding: 2.5rem; max-width: 480px; width: 100%; }
.logo { font-size: 2rem; font-weight: 700; color: #e2e8f0; margin-bottom: 0.5rem; }
.logo span { color: #8cb63d; }
h2 { font-size: 1.25rem; font-weight: 400; color: #e2e8f0; margin-bottom: 0.25rem; }
.subtitle { color: #94a3b8; margin-bottom: 2rem; }
.label { font-size: 0.85rem; color: #64748b; margin-bottom: 0.5rem; }
.id-box { background: #0B0F14; border: 1px solid #1E2835; border-radius: 8px; padding: 1rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.id-box code { font-family: 'Courier New', monospace; color: #8cb63d; font-size: 1.1rem; letter-spacing: 2px; }
.copy-btn { background: none; border: 1px solid #1E2835; color: #94a3b8; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; }
.copy-btn:hover { border-color: #8cb63d; color: #8cb63d; }
.btn { display: block; width: 100%; padding: 0.85rem; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; text-align: center; text-decoration: none; margin-bottom: 1rem; }
.btn-mailto { background: #1E2835; color: #e2e8f0; }
.btn-mailto:hover { background: #2a3545; }
.btn-activate { background: #8cb63d; color: #fff; font-weight: 600; }
.btn-activate:hover { background: #72962f; }
.btn-activate:disabled { opacity: 0.5; cursor: not-allowed; }
.divider { text-align: center; color: #64748b; margin: 1.5rem 0; font-size: 0.9rem; }
.key-input { width: 100%; background: #0B0F14; border: 1px solid #1E2835; border-radius: 8px; padding: 0.85rem; color: #8cb63d; font-family: 'Courier New', monospace; font-size: 0.9rem; margin-bottom: 1rem; box-sizing: border-box; }
.key-input:focus { outline: none; border-color: #8cb63d; }
.key-input::placeholder { color: #475569; }
.alert { padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem; }
.alert-error { background: #7f1d1d; color: #fca5a5; border: 1px solid #991b1b; }
.alert-success { background: #14532d; color: #86efac; border: 1px solid #166534; }
</style>
