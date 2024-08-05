<template>
  <img :src="props.src" :style="props.style" :class="props.class" />
</template>
<script setup>
/*
  <Image :src="">

*/
const props = defineProps(["src", "class", "style"]);
</script>

<style scoped></style>
