import { createStore } from 'vuex';
import axios from 'axios';
import { login, register } from '../api/auth';
import { getTravelEntries, addTravelEntry } from '../api/travelEntries';
import { getUserProfile, updateUserProfile as apiUpdateUserProfile } from '../api/users';
import { differenceInCalendarDays } from 'date-fns'; // Importing date-fns function

export default createStore({
  state: {
    isAuthenticated: !!localStorage.getItem('token'), // Check if token exists in localStorage
    token: localStorage.getItem('token') || null,
    travelEntries: {
      result: [],
    },
    isLoading: false,
    userProfile: {}, // Add userProfile to state
    countryOfResidence: localStorage.getItem('countryOfResidence') || null,
  },
  mutations: {
    setAuthentication(state, { status, token }) {
      state.isAuthenticated = status;
      state.token = token;
      if (token) {
        localStorage.setItem('token', token); // Save token to localStorage
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set Axios header
      } else {
        localStorage.removeItem('token'); // Remove token from localStorage
        delete axios.defaults.headers.common['Authorization']; // Remove Axios header
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
      state.countryOfResidence = null; // Reset countryOfResidence on logout
      localStorage.removeItem('countryOfResidence'); // Remove from localStorage
    },
    SET_COUNTRY_OF_RESIDENCE(state, country) {
      state.countryOfResidence = country;
      localStorage.setItem('countryOfResidence', country); // Persist to localStorage
    },
    SET_USER_PROFILE(state, profile) {
      state.userProfile = profile;
    },
  },
  actions: {
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
        commit('SET_USER_PROFILE', profile.result[0]); // Store user profile
        return profile;
      } catch (error) {
        console.error('Failed to fetch user profile:', error.message);
        throw error;
      }
    },
    setCountryOfResidence({ commit }, country) {
      commit('SET_COUNTRY_OF_RESIDENCE', country);
      localStorage.setItem('countryOfResidence', country);
    },
    updateUserProfile({ commit }, profileData) {
      return apiUpdateUserProfile(profileData).then(updatedProfile => {
        commit('SET_USER_PROFILE', updatedProfile);
        if (updatedProfile.country_of_residence) {
          commit('SET_COUNTRY_OF_RESIDENCE', updatedProfile.country_of_residence);
        }
        return updatedProfile;
      }).catch(error => {
        console.error('Failed to update user profile:', error.message);
        throw error;
      });
    },
  },
  getters: {
    travelEntries: (state) => state.travelEntries.result,
    isLoading: (state) => state.isLoading,
    countryOfResidence: (state) => state.countryOfResidence,
    isAuthenticated: (state) => state.isAuthenticated,
    userProfile: (state) => state.userProfile, // Getter for userProfile
    // New Getter: Total Days Outside Country on a Rolling Basis (Past Year)
    totalDaysOutsideCountryRolling: (state) => {
      if (!state.countryOfResidence) return 0;

      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);

      let dateRanges = [];

      // Collect overlapping date ranges
      state.travelEntries.result.forEach((entry) => {
        const departureDate = new Date(entry.departure);
        const arrivalDate = entry.arrival ? new Date(entry.arrival) : today; // If no arrival, assume ongoing trip up to today

        // Find overlap with the past year
        const tripStart = departureDate < oneYearAgo ? oneYearAgo : departureDate;
        const tripEnd = arrivalDate > today ? today : arrivalDate;

        if (tripStart > tripEnd) return; // No overlap

        dateRanges.push({ start: tripStart, end: tripEnd });
      });

      if (dateRanges.length === 0) return 0;

      // Sort date ranges by start date
      dateRanges.sort((a, b) => a.start - b.start);

      // Merge overlapping date ranges
      const mergedRanges = [];
      let currentRange = dateRanges[0];

      for (let i = 1; i < dateRanges.length; i++) {
        const range = dateRanges[i];
        if (range.start <= currentRange.end) {
          // Overlapping ranges, merge them
          currentRange.end = new Date(Math.max(currentRange.end, range.end));
        } else {
          // Non-overlapping, push the current and reset
          mergedRanges.push(currentRange);
          currentRange = range;
        }
      }

      // Push the last range
      mergedRanges.push(currentRange);

      // Calculate total days
      let totalDays = 0;
      mergedRanges.forEach((range) => {
        const days = differenceInCalendarDays(range.end, range.start) + 1; // +1 to include both start and end days
        totalDays += days;
      });

      return totalDays;
    },
  },
}); 