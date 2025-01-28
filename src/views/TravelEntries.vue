<template>
  <div class="container my-4">    
    <!-- Display Custom Alert -->
    <AlertMessage
      :message="message"
      :type="messageType"
      @close="clearMessage"
    />
    
    <div v-if="isLoading">
      <!-- Loading Spinner -->
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    <div v-else>
      <!-- Country Residence Modal -->
      <CountryResidenceModal
        :isVisible="isTaxResidencyModalVisible"
        @country-selected="handleCountrySelected"
      />

      <!-- Search Bar -->
      <div class="mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Search by Destination"
          v-model="searchQuery"
          @input="filterEntries"
        />
      </div>

      <!-- Add Trip Button -->
      <div class="mb-3 d-flex justify-content-start">
        <button @click="addEntry" class="btn btn-dark">Add New Trip</button>
      </div>

      <!-- Add Trip Modal -->
      <AddTravelEntryModal
        :visible="showAddModal"
        @add-entry="handleAddEntry"
        @close="showAddModal = false"
      />

      <!-- Travel Entries Table -->
      <TravelEntriesTable
        :entries="filteredEntries"
        :isDisabled="isTaxResidencyModalVisible"
        :entriesPerPage="entriesPerPage"
      />

      <!-- Optional: Add a loading indicator -->
      <div v-if="isLoading" class="text-center my-3">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AddTravelEntryModal from '../components/AddTravelEntryModal.vue';
import AlertMessage from '../components/AlertMessage.vue';
import CountryResidenceModal from '../components/CountryResidenceModal.vue';
import TravelEntriesTable from '../components/TravelEntriesTable.vue';

export default {
  name: 'TravelEntries',
  components: {
    AddTravelEntryModal,
    AlertMessage,
    CountryResidenceModal,
    TravelEntriesTable,
  },
  data() {
    return {
      showAddModal: false,
      currentPage: 1,
      entriesPerPage: 10,
      searchQuery: '',
      message: '',
      messageType: '',
      isTaxResidencyModalVisible: false,
    };
  },
  computed: {
    ...mapState({
      travelEntries: state => state.travelEntries.result,
      isLoading: state => state.isLoading,
      countryOfResidence: state => state.countryOfResidence,
    }),
    filteredEntries() {
      if (!this.travelEntries || !Array.isArray(this.travelEntries)) {
        return [];
      }
      if (this.searchQuery.trim() === '') {
        return this.travelEntries;
      }
      return this.travelEntries.filter(entry =>
        entry.destination.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    messageClass() {
      if (this.messageType === 'success') return 'alert-success';
      if (this.messageType === 'warning') return 'alert-warning';
      if (this.messageType === 'error') return 'alert-danger';
      return '';
    },
  },
  methods: {
    addEntry() {
      this.showAddModal = true;
    },
    handleAddEntry(entry) {
      this.$store
        .dispatch('addTravelEntry', entry)
        .then((newEntry) => {
          if (newEntry) {
            this.message = 'Travel entry added successfully!';
            this.messageType = 'success';
            this.$store.dispatch('fetchTravelEntries');
          } else {
            this.message = 'No data returned from addTravelEntry action.';
            this.messageType = 'warning';
          }
        })
        .catch((error) => {
          console.error('Failed to add entry:', error);
          this.message = 'Failed to add travel entry.';
          this.messageType = 'error';
        });
    },
    clearMessage() {
      this.message = '';
      this.messageType = '';
    },
    async handleCountrySelected(countryName) {
      try {
        await this.$store.dispatch('updateUserProfile', { country_of_residence: countryName });
        this.isTaxResidencyModalVisible = false;
        await this.$store.dispatch('fetchTravelEntries');
        this.$router.push('/entries');
      } catch (error) {
        this.message = 'Failed to update country of residence. Please try again.';
        this.messageType = 'error';
      }
    },
    filterEntries() {
      this.currentPage = 1;
    },
  },
  mounted() {
    if (this.$store.state.isAuthenticated) {
      this.$store
        .dispatch('fetchTravelEntries')
        .catch((error) => {
          console.error('Failed to fetch entries:', error);
          alert('Failed to fetch travel entries.');
        });

      if (!this.countryOfResidence) {
        this.isTaxResidencyModalVisible = true;
      }
    } else {
      // If not authenticated, redirect to login
      this.$router.push('/login');
    }
  },
};
</script>

<style scoped>
.btn-success {
    margin-left: 10px;
  }
th,
td {
  vertical-align: middle;
}
</style>
