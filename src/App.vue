<template>
  <router-view></router-view>
</template>

<script setup>
import { RouterView } from "vue-router";
// import { useRoute } from "vue-router";
import eventbus from "@/utils/eventbus";

eventbus.on("update-userinfo", function () {
  console.log("update-userinfo");
});
</script>
