<template>
  <div
    :style="{ zIndex: props.zIndex - 1 }"
    class="modal-layer"
    v-if="visible && modal"
    @click="props.closeOnClickModal && handleClose()"
  ></div>
  <transition>
    <div
      :style="{ zIndex: props.zIndex, width: props.width }"
      class="modal"
      v-if="visible"
    >
      <div
        class="modal--header"
        :style="{
          border: $slots.title || props.title ? '' : 'none',
          'padding-bottom': $slots.title || props.title ? '' : '0px',
        }"
        v-if="$slots.title || props.title || props.showClose"
      >
        <slot name="title"></slot>
        <!-- <div class="modal--header__title" v-if="!$slots.title && props.title"> -->
        <div class="modal--header__title">
          {{ !$slots.title && props.title ? props.title : "" }}
        </div>
        <div class="modal--header__close" @click="handleClose">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="10" fill="#F5F7FA" />
            <path
              d="M7.17188 12.8284L12.8287 7.17151"
              stroke="#C0C6CC"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M7.17188 7.17163L12.8287 12.8285"
              stroke="#C0C6CC"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
      <div class="modal--content" ref="contentRef">
        <div class="mail" v-if="joinDone == false">
          <Image src="/h-icon04.png" />
          <input
            type="email"
            v-model.trim="mailAddress"
            placeholder="Email Address"
          />
        </div>
        <div class="err" v-if="errMsg">Email Address Error!</div>
        <div class="done" v-if="joinDone">
          Congrats! You're on the waitlist!
        </div>
        <button
          class="btns btn2 lgtl"
          @click="getMailAddress"
          v-if="joinDone == false"
        >
          Join
        </button>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";
import Image from "./Image.vue";
import api from "../api";

let contentRef = ref(null);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: String,
  width: {
    type: String,
    default: "auto",
  },
  modal: {
    type: Boolean,
    default: true,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  zIndex: {
    type: Number,
    default: 100,
  },
  // 是否支持点击遮罩关闭
  closeOnClickModal: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["close", "update:visible"]);

function handleClose() {
  emit("update:visible", false);
  emit("close");

  errMsg.value = false;
  joinDone.value = false;
}

// 获取用户输入的邮件地址，并发送给接口
const mailAddress = ref(""),
  joinDone = ref(false),
  errMsg = ref(false);

function isValidEmail(email) {
  // 正则表达式来匹配邮箱格式
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

async function getMailAddress() {
  if (isValidEmail(mailAddress.value)) {
    // console.log("邮箱格式正确！")
    let res = await api.myAccount.subscribe({
      email: mailAddress.value,
    });

    api.r(res, () => {
      //   console.log(res)
    });

    // 改变 输入框、错误信息、按钮 的状态
    mailAddress.value = "";
    errMsg.value = false;
    joinDone.value = true;
  } else {
    // console.log("请输入有效的邮箱地址！")
    errMsg.value = true;
  }
}
</script>

<style scoped lang="scss">
.modal-layer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba($color: #000000, $alpha: 0.4);
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 3px;
  border-radius: 15px;
  background-image: linear-gradient(to left, #aa10f9, #fa9136);
}

.modal--header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: -1px;
  padding: 40px 20px 20px;
  line-height: 28px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  color: #130419;
  background: #fff;
}

.modal--header__title {
  flex-grow: 1;
  text-align: center;
  font-size: 28px;
  font-weight: bold;
}

.modal--header__close {
  display: flex;
  transform: translate(10px, -30px);
  cursor: pointer;
  svg {
    width: 30px;
    height: 30px;
  }
}
.modal--header__close:hover path {
  stroke: #8c1aff;
}

.modal--content {
  padding: 20px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  background: #fff;
  .mail {
    position: relative;
    box-sizing: border-box;
    width: 400px;
    padding: 0 20px 30px;
    img {
      position: absolute;
      left: 45px;
      top: 12px;
      height: 20px;
    }
    input {
      width: 100%;
      height: 44px;
      padding: 0;
      border: none;
      border-radius: 22px;
      font-size: 16px;
      text-indent: 70px;
      color: #a2a2a2;
      background-color: #ececec;
    }
  }
  .err {
    margin-top: -20px;
    padding: 0 20px 20px;
    text-indent: 70px;
    font-size: 16px;
    color: #8c1aff;
  }
  .done {
    text-align: center;
    font-size: 16px;
    color: #130419;
  }
  .btn2 {
    margin: 0 auto;
    padding: 14px 70px;
    font-size: 16px;
  }
}

/*
 * 响应式兼容移动设备
 */
@media screen and (max-width: 600px) {
  .modal {
    width: 90% !important;
    .modal--content {
      .mail {
        width: 100%;
      }
    }
  }
}
</style>
