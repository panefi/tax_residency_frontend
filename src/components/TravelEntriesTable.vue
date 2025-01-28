<template>
  <div :class="{ disabled: isDisabled }">
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
          <a
            class="page-link"
            href="#"
            @click.prevent="changePage(currentPage - 1)"
            >Previous</a
          >
        </li>
        <li
          class="page-item"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: currentPage === page }"
        >
          <a
            class="page-link"
            href="#"
            @click.prevent="changePage(page)"
            >{{ page }}</a
          >
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a
            class="page-link"
            href="#"
            @click.prevent="changePage(currentPage + 1)"
            >Next</a
          >
        </li>
      </ul>
    </nav>

    <!-- Overlay When Disabled -->
    <div v-if="isDisabled" class="overlay">
      <p>Please select your country of residence to view your travel entries.</p>
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
  },
};
</script>

<style scoped>
.disabled {
  position: relative;
  pointer-events: none; /* Disables interactions */
  opacity: 0.6; /* Visual indication of disabled state */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  pointer-events: none; /* Allows underlying elements to be non-interactive */
}

.table-responsive {
  position: relative; /* To position the overlay correctly */
}

.table-responsive table {
  width: 100%;
  border-collapse: collapse;
}

.table-responsive th,
.table-responsive td {
  border: 1px solid #ddd;
  padding: 8px;
}

.table-responsive th {
  background-color: #f2f2f2;
  text-align: left;
}

.pagination {
  margin-top: 1rem;
}
</style>
  