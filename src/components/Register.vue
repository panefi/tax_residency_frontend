<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <input type="text" v-model="full_name" placeholder="Full Name" required />
      <button type="submit">Register</button>
    </form>
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
    };
  },
  methods: {
    register() {
      this.$store.dispatch('register', {
        username: this.username,
        password: this.password,
        full_name: this.full_name,
      });
    },
  },
};
</script> 