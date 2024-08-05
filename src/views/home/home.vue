<template>
  <div class="g-main">
    <div class="s1">
      <div class="aa">
        <h1 class="text1">
          The First <br />
          NFTs Transformeo <br />
          Into <strong class="in">AI Companion</strong>
        </h1>
        <p class="text2">Choose your AI Brain, and talk to it at any time</p>
        <button class="btns btn2">Coming Soon...</button>
      </div>
      <div class="bb">
        <Image src="/bg.png" />
      </div>
    </div>

    <div class="s2">
      <h2 class="i-tit">
        <span>
          DOKO AI Brain
          <i></i>
        </span>
      </h2>
      <div class="df-js aa">
        <div class="a1">
          <span class="ico"><Image src="/h-icon01.png" /></span>
          <div class="in">
            <h3>DOKO Assistant<em>Try saying:</em></h3>
            <div class="df txts">
              <button class="btns btn1 rbbr">
                <span class="in"
                >“What type of fish is Dory from Finding Nemo?”</span
                >
              </button>
              <button class="btns btn1 rbbr">
                <span class="in">“What is the future of the market?”</span>
              </button>
            </div>
            <button class="btns btn2 lgtl">
              Talk with DOKO
              <i class="triangle"></i>
            </button>
          </div>
        </div>
        <div class="a1">
          <span class="ico"><Image src="/h-icon02.png" /></span>
          <div class="in">
            <h3>Crypto Analyst<em>Try saying:</em></h3>
            <div class="df txts">
              <button class="btns btn1 rbbr">
                <span class="in">“Who is the founder of Bitcoin?”</span>
              </button>
              <button class="btns btn1 rbbr">
                <span class="in">“Which country supports crypto assets?”</span>
              </button>
            </div>
            <button class="btns btn2 lgtl">
              Talk with DOKO
              <i class="triangle"></i>
            </button>
          </div>
        </div>
        <div class="a1">
          <span class="ico"><Image src="/h-icon03.png" /></span>
          <div class="in">
            <h3>English teacher<em>Try saying:</em></h3>
            <div class="df txts">
              <button class="btns btn1 rbbr">
                <span class="in"
                >“How to quickly master a foreign language?”</span
                >
              </button>
              <button class="btns btn1 rbbr">
                <span class="in">“How to say hello in English?”</span>
              </button>
            </div>
            <button class="btns btn2 lgtl">
              Talk with DOKO
              <i class="triangle"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="s3">
      <h2 class="i-tit">
        <span>
          What can DOKO do?
          <i></i>
        </span>
      </h2>
      <div class="df-ac-js aa">
        <div class="a1">
          <Image src="/h-sample01.jpg" />
        </div>
        <div class="a2">
          <h3>The first product that empowers NFT with AI capabilities</h3>
          <p>
            Connect the wallet, DOKO will detect the NFT you hold and
            set your NFT as your AI conversation avatar, unlocking aspecific NFT
            will also trigger different gameplay.
          </p>
          <button class="btns btn2 lgtl" @click="showServiceModal = true">
            Join Waitlist
          </button>
        </div>
      </div>
      <div class="df-ac-js bb">
        <div class="a1">
          <Image src="/h-sample02.jpg" />
        </div>
        <div class="a2">
          <h3>Bring AI into the game</h3>
          <p>
            DOKO provides a number of different casual games, which support you
            to put your favorite AI model into the game character, let AI take
            adventure in the game world for you, collect items and
            equipments, socialize with other game players, etc.
          </p>
          <button class="btns btn2 lgtl" @click="showServiceModal = true">
            Join Waitlist
          </button>
        </div>
      </div>
      <div class="df-ac-js cc">
        <div class="a1"><Image src="/h-sample03.jpg" /></div>
        <div class="a2">
          <h3>Answer your questions in real time</h3>
          <p>
            Without any configuration, DOKO thinks in parallel with the AI brain
            in real time, providing the answers you need in seconds.
          </p>
          <button class="btns btn2 lgtl" @click="showServiceModal = true">
            Join Waitlist
          </button>
        </div>
      </div>
      <div class="df-ac-js dd">
        <div class="a1">
          <Image src="/h-sample04.jpg" />
        </div>
        <div class="a2">
          <h3>Your Personalized AI Model</h3>
          <p>
            DOKO AI can present different models of thousands of people according
            to the needs of each person. AI can remember your past questions,
            perceive your current emotions like human, and show AI models with
            different personalities according to your preferences. Do you need a
            listener or an AI that is good at analyzing and solving problems?
            DOKO can meet your individual needs. If you don't like customization,
            there are multiple AI roles for you to choose from our public market.
          </p>
          <button class="btns btn2 lgtl" @click="showServiceModal = true">
            Join Waitlist
          </button>
        </div>
      </div>
    </div>
  </div>

  <Modal
      :visible="showServiceModal"
      title="Join waitlist"
      @close="showServiceModal = false"
  />
</template>

<script setup>
import { ref } from "vue";
import Image from "../../components/Image.vue";
import Modal from "../../components/Modal.vue";

let showServiceModal = ref(false);
</script>

<style lang="scss" scoped>
@import "./home.scss";
</style>
