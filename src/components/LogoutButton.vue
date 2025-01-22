<template>
    <button class="btn btn-danger" @click="logout"> 
        Logout
    </button>
</template>

<script>
export default {
    name: 'LogoutButton',
    methods: {
        logout() {
            localStorage.removeItem('token');
            this.$store.commit('CLEAR_AUTH');
            this.$router.push("/login");
        }
    }
}
</script>

<style scoped>
.btn-danger {
    margin-left: 10px;
}
</style>