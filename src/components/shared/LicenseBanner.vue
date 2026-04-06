<template>
    <div v-if="showBanner" :style="bannerStyle" class="license-banner">
        <span v-html="bannerMessage"></span>
    </div>
</template>

<script>
export default {
    name: 'LicenseBanner',
    computed: {
        licenseState() {
            return this.$store.getters.licenseState
        },
        daysRemaining() {
            return this.$store.getters.licenseDaysRemaining
        },
        showBanner() {
            return ['GRACE_PERIOD', 'EXPIRED', 'TAMPER_DETECTED'].includes(this.licenseState)
        },
        isExpired() {
            return this.licenseState === 'EXPIRED'
        },
        isGrace() {
            return this.licenseState === 'GRACE_PERIOD'
        },
        isTamper() {
            return this.licenseState === 'TAMPER_DETECTED'
        },
        bannerMessage() {
            if (this.isGrace) {
                return `&#9888;&#65039; Your Slogr Enterprise license expires in ${this.daysRemaining} days. Your agents will stop measuring when it expires. <a href="mailto:license@slogr.io" style="color:inherit;font-weight:bold;">Contact license@slogr.io to renew.</a>`
            }
            if (this.isExpired) {
                return `&#128308; Your license has expired. Your agents have been paused. You are in read-only mode. <a href="mailto:license@slogr.io" style="color:inherit;font-weight:bold;">Contact license@slogr.io to renew.</a>`
            }
            if (this.isTamper) {
                const logins = this.$store.state.licenseLoginsRemaining ?? '?'
                return `&#128308; License verification issue detected. ${logins} of 25 logins remaining before your agents are paused. <a href="mailto:license@slogr.io" style="color:inherit;font-weight:bold;">Contact license@slogr.io immediately.</a>`
            }
            return ''
        },
        bannerStyle() {
            const base = 'position:sticky;top:0;z-index:9999;padding:12px 20px;text-align:center;font-size:14px;'
            if (this.isGrace) return base + 'background:#f59e0b;color:#1a1a1a;'
            return base + 'background:#dc2626;color:#fff;'
        }
    }
}
</script>

<style scoped>
.license-banner a {
    text-decoration: underline;
}
</style>
