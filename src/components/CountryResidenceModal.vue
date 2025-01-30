<template>
  <div v-if="isVisible" class="custom-modal-overlay">
    <div class="custom-modal">
      <h2>Select Your Country of Residence</h2>
      <p>
        Please select the country where you are subject to taxation and must adhere to its legal requirements. 
        Based on your selection, we will calculate the permissible number of days you can spend outside of that country each year.
      </p>
      <select v-model="selectedCountry" class="form-select mb-3">
        <option disabled value="">Please select one</option>
        <option v-for="country in countries" :key="country" :value="country">{{ country.name }}</option>
      </select>
      <div class="modal-actions d-flex justify-content-end">
        <button :disabled="!selectedCountry" @click="confirmSelection" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
import { countries } from "countries-list";
import { mapActions } from 'vuex';

export default {
  name: 'CountryResidenceModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedCountry: null,
      countries: Object.values(countries),
    };
  },
  computed: {
    isCountrySelected() {
      return this.selectedCountry !== null;
    },
  },
  methods: {
    ...mapActions(['setCountryOfResidence']),
    confirmSelection() {
      if (this.selectedCountry) {
        console.log('selectedCountry', this.selectedCountry);
        this.setCountryOfResidence(this.selectedCountry.name);
        this.$emit('country-selected', this.selectedCountry.name);
      }
    },
  },
};
</script>

<style scoped>
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.custom-modal {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.modal-actions {
  margin-top: 15px;
}
</style> 