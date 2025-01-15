<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <h2 class="text-center mb-4">Login</h2>
        <form @submit.prevent="login" class="card p-4 login-form">
          <div class="form-group">
            <input type="text" v-model="username" class="form-control" placeholder="Username" required />
          </div>
          <div class="form-group">
            <input type="password" v-model="password" class="form-control" placeholder="Password" required />
          </div>
          <button type="submit" class="btn btn-primary btn-block">Login</button>
        </form>
        <div v-if="error" class="alert alert-danger mt-3">
          {{ error }}
        </div>
      </div>
    </div>
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
    };
  },
  methods: {
    async login() {
      const success = await this.$store.dispatch('login', {
        username: this.username,
        password: this.password,
      });
      if (success) {
        this.$router.push('/entries');
      } else {
        this.error = 'Login failed. Please check your credentials.';
      }
    },
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>