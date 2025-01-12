import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_API_URL;

axios.interceptors.request.use(
  (config) => {
    const token = store.state.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch('logout');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

const app = createApp(App);
app.use(store);
app.use(router);
app.mount('#app');
