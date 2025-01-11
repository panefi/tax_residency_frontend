<template>
    <div>
      <h2>Travel Entries</h2>
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <button @click="addNewEntry">Add Trip</button>
        <table>
        <thead>
          <tr>
            <th>Destination</th>
            <th>Depart</th>
            <th>Return</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in travelEntries.result" :key="entry.id">
            <td>{{ entry.destination }}</td>
            <td>{{ entry.departure }}</td>
            <td>{{ entry.arrival }}</td>
          </tr>
        </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  
  export default {
    name: 'TravelEntries',
    data() {
      return {
        newEntry: '',
      };
    },
    computed: {
      ...mapState(['travelEntries', 'isLoading']),
    },
    methods: {
      addEntry() {
        this.$store.dispatch('addTravelEntry', { destination: this.newEntry });
        this.newEntry = '';
      },
    },
    mounted() {
      if (this.$store.state.isAuthenticated) {
        this.$store.dispatch('fetchTravelEntries');
      }
    },
  };
  </script>