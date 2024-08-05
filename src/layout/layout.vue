<template>
  <div>
    <PageHeader :currentNav="props.currentNav" />
    <!-- <router-view v-slot="{ Component }"> -->
    <!--指定 Commodity 组件缓存， 文档里面写的 需要给组件一个名字，但是又由于是setup写法，所以需要再写一个导出的名字 -->
    <!--详情可以看  personal.vue 文件最底部 -->
    <!-- 相关文章 https://zhuanlan.zhihu.com/p/481640259 -->
    <!-- <KeepAlive include="Commodity,Label"></KeepAlive> -->
    <!-- <KeepAlive include="personal">
        <component :is="Component" />
      </KeepAlive>
    </router-view> -->
    <router-view></router-view>
    <PageFooter v-show="showFooter" />
  </div>
</template>

<script setup>
import PageHeader from "./PageHeader.vue";
import PageFooter from "./PageFooter.vue";
import { useRoute } from "vue-router";
import { computed } from "@vue/reactivity";

let route = useRoute();

let showFooter = computed(() => {
  //需要隐藏footer的页面
  let hideFooterRouteName = ["personal", "collections"];
  return !hideFooterRouteName.includes(route.name);
});

const props = defineProps({
  // isBlackSkin: {
  //   type: Boolean,
  //   default: false,
  // },
  currentNav: {
    type: String,
    default: "HOME",
  },
});
</script>

<style scoped></style>
