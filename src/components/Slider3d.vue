<template>
  <div ref="slideBoxDOM" class="slide-box">
    <div class="banner-box" v-if="props.images.length">
      <div
        @click="change(index), pause()"
        v-for="(item, index) in props.images"
        class="banner-item"
        :class="{
          left: index == leftIndex,
          right: index == rightIndex,
          middle: index == currentIndex,
        }"
        :key="index"
      >
        <img :src="item" />
      </div>
    </div>
    <!-- <button class="slide-left-btn material-icons">arrow_back_ios</button>
    <button class="slide-right-btn material-icons">arrow_forward_ios</button> -->
    <div class="pagination-box"></div>
  </div>
</template>

<script setup>
import { onUnmounted, ref, watch } from "vue";
import { useIntervalFn } from "@vueuse/core";

let props = defineProps({
  images: {
    type: Array,
    default: function () {
      return [];
    },
  },
});

let currentIndex = ref(0);
let leftIndex = ref(2);
let rightIndex = ref(1);

let slideBoxDOM = ref(null);
const { pause } = useIntervalFn(() => {
  /* your function */
  change(currentIndex.value + 1);
}, 4000);

watch(
  () => props.images,
  (val, oldval) => {
    // console.log(val, oldval);
    if (JSON.stringify(val) !== JSON.stringify(oldval)) {
      currentIndex.value = 0;
      leftIndex.value = props.images.length - 1;
      rightIndex.value = 1;
    }
  }
);

function change(index) {
  // console.log(index);

  let newIndex = index;

  if (index == currentIndex.value) {
    // console.log("当前");
    return;
  }

  //向下翻页
  if (index == 0) {
    newIndex = 0;
  }
  //向前翻页
  if (index == props.images.length - 1) {
    newIndex = props.images.length - 1;
  }

  //设置当前index
  if (newIndex < 0) {
    currentIndex.value = props.images.length - 1;
  } else if (newIndex >= props.images.length) {
    currentIndex.value = 0;
  } else {
    currentIndex.value = newIndex;
  }

  //设置左右index
  if (currentIndex.value === 0) {
    leftIndex.value = props.images.length - 1;
    rightIndex.value = currentIndex.value + 1;
  } else if (currentIndex.value === props.images.length - 1) {
    leftIndex.value = currentIndex.value - 1;
    rightIndex.value = 0;
  } else {
    leftIndex.value = currentIndex.value - 1;
    rightIndex.value = currentIndex.value + 1;
  }
}

onUnmounted(() => {
  console.log("pause");
  // pause();
});
</script>

<style scoped>
.slide-box {
  position: relative;

  /* margin: 30px auto; */
  height: 300px;
  max-width: 980px;
  min-width: 700px;
  /* background-color: antiquewhite; */
}

.banner-box {
  position: relative;
  height: 100%;
  width: 100%;
  perspective: 3500px;
}

.banner-item {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 90%;
  background-color: #000;
  box-sizing: border-box;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.5s;
  z-index: 0;
}

.banner-item > img {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  transform: opacity 0.5s;
  object-fit: cover;
}

.banner-item.left {
  left: -12px;
  /* transform: translateX(0); */
  transform: translateX(0) rotateY(30deg) translateY(-13px) translateZ(0);
  z-index: 50;
  filter: blur(2px);
  cursor: pointer;
}

.banner-item.right {
  left: calc(100% + 12px);
  /* transform: translateX(-100%); */
  transform: translateX(-100%) rotateY(-30deg) translateY(-13px) translateZ(0);
  z-index: 50;
  filter: blur(2px);
  cursor: pointer;
}

.banner-item.middle {
  width: 534px;
  height: 100%;
  z-index: 100;
}

.banner-item.middle > img {
  opacity: 1;
}

.slide-left-btn,
.slide-right-btn {
  position: absolute;
  top: 50%;
  z-index: 200;
  width: 40px;
  height: 40px;
  font-size: 30px;
  font-weight: 900;
  color: #b4b4b4;
  border: none;
  background: none;
}

.slide-left-btn:hover,
.slide-right-btn:hover {
  color: #fff;
}

.slide-left-btn {
  left: 1%;
}

.slide-right-btn {
  right: 1%;
}

.pagination-box {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.pagination-box > span {
  width: 20px;
  height: 6px;
  border-radius: 3px;
  margin: 0 4px;
  background-color: #b4b4b4;
}

.pagination-box > span.chose {
  background-color: #ff4444;
}
</style>
