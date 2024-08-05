<template>
  <div class="btn" @click="emit('click')">
    <svg
      v-show="props.loading"
      class="btn-loading"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        style="opacity: 0.25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <slot></slot>
  </div>
</template>
<script setup>
/*
  <ButtonVue @click="completeListing" :loading="loading">

*/
const props = defineProps({
  loading: {
    default: false,
  },
});
const emit = defineEmits(["click"]);
</script>

<style scoped>
.btn {
  display: inline-flex;
  padding: 10px 20px;
  border-radius: 9px;
  line-height: 30px;
  font-size: 18px;
  align-items: center;
  color: #ffffff;
  background-color: #8c1aff;
  cursor: pointer;
}

.btn-loading {
  margin-right: 8px;
  height: 16px;
  width: 16px;
  animation: spin 1s linear infinite;
  color: #fff;
}

@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}

.animate-spin {
  -webkit-animation: spin 1s linear infinite;
}
</style>
