<template>
  <div>
    <h2>Travel Entries</h2>
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
      <!-- <div class="mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Search by Destination"
          v-model="searchQuery"
          @input="filterEntries"
        />
      </div> -->

      <!-- Add Trip Button -->
      <button @click="addEntry" class="btn btn-success mb-3">Add Trip</button>

      <!-- Responsive Table -->
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th scope="col">Destination</th>
              <th scope="col">Depart</th>
              <th scope="col">Return</th>
              <!-- <th scope="col">Actions</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in paginatedEntries" :key="entry.id">
              <td>{{ entry.destination }}</td>
              <td>{{ entry.departure }}</td>
              <td>{{ entry.arrival }}</td>
              <!-- <td>
                <button @click="viewDetails(entry.id)" class="btn btn-primary btn-sm me-2">View</button>
                <button @click="editEntry(entry.id)" class="btn btn-warning btn-sm me-2">Edit</button>
                <button @click="deleteEntry(entry.id)" class="btn btn-danger btn-sm">Delete</button>
              </td> -->
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

export default {
  name: 'TravelEntries',
  data() {
    return {
      newEntry: '',
      showAddModal: false,
      currentPage: 1,
      entriesPerPage: 10,
      searchQuery: '',
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
      if (!Array.isArray(this.filteredEntries)) {
        return [];
      }
      const start = (this.currentPage - 1) * this.entriesPerPage;
      const end = start + this.entriesPerPage;
      return this.filteredEntries.slice(start, end);
    },
  },
  methods: {
    addEntry() {
      if (this.newEntry.trim() === '') {
        alert('Please enter a destination.');
        return;
      }
      this.$store
        .dispatch('addTravelEntry', { destination: this.newEntry })
        .then(() => {
          this.newEntry = '';
        })
        .catch((error) => {
          console.error('Failed to add entry:', error);
          // Optionally, display an error message to the user
        });
    },
    viewDetails(id) {
      this.$router.push({ name: 'TravelEntryDetail', params: { id } });
    },
    editEntry(id) {
      this.$router.push({ name: 'EditTravelEntry', params: { id } });
    },
    deleteEntry(id) {
      if (confirm('Are you sure you want to delete this entry?')) {
        this.$store
          .dispatch('deleteTravelEntry', id)
          .catch((error) => {
            console.error('Failed to delete entry:', error);
            // Optionally, display an error message to the user
          });
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
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
          // Handle error if needed
        });
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
</style>