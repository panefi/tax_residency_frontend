import { createStore } from 'vuex';
import axios from 'axios';
import { login, register } from '../api/auth';
import { getTravelEntries, addTravelEntry } from '../api/travelEntries';

export default createStore({
  state: {
    isAuthenticated: !!localStorage.getItem('token'), // Check if token exists in localStorage
    token: localStorage.getItem('token') || null,
    travelEntries: [],
    isLoading: false
  },
  mutations: {
    setAuthentication(state, { status, token }) {
        state.isAuthenticated = status;
        state.token = token;
        if (token) {
          localStorage.setItem('token', token); // Save token to localStorage
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          localStorage.removeItem('token'); // Remove token from localStorage
          delete axios.defaults.headers.common['Authorization'];
        }
      },
    setTravelEntries(state, entries) {
      state.travelEntries = entries;
    },
    addTravelEntry(state, entry) {
      state.travelEntries.push(entry);
    },
    setLoading(state, isLoading) {
        state.isLoading = isLoading;
    }
  },
  actions: {
    async login({ commit, dispatch }, { username, password }) {
      try {
        const data = await login(username, password);
        commit('setAuthentication', { status: true, token: data.token });
        await dispatch('fetchTravelEntries');
        return true;
      } catch (error) {
        console.error(error.message);
        return false;
      }
    },
    async register({ commit }, { username, password, fullName }) {
      try {
        const data = await register(username, password, fullName);
        commit('setAuthentication', { status: true, token: data.token });
      } catch (error) {
        console.error(error.message);
      }
    },
    async fetchTravelEntries({ commit }) {
      commit('setLoading', true); 
      try {
        const entries = await getTravelEntries();
        commit('setTravelEntries', entries);
      } catch (error) {
        console.error(error.message);
      }
      finally {
        commit('setLoading', false);
      }
    },
    async addTravelEntry({ commit }, entry) {
      try {
        const newEntry = await addTravelEntry(entry);
        commit('addTravelEntry', newEntry);
      } catch (error) {
        console.error(error.message);
      }
    },
  },
}); 