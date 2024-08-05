<template>
  <teleport to="body">
    <div
      class="dialog-wrapper"
      v-if="props.visible && props.modal"
      @click="props.closeOnClickModal && closeModal()"
    ></div>
    <div
      class="dialog-view"
      v-if="props.visible"
      :style="{
        top: props.top,
        transform: props.top ? 'translate(-50%, 0)' : '',
        width: props.fullscreen ? '100%' : '',
        'min-height': props.fullscreen ? '100vh' : '',
      }"
    >
      <div class="dialog-title" v-if="props.title || $slots.title">
        <slot name="title">{{ props.title }}</slot>
        <div class="close" @click="closeModal" v-if="props.showClose">
          <Image src="@/assets/icon/close.png" alt="" />
        </div>
      </div>
      <div class="dialog-content" v-if="props.content || $slots.default">
        <slot>{{ props.content }}</slot>
      </div>
      <div class="dialog-footer" v-if="$slots.footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import Image from "../Image.vue";

const props = defineProps({
  // 是否显示
  visible: {
    type: Boolean,
    default: false,
  },
  // 标题，slot有值就忽略
  title: String,
  // 是否显示关闭按钮
  showClose: {
    type: Boolean,
    default: true,
  },
  // 距离顶部的位置，不设置就垂直居中
  top: String,
  // 内容，slot有值就忽略
  content: String,
  // 宽度
  width: {
    type: String,
    default: "50%",
  },
  // 是否全屏
  fullscreen: {
    type: Boolean,
    default: false,
  },
  // 是否显示遮罩
  modal: {
    type: Boolean,
    default: true,
  },
  // 关闭之前操作，通过返回false或者reject阻止关闭
  beforeClose: Function,
  // 是否支持点击遮罩关闭
  closeOnClickModal: {
    type: Boolean,
    default: true,
  },
  // 是否支持esc关闭
  closeOnPressEscape: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["update:visible"]);

async function closeModal() {
  if (typeof props.beforeClose === "function") {
    try {
      let result = await props.beforeClose();
      if (!result) return;
    } catch (e) {
      return;
    }
  }
  emit("update:visible", false);
}

function handleKeyUpEvent(evt) {
  console.log("evt", evt);
  if (evt.key === "Escape") {
    closeModal();
  }
}

onMounted(() => {
  if (props.closeOnPressEscape) {
    window.addEventListener("keyup", handleKeyUpEvent, false);
  }
});

onBeforeUnmount(() => {
  if (props.closeOnPressEscape) {
    window.removeEventListener("keyup", handleKeyUpEvent, false);
  }
});
</script>

<style lang="scss" scoped>
.dialog-wrapper {
  position: fixed;
  z-index: 999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba($color: #000000, $alpha: 0.3);
}
.dialog-view {
  position: fixed;
  z-index: 1000;
  top: 50%;
  left: 50%;
  width: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 4px;
  .dialog-title {
    height: 60px;
    padding: 0 20px;
    position: relative;
    display: flex;
    align-items: center;
    font-size: 18px;
    .close img {
      width: 30px;
      position: absolute;
      right: 20px;
      top: 20px;
      cursor: pointer;
    }
  }
  .dialog-content {
    padding: 20px;
  }
  .dialog-footer {
    padding: 20px;
    text-align: right;
  }
}
</style>
