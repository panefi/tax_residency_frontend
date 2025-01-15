import { createRouter, createWebHistory } from 'vue-router';
import UserRegister from '../components/Register.vue';
import UserLogin from '../components/Login.vue';
import TravelEntries from '../components/TravelEntries.vue';
import store from '../store';

const routes = [
  { path: '/register', component: UserRegister },
  { path: '/login', component: UserLogin },
  { path: '/entries', component: TravelEntries, name: 'TravelEntries' },
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'LoginIn',
    component: UserLogin,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.isAuthenticated;

  if (!isAuthenticated && to.path !== '/login' && to.path !== '/register') {
    next('/login');
  } else {
    next();
  }
});

export default router; 