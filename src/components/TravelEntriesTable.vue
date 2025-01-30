<template>
  <div :class="{ disabled: isDisabled }" class="travel-entries-container">
    <div class="table-responsive">
      <table class="table table-hover shadow-sm rounded">
        <thead class="table-primary">
          <tr>
            <th scope="col">Destination <i class="fas fa-map-marker-alt"></i></th>
            <th scope="col">Depart <i class="fas fa-calendar-alt"></i></th>
            <th scope="col">Return <i class="fas fa-calendar-alt"></i></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in paginatedEntries" :key="entry.id">
            <td>{{ entry.destination }}</td>
            <td>{{ formatDate(entry.departure) }}</td>
            <td>{{ formatDate(entry.arrival) }}</td>
          </tr>
          <tr v-if="paginatedEntries.length === 0">
            <td colspan="3" class="text-center">No travel entries found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <nav aria-label="Page navigation example" class="mt-3">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
            <i class="fas fa-chevron-left"></i> Previous
          </a>
        </li>
        <li
          class="page-item"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: currentPage === page }"
        >
          <a class="page-link" href="#" @click.prevent="changePage(page)">
            {{ page }}
          </a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
            Next <i class="fas fa-chevron-right"></i>
          </a>
        </li>
      </ul>
    </nav>

    <!-- Overlay When Disabled -->
    <div v-if="isDisabled" class="overlay">
      <div class="overlay-content">
        <i class="fas fa-info-circle fa-3x mb-3 text-primary"></i>
        <p>Please select your country of residence to view your travel entries.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TravelEntriesTable',
  props: {
    entries: {
      type: Array,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    entriesPerPage: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      currentPage: 1,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.entries.length / this.entriesPerPage);
    },
    paginatedEntries() {
      const start = (this.currentPage - 1) * this.entriesPerPage;
      const end = start + this.entriesPerPage;
      return this.entries.slice(start, end);
    },
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    },
  },
};
</script>

<style scoped>
.travel-entries-container {
  position: relative;
  margin-top: 2rem;
  background-color: #fff;
  border-radius: 0.5rem;
}

.table {
  margin-bottom: 0;
}

.table-primary th {
  background-color: #0F4079;
  color: #fff;
  font-size: 1.2rem;
}

.table-hover tbody tr:hover {
  background-color: #e9ecef;
  transition: background-color 0.3s ease;
}

.pagination .page-link {
  color: #013974;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.pagination .page-link:hover {
  background-color: #013974;
  color: #fff;
}

.pagination .active .page-link {
  background-color: #013974;
  border-color: #013974;
  color: #fff;
}

.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 0.5rem;
}

.overlay-content {
  max-width: 300px;
}

.overlay-content p {
  font-size: 1rem;
  color: #6c757d;
}

@media (max-width: 576px) {
  .overlay-content p {
    font-size: 0.9rem;
  }
}
</style>
  