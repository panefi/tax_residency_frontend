import { createStore } from 'vuex';
import axios from 'axios';
import { login, register } from '../api/auth';
import { getTravelEntries, addTravelEntry } from '../api/travelEntries';

export default createStore({
  state: {
    isAuthenticated: !!localStorage.getItem('token'), // Check if token exists in localStorage
    token: localStorage.getItem('token') || null,
    travelEntries: {
      result: [],
    },
    isLoading: false,
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
      state.travelEntries.result = entries.result;
    },
    addTravelEntry(state, entry) {
      state.travelEntries.result.push(entry);
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    CLEAR_AUTH(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.travelEntries = { result: [] };
    },
  },
  actions: {
    async login({ commit, dispatch }, { username, password }) {
      try {
        const response = await login(username, password);
        if (response.token) {
          commit('setAuthentication', { status: true, token: response.token });
          await dispatch('fetchTravelEntries');
          return true;
        } else {
          console.error('Login failed: No token received');
          return false;
        }
      } catch (error) {
        console.error('Login error:', error.message);
        return false;
      }
    },
    async register({ commit }, { username, password, full_name }) {
      try {
        const data = await register(username, password, full_name);
        
        // Only commit authentication if a token is present
        if (data.token) {
          commit('setAuthentication', { status: true, token: data.token });
        }

        return data.result;
      } catch (error) {
        console.error('Registration error:', error.message);
        throw error; // Propagate the error to be handled by the component
      }
    },
    async fetchTravelEntries({ commit }) {
      commit('setLoading', true);
      try {
        const response = await getTravelEntries();
        commit('setTravelEntries', response);
      } catch (error) {
        console.error(error.message);
      } finally {
        commit('setLoading', false);
      }
    },
    async addTravelEntry({ commit }, entry) {
      try {
        const newEntry = await addTravelEntry(entry);
        commit('addTravelEntry', newEntry);
        return newEntry;
      } catch (error) {
        console.error(error.message);
        throw error;
      }
    },
  },
}); 