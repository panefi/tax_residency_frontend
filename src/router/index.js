import { createRouter, createWebHistory } from 'vue-router';
import UserRegister from '../views/Register.vue';
import UserLogin from '../views/Login.vue';
import TravelEntries from '../views/TravelEntries.vue';
import store from '../store';

const routes = [
  { path: '/register', component: UserRegister },
  { path: '/login', component: UserLogin },
  { path: '/entries', component: TravelEntries, name: 'TravelEntries' },
  {
    path: '/',
    redirect: { path: '/login', query: { register: 'true' } },
  },
  // Catch-all route
  { path: '/:pathMatch(.*)*', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = store.state.isAuthenticated;

  // Define routes that do not require authentication
  const publicRoutes = ['/login', '/register'];

  if (!publicRoutes.includes(to.path)) {
    if (token && isAuthenticated) {
      try {
        await store.dispatch('fetchUserProfile');
        if (store.getters.countryOfResidence) {
          next();
        } else {
          next('/entries'); // Or any other route as per your logic
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        store.commit('CLEAR_AUTH'); // Clear authentication state
        next('/login');
      }
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router; 