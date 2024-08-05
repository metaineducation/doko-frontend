<template>
  <div class="g-head df-ac">
    <div class="logo">
      <router-link to="/">
        <Image src="/logo.svg" width="145" />
        <Image src="/me.png" style="height: 37px; margin-left: 10px" />
      </router-link>
    </div>

    <div class="nav">
      <ul class="df">
        <li>
          <a href="javascript:void(0)">Features</a>
        </li>
        <li>
          <a href="javascript:void(0)">Models</a>
        </li>
        <li>
          <a href="javascript:void(0)">Docs</a>
        </li>
      </ul>
    </div>

    <div class="connect">
      <a href="https://twitter.com/DOKO_AI" target="_blank"
        ><Image src="/twitter.png"
      /></a>
    </div>

    <div class="join">
      <button class="btns btn1" @click="showServiceModal = true">
        <span class="in">Join Waitlist</span>
      </button>
    </div>

    <div class="menu">
      <span class="in">
        <i class="ico"></i>
      </span>
    </div>

    <Modal
      :visible="showServiceModal"
      title="Join waitlist"
      @close="showServiceModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Image from "../components/Image.vue";
import Modal from "../components/Modal.vue";

let showServiceModal = ref(false);
</script>
