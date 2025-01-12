<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <h2 class="text-center mb-4">Login</h2>
        <form @submit.prevent="login" class="card p-4">
          <div class="form-group">
            <input type="text" v-model="username" class="form-control" placeholder="Username" required />
          </div>
          <div class="form-group">
            <input type="password" v-model="password" class="form-control" placeholder="Password" required />
          </div>
          <button type="submit" class="btn btn-primary btn-block">Login</button>
        </form>
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
        alert('Login failed. Please check your credentials.');
      }
    },
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}
.container {
  max-width: 500px;
}
</style>