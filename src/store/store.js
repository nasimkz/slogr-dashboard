// store.js
import Vuex from 'vuex';
import createPersist from 'vuex-persist';

// Your authentication service
import authServices from './authServices';
import apiClient from '../services/apiClient';
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';
import router from '@/router/index'

const { Store } = Vuex;

// Create a vuexPersist instance
const vuexPersist = new createPersist({
    key: 'slogr', // unique key for your application
    storage: window.sessionStorage,
    reducer: state => ({
        // Specify which state properties you want to persist
        token: state.token,
        userData:state.userData
    }),
});

// Create the Vuex store
const store = new Store({
    state: {
        token: null,
        userData: {},
        licenseState: null,
        licenseIsReadOnly: false,
        licenseDaysRemaining: null,
        licenseLoginsRemaining: null,
        installationId: null,
    },
    getters: {
        getToken: state => state.token,
        getUserData: state => state.userData,
        licenseState: state => state.licenseState,
        isReadOnly: state => state.licenseIsReadOnly,
        licenseDaysRemaining: state => state.licenseDaysRemaining,
        isLicenseActive: state => state.licenseState === 'ACTIVE',
        isUnlicensed: state => !state.licenseState || state.licenseState === 'UNLICENSED',
        isInGracePeriod: state => state.licenseState === 'GRACE_PERIOD',
        installationId: state => state.installationId,
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
        },
        setUserData(state, userData) {
            state.userData = userData
        },
        clearUserData(state) {
            state.token = null;
            state.userData = {}
        },
        SET_LICENSE_STATE(state, payload) {
            state.licenseState = payload.state
            state.licenseIsReadOnly = payload.is_read_only ?? false
            state.licenseDaysRemaining = payload.days_remaining ?? null
            state.licenseLoginsRemaining = payload.logins_remaining ?? null
        },
        SET_INSTALLATION_ID(state, id) {
            state.installationId = id
        },
    },
    actions: {
        async login({ commit }, credentials) {
            try {
                // Make API call to authenticate user
                const response = await authServices.login(credentials);
                if (response.status === 200) {
                    // Update Vuex store with user data
                    commit('setToken', response.data.success.token);
                    commit('setUserData', response.data.success);
                    router.push('/');
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 422) {
                        // console.log('Unauthenticated')
                        createToast(`Unauthenticated`, {
                            type: 'danger',
                            position: 'top-right',
                            transition: 'zoom',
                        });
                    }
                }
                // login failed
            }
        },
        async signup({ commit }, credentials) {
            try {
                const response = await authServices.signup(credentials)
                commit('setToken', response.data.success.token);
                commit('setUsername', response.data.success.name);
                // commit('setUserId', response.data.success.id);
                createToast(`SignUp successfully`, {
                    type: 'success',
                    position: 'top-right',
                    transition: 'zoom',
                });
                router.push('/login');

            } catch (error) {
                // Handle signup error
                if (error.response.data.errors.email) {
                    createToast(`The email has already been taken.`, {
                        type: 'danger',
                        position: 'top-right',
                        transition: 'zoom',
                    });
                }
                if (error.response.data.errors.password) {
                    createToast(`The password confirmation does not match.`, {
                        type: 'danger',
                        position: 'top-right',
                        transition: 'zoom',
                    });
                }
                // signup failed
            }
        },
        async socialLogin({ commit }, credentials){
            try {
                const resp = await authServices.socialLogin(credentials)
                if (resp.status === 200) {
                    commit('setToken', resp.data.success.token);
                    commit('setUserData', resp.data.success);
                    router.push('/');
                }
            } catch (error) {
                if (error.resp) {
                    if (error.resp.status === 422) {
                        // console.log('Unauthenticated')
                        createToast(`Unauthenticated`, {
                            type: 'danger',
                            position: 'top-right',
                            transition: 'zoom',
                        });
                    }
                }
            }
        },
        logout({ commit }) {
            router.push({ name: 'Login' })
            commit('clearUserData');
        },
        async fetchLicenseStatus({ commit }) {
            try {
                const resp = await apiClient.get('/api/license/status')
                commit('SET_LICENSE_STATE', resp.data.state)
                commit('SET_INSTALLATION_ID', resp.data.installation_id)
            } catch (e) {
                // License check failed — non-blocking
            }
        },

    },
    plugins: [vuexPersist.plugin],
    // Specify which state properties you want to persist
    // plugins: [vuexPersist.plugin({ key: 'your-key-here', reducer: state => ({ token: state.token, name: state.name, id: state.id }) })],
});

export default store;
