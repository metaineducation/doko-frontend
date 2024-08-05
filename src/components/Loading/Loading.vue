<template>
  <div class="loading-mask" v-if="props.visible">
    <div class="loading-content">
      <Image src="@/assets/icon/loading.png" alt="" />
      <span v-show="props.message">{{ props.message }}</span>
    </div>
  </div>
</template>

<script setup>
import Image from "../Image.vue";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  message: String,
});
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";

.loading-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: rgba($color: #000000, $alpha: 0.2);
}
.loading-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: $primaryColor;
  img {
    width: 45px;
    animation: round 2s ease infinite;
  }
  span {
    display: block;
    margin-top: 15px;
  }
}
@keyframes round {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
