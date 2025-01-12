<template>
  <div
    class="modal fade show"
    tabindex="-1"
    role="dialog"
    style="display: block;"
    aria-modal="true"
    v-if="visible"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <form @submit.prevent="handleSubmit">
          <div class="modal-header">
            <h5 class="modal-title" id="addTripModalLabel">Add New Trip</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="destination" class="form-label">Destination</label>
              <input
                type="text"
                id="destination"
                v-model="form.destination"
                class="form-control"
                placeholder="Enter destination"
                required
              />
            </div>
            <div class="mb-3">
              <label for="departure" class="form-label">Departure Date</label>
              <input
                type="date"
                id="departure"
                v-model="form.departure"
                class="form-control"
                required
              />
            </div>
            <div class="mb-3">
              <label for="arrival" class="form-label">Arrival Date</label>
              <input
                type="date"
                id="arrival"
                v-model="form.arrival"
                class="form-control"
                required
              />
            </div>
            <!-- Add more fields if necessary -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Trip</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddTravelEntryModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      form: {
        destination: '',
        departure: '',
        arrival: '',
      },
    };
  },
  methods: {
    handleSubmit() {
      // Emit the form data to the parent component
      this.$emit('add-entry', { ...this.form });
      // Reset the form
      this.form.destination = '';
      this.form.departure = '';
      this.form.arrival = '';
      // Close the modal
      this.closeModal();
    },
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>