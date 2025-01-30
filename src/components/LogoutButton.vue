<template>
    <button class="btn btn-light" @click="logout"> 
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
.btn-light {
    margin-left: 10px;
    background-color: #013974;
    color: white;
}
</style>