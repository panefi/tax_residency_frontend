<template>
    <div class="dashboard-container mb-4">
      <div class="row">
        <!-- Total Days Outside -->
        <div class="col-md-6">
          <div class="card text-white bg-warning shadow">
            <div class="card-body">
              <h5 class="card-title"><i class="fas fa-plane-departure"></i> Days Outside <span class="float-end"><i class="fas fa-calendar-alt"></i></span></h5>
              <p class="card-text display-4">{{ totalDaysOutside }}</p>
              <p class="card-text">Total days you've spent outside {{ countryOfResidence }} the past year.</p>
            </div>
          </div>
        </div>
        
        <!-- Compliance Status -->
        <div class="col-md-6">
          <div class="card text-white bg-success shadow">
            <div class="card-body">
              <h5 class="card-title"><i class="fas fa-check-circle"></i> Compliance Status <span class="float-end"><i class="fas fa-info-circle"></i></span></h5>
              <p class="card-text display-4">{{ complianceStatus }}</p>
              <p class="card-text">Based on your country regulations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  
  export default {
    name: 'UserDashboard',
    computed: {
      ...mapGetters(['totalDaysOutsideCountryRolling']),
      countryOfResidence() {
        return this.$store.state.countryOfResidence;
      },
      totalDaysOutside() {
        return this.totalDaysOutsideCountryRolling;
      },
      complianceStatus() {
        const threshold = 183; // Example threshold for tax compliance
        if (this.totalDaysOutside < threshold) {
          return `Compliant (${threshold - this.totalDaysOutside} days remaining)`;
        } else {
          return 'Non-Compliant';
        }
      },
    },
  };
  </script>

<style scoped>


.card-title i {
margin-right: 10px;
}

.display-4 {
font-size: 1.5rem;
font-weight: bold;
}
</style> 