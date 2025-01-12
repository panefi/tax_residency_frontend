<template>
  <div v-if="message" :class="['alert', alertClass]" role="alert">
    {{ message }}
    <button type="button" class="btn-close" aria-label="Close" @click="closeAlert"></button>
  </div>
</template>

<script>
export default {
  name: 'AlertMessage',
  props: {
    message: {
      type: String,
      required: false,
      default: '',
    },
    type: {
      type: String,
      required: false,
      default: 'success', // 'success', 'warning', 'danger', etc.
    },
  },
  computed: {
    alertClass() {
      return `alert-${this.type}`;
    },
  },
  methods: {
    closeAlert() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.alert {
  margin-top: 15px;
}
.btn-close {
  position: absolute;
  top: 0;
  right: 15px;
  padding: 1rem;
  background: none;
  border: none;
}
</style> 