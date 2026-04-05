<template>
    <div class="text-center m-5" v-if="loading">
        <VueSpinner size="30" color="#8cb63d" />
    </div>
    <div v-else>
        <button class="socialBtn w-100 me-2 text-secondary" @click="login"><i class="fa-brands fa-linkedin-in fa-2xl me-1"
                style="color: #0B65C2;"></i>
            Continue With Linkedin</button>
    </div>
</template>
<script>
import { useAuth0 } from '@auth0/auth0-vue';
import { VueSpinner } from 'vue3-spinners';
export default {
    name: 'Linkedin',
    setup() {
        try {
            const { loginWithPopup, user } = useAuth0()
            return {
                login: () => { loginWithPopup() },
                user,
            }
        } catch {
            return { login: () => {}, user: null }
        }
    },
    watch: {
        // Log user data whenever it changes
        user: function (newUser) {
            this.social.name = newUser.name
            this.social.sub = newUser.sub
            this.socialLogin()
        }
    },
    components: {
        VueSpinner
    },
    data() {
        return {
            social: {
                name: '',
                sub: ''
            },
            loading:false
        }
    },
    methods: {
        async socialLogin() {
            const payload = {
                name: this.social.name,
                sub: this.social.sub
            }
            try {
                this.loading = true
                await this.$store.dispatch('socialLogin', payload)
            } catch (error) {
                console.log(error)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>