import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap/dist/js/bootstrap.js";
import 'font-awesome/css/font-awesome.css'
import '@fortawesome/fontawesome-free/css/all.css';
import store from '../src/store/store'
import { createAuth0 } from '@auth0/auth0-vue'
import { setupInterceptors } from './services/interceptors'
import LoadingState from './components/shared/LoadingState.vue'
import EmptyState from './components/shared/EmptyState.vue'
import ErrorState from './components/shared/ErrorState.vue'

const app = createApp(App)

app.use(router)
app.use(
    createAuth0({
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    })
  );
app.use(store)
setupInterceptors()
app.component('LoadingState', LoadingState)
app.component('EmptyState', EmptyState)
app.component('ErrorState', ErrorState)
app.mount('#app')
