<template>
  <div>
    <h2>Travel Entries</h2>
    
    <!-- Display Custom Alert -->
    <AlertMessage
      :message="message"
      :type="messageType"
      @close="clearMessage"
    />
    
    <div v-if="isLoading">
      <!-- Loading Spinner -->
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <div v-else>
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
      <button @click="addEntry" class="btn btn-success mb-3">Add Trip</button>

      <!-- Add Trip Modal -->
      <AddTravelEntryModal
        :visible="showAddModal"
        @add-entry="handleAddEntry"
        @close="showAddModal = false"
      />

      <!-- Responsive Table -->
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th scope="col">Destination</th>
              <th scope="col">Depart</th>
              <th scope="col">Return</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in paginatedEntries" :key="entry.id">
              <td>{{ entry.destination }}</td>
              <td>{{ entry.departure }}</td>
              <td>{{ entry.arrival }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AddTravelEntryModal from './AddTravelEntryModal.vue';
import AlertMessage from './AlertMessage.vue';

export default {
  name: 'TravelEntries',
  components: {
    AddTravelEntryModal,
    AlertMessage,
  },
  data() {
    return {
      showAddModal: false,
      currentPage: 1,
      entriesPerPage: 10,
      searchQuery: '',
      message: '',
      messageType: '',
    };
  },
  computed: {
    ...mapState(['travelEntries', 'isLoading']),
    filteredEntries() {
      if (!this.travelEntries || !Array.isArray(this.travelEntries.result)) {
        return [];
      }
      if (this.searchQuery.trim() === '') {
        return this.travelEntries.result;
      }
      return this.travelEntries.result.filter((entry) =>
        entry.destination.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredEntries.length / this.entriesPerPage);
    },
    paginatedEntries() {
      const start = (this.currentPage - 1) * this.entriesPerPage;
      const end = start + this.entriesPerPage;
      return this.filteredEntries.slice(start, end);
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
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    filterEntries() {
      this.currentPage = 1;
    },
    clearMessage() {
      this.message = '';
      this.messageType = '';
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
    } else {
      // If not authenticated, redirect to login
      this.$router.push('/login');
    }
  },
};
</script>

<style scoped>
.card-img-top {
  height: 200px;
  object-fit: cover;
}

.card-title {
  font-weight: bold;
}

.btn-primary {
  background-color: #007bff;
  border: none;
}

/* Additional Styles */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Custom Table Styles */
th,
td {
  vertical-align: middle;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

/* Alert Styles */
.alert {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}
.btn-close {
  position: absolute;
  top: 0;
  right: 0.75rem;
  padding: 1rem;
  background: none;
  border: none;
}
</style>