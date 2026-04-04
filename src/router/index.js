import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import Home from '../components/Home.vue';
import Sentinel from '../components/Sentinel/Sentinel.vue';
import Sessions from '../components/Sessions/Sessions.vue';
import Monitor from '../components/Monitor/Monitor.vue';
import Login from '../components/Auth/Login.vue';
import SignUp from '../components/Auth/SignUp.vue';
import Groups from '../components/Groups/Groups.vue';
import Analytics from '../components/Analytics/Analytics.vue';
import SentinelReports from '../components/Sentinel/SentinelReports.vue';
import Traceroute from '../components/Traceroute/Traceroute.vue';
////////////////////ADMIN/////////////////////////////////////
import Dashboard from '../components/Admin/Dashboard/Dashboard.vue'
import CreateNewUser from '../components/Admin/CreateUser/CreateNewUser.vue'
import RightsProfiles from '../components/Admin/RightsProfile/RightsProfile.vue';
import EditRightsProfile from '../components/Admin/RightsProfile/EditRightsProfile.vue';
import Alerts from '../components/Admin/Alerts/Alerts.vue';
import Reports from '../components/Admin/Reports/Reports.vue';

import store from '../store/store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/home2',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: '/sentinel',
      name: 'Sentinel',
      component: Sentinel,
      meta: { requiresAuth: true },
    },
    {
      path: '/sessions',
      name: 'Sessions',
      component: Sessions,
      meta: { requiresAuth: true },
    },
    {
      path: '/monitor',
      name: 'Monitor',
      component: Monitor,
      meta: { requiresAuth: true },
    },
    {
      path: '/groups',
      name: 'Groups',
      component: Groups,
      meta: { requiresAuth: true },
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: Analytics,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signUp',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/sentinelReports/:id',
      name: 'SentinelReports',
      component: SentinelReports,
      meta: { requiresAuth: true },
    },
    {
      path: '/traceroute',
      name: 'Traceroute',
      component: Traceroute,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/createNewUser',
      name: 'CreateNewUser',
      component: CreateNewUser,
      meta: { requiresAuth: true },
    },
    {
      path: '/rightsProfiles',
      name: 'RightsProfiles',
      component: RightsProfiles,
      meta: { requiresAuth: true },
    },
    {
      path: '/editRightsProfile',
      name: 'EditRightsProfile',
      component: EditRightsProfile,
      meta: { requiresAuth: true },
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: Alerts,
      meta: { requiresAuth: true },
    },
    {
      path: '/reports',
      name: 'Reports',
      component: Reports,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting 
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true },
    }
  ]
})

// Add navigation guard to check authentication
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    // Check if the user is logged in
    if (store.getters.getToken) {
      // User is logged in, allow access to the route
      next();
    } else {
      // User is not logged in, redirect to the login page
      next('/login');
    }
  } else {
    // Route does not require authentication, allow access
    next();
  }
});

export default router
