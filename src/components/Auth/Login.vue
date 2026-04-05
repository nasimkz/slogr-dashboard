
<template>
    <div class="">
        <div class="container">
            <div class="row m-5 no-gutters rounded shadow-lg">
                <div class="col-md-6 d-none d-md-block">
                    <img src="../../assets//SlogrLogin.png" class="img-fluid shadow-sm" style="min-height:100%;" />
                </div>
                <div class="col-md-6 bg-white p-5">
                    <h1 class="pb-3">
                        <RouterLink to="/"><img src="../../assets/group-2420.svg" alt=""></RouterLink>
                    </h1>
                    <div class="my-5">
                        <span>Welcome back</span>
                        <h3>Sign In to Slogr</h3>
                    </div>
                    <div class="form-style">
                        <form @submit.prevent="loginUser">
                            <div class="form-group pb-3">
                                <label for="loginEmail">Email Address</label>
                                <input type="email" id="loginEmail" placeholder="user@example.com"
                                    class="form-control form-control-lg" name="email" v-model="email"
                                    autocomplete="email" required>
                            </div>
                            <div class="form-group">
                                <label for="loginPassword">Password</label>
                                <input type="password" id="loginPassword" placeholder="Password" class="form-control form-control-lg"
                                    name="password" autocomplete="current-password" v-model="this.password" required>
                            </div>
                            <div class="">
                                <button type="submit" class="signInBtn w-100 my-5">Login</button>
                            </div>
                            <p v-if="loginStatus" class="text-center mt-2" :class="loginStatus.includes('failed') ? 'text-danger' : 'text-success'">{{ loginStatus }}</p>
                        </form>
                        <div class="sideline mb-2">Or Sign In With</div>
                        <div>
                            <Linkedin />
                        </div>
                        <div class="pt-4 text-center text-secondary">
                            Create Account. <RouterLink to="/signUp">Sign Up</RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script >
import { RouterLink } from 'vue-router';
import Linkedin from './Linkedin.vue';

export default {
    name: 'Login',
    components: {
        Linkedin
    },
    data() {
        return {
            email: '',
            password: '',
            loginStatus: '',
        }
    },
    mounted() {

    },
    methods: {
        async loginUser(e) {
            e.preventDefault()
            const payload = {
                email: this.email || document.getElementById('loginEmail').value,
                password: this.password || document.getElementById('loginPassword').value
            }
            this.loginStatus = 'Logging in...'
            try {
                await this.$store.dispatch('login', payload);
                this.loginStatus = 'Login successful — redirecting...'
            } catch (error) {
                this.loginStatus = 'Login failed: ' + (error.response?.data?.message || error.message || 'Unknown error')
                console.error('Login error:', error)
            }
        }
    }
}
</script>

<style>
.sideline {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #ccc;
}

.sideline:before,
.sideline:after {
    content: '';
    border-top: 1px solid #ebebeb;
    margin: 0 20px 0 0;
    flex: 1 0 20px;
}

.sideline:after {
    margin: 0 0 0 20px;
}

.socialBtn {
    padding: 14px 0;
    border-radius: 8px;
    border: 1px solid var(--secondary_color);
    background-color: var(--white_color);
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.socialBtn:hover {
    border: 1px solid var(--primary_color);
}

.signInBtn {
    padding: 14px 0;
    border-radius: 8px;
    border: 1px solid var(--primary_color);
    background-color: var(--primary_color);
    cursor: pointer;
    transition: background-color 0.3s ease;
    color: var(--white_color);
}

.signInBtn:hover {
    background-color: var(--primary_color_Hover);
}
</style>
