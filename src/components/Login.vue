<template>
  <div class="login-container">
    <div class="message-container">
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>
      </div>
    <form @submit.prevent="login" class="login-form" v-if="!successMessage">
      <h2 class="text-center mb-4">Login</h2>

      <!-- Registration Prompt -->
      <div v-if="showRegisterPrompt" class="alert alert-info">
        Don't have an account?
        <router-link to="/register">Register here</router-link>.
      </div>
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
      <button type="submit" class="btn btn-primary btn-block">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'UserLogin',
  data() {
    return {
      username: '',
      password: '',
      error: '',
      showRegisterPrompt: false,
      successMessage: '',
    };
  },
  created() {
    // Check if redirected from the root path
    if (this.$route.query.register) {
      this.showRegisterPrompt = true;
    }
    // Retrieve message from query parameters
    if (this.$route.query.message) {
      this.successMessage = this.$route.query.message;
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password,
        });
        this.$router.push('/entries');
      } catch (err) {
        // this.error = 'Login failed. Please check your credentials.';
        if (err.response && err.response.data && err.response.data.detail === "Invalid username or password") {
          this.error = 'Please enter a correct username and password. Note that both fields may be case-sensitive.';
        } else {
          this.error = 'Login failed. Please try again.';
        }
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.login-form {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.message-container {
  width: 100%;
  max-width: 400px;
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.btn-primary {
  background-color: #007bff;
  border: none;
}

.alert-info a {
  color: #17a2b8;
  text-decoration: underline;
}

@media (max-width: 600px) {
  .login-form,
  .message-container {
    padding: 20px;
    max-width: 90%;
  }
}
</style>