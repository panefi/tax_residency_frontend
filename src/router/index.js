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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = store.state.isAuthenticated;
  if (
    (to.path === '/login' || to.path === '/register') &&
    token &&
    isAuthenticated
  ) {
    next('/entries');
  } else {
    next();
  }
});

export default router; 