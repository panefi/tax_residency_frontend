<template>
  <div class="register-container">
    <div class="description">
      <p>Simplifying tax residency for the modern nomad.</p>
    </div>
    <form @submit.prevent="register" class="register-form" v-if="!successMessage">
      <h2 class="text-center mb-4">Register</h2>
      <div class="form-group">
        <input
          type="text"
          v-model="username"
          class="form-control"
          placeholder="Username"
          required
        />
      </div>
      <div class="form-group">
        <input
          type="password"
          v-model="password"
          class="form-control"
          placeholder="Password"
          required
        />
      </div>
      <div class="form-group">
        <input
          type="text"
          v-model="full_name"
          class="form-control"
          placeholder="Full Name"
          required
        />
      </div>
      <button type="submit" class="btn btn-success btn-block">Register</button>
    </form>
    <div class="message-container">
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
        <router-link to="/login" class="btn btn-primary mt-2">Go to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserRegister',
  data() {
    return {
      username: '',
      password: '',
      full_name: '',
      error: '',
      successMessage: '',
    };
  },
  methods: {
    async register() {
      try {
        const response = await this.$store.dispatch('register', {
          username: this.username,
          password: this.password,
          full_name: this.full_name,
        });
        this.successMessage = response;
      } catch (err) {
        if (err.message) {
          this.error = err.message;
        } else {
          this.error = 'Registration failed. Please try again.';
        }
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.description {
  margin-bottom: 20px;
  font-size: 1.4em;
  color: #555;
  text-align: center;
}

.register-form {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 15px;
}

.btn-success {
  background-color: #28a745;
  border: none;
}

.btn-primary {
  background-color: #007bff;
  border: none;
}

.message-container {
  width: 100%;
  max-width: 400px;
  margin: 20px auto 0;
}

.alert {
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 600px) {
  .register-form {
    padding: 20px;
    max-width: 90%;
  }
  .message-container {
    max-width: 90%;
  }
}
</style> 