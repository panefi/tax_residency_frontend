import { createStore } from 'vuex';
import axios from 'axios';
import { login, register } from '../api/auth';
import { getTravelEntries, addTravelEntry } from '../api/travelEntries';
import { getUserProfile, updateUserProfile as apiUpdateUserProfile } from '../api/users';

export default createStore({
  state: {
    isAuthenticated: !!localStorage.getItem('token'), // Check if token exists in localStorage
    token: localStorage.getItem('token') || null,
    travelEntries: {
      result: [],
    },
    isLoading: false,
    countryOfResidence: localStorage.getItem('countryOfResidence') || '', // Initialize from localStorage or default to empty string
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
      delete axios.defaults.headers.common['Authorization'];
      state.countryOfResidence = ''; // Reset countryOfResidence on logout
      localStorage.removeItem('countryOfResidence'); // Remove from localStorage
    },
    SET_COUNTRY_OF_RESIDENCE(state, country) {
      state.countryOfResidence = country;
      localStorage.setItem('countryOfResidence', country); // Persist to localStorage
    },
  },
  actions: {
    async login({ commit, dispatch }, { username, password }) {
      try {
        const response = await login(username, password);
        if (response.token) {
          commit('setAuthentication', { status: true, token: response.token });
          await dispatch('fetchUserProfile'); // Fetch user profile after login
          await dispatch('fetchTravelEntries');
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error('Login error:', error.message);
        throw error;
      }
    },
    async register({ commit, dispatch }, { username, password, full_name }) {
      try {
        const data = await register(username, password, full_name);
        // Only commit authentication if a token is present
        if (data.token) {
          commit('setAuthentication', { status: true, token: data.token });
          await dispatch('fetchUserProfile'); // Fetch user profile after registration
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
        console.error('Fetch Travel Entries error:', error.message);
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
        console.error('Add Travel Entry error:', error.message);
        throw error;
      }
    },
    async fetchUserProfile({ commit }) {
      try {
        const profile = await getUserProfile();
        if (profile.result[0].country_of_residence) {
          commit('SET_COUNTRY_OF_RESIDENCE', profile.result[0].country_of_residence);
        }
        return profile;
      } catch (error) {
        console.error('Failed to fetch user profile:', error.message);
        throw error;
      }
    },
    async updateUserProfile({ commit }, profileData) {
      try {
        const updatedProfile = await apiUpdateUserProfile(profileData);
        commit('SET_COUNTRY_OF_RESIDENCE', updatedProfile.country_of_residence);
        return updatedProfile;
      } catch (error) {
        console.error('Failed to update user profile:', error.message);
        throw error;
      }
    },
    SET_COUNTRY_OF_RESIDENCE({ commit }, country) {
      commit('SET_COUNTRY_OF_RESIDENCE', country);
    },
  },
  getters: {
    countryOfResidence: (state) => state.countryOfResidence,
    travelEntries: (state) => state.travelEntries.result,
    isLoading: (state) => state.isLoading,
  },
}); 