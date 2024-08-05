<template>
  <div ref="target" class="custom-select" :class="{ 'has-value': selected }">
    <!-- 这里 @click="open = true" 要设置为true ， 因为有输入框的时候，要一直显示-->
    <div
      class="selected"
      :class="{ open: open, border: props.border }"
      @click="clickOpen"
    >
      <span class="sr">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 7L10 10L13 7"
            stroke="#828E99"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <!--是否显示图片-->

      <Image
        v-show="!showSearchableInput"
        style="width: 50px"
        v-if="props.imageKey && selected[props.imageKey]"
        :src="selected[props.imageKey]"
        alt=""
      />

      <!--对象 ||  文本 || placeholder-->
      <span v-show="!showSearchableInput" style="margin-left: 13px">
        {{
          selected[props.labelkey] || selected || props.placeholder || ""
        }}</span
      >

      <!--searchable-->
      <input
        ref="inpuRef"
        v-if="showSearchableInput"
        type="text"
        v-model="keyword"
      />
      <!-- style="border: 1px solid #f3f4f5; padding: 6px 4px; border-radius: 8px" -->
    </div>
    <div class="delete" @click="clear" v-if="props.clearable">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path
          fill="currentcolor"
          d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"
        />
      </svg>
    </div>
    <div
      class="items"
      ref="itemRef"
      :style="{ maxHeight: maxHeight + 'px' }"
      :class="{ selectHide: !open, 'm-0': props.border }"
    >
      <!-- 不是搜索模式的时候，才显示选中的样式-->
      <div
        class="item"
        :class="{
          'is-choose':
            props.searchable == false &&
            (selected[props.valuekey] || selected) ==
              (option[props.valuekey] || option),
        }"
        v-for="(option, i) of computedOptions"
        :key="i"
        @click="choose(option)"
      >
        <Image
          style="width: 50px"
          v-if="props.imageKey"
          :src="option[props.imageKey]"
          alt=""
        />
        {{ props.labelkey ? option[props.labelkey] : option }}
      </div>
      <div
        v-show="computedOptions.length == 0 && props.clearable"
        style="
          text-align: center;
          margin-bottom: 10px;
          padding: 10px 15px;
          border-radius: 8px;
          line-height: 20px;
          color: #828d99;
          user-select: none;
        "
      >
        No matching data
      </div>
    </div>
  </div>
</template>

<script setup>
/*
<!--
     传对象， 要指定  labelkey 和 valuekey
    <SelectVue
      placeholder="Select ..."
      :options="options"
      v-model="select"
      valuekey="id"
      labelkey="name"
    ></SelectVue>


    let select = ref("");
    let options = ref([
      {
        id: 1,
        name: "name1",
      },
      {
        id: 2,
        name: "name2",
      },
      {
        id: 3,
        name: "name3",
      },
    ]);





    <SelectVue
      placeholder="Select ..."
      :options="[1, 2, 3, 4]"
      v-model="select1"
    ></SelectVue>
    let select1 = ref(2);




-->
  <!--https://hackernoon.com/how-to-make-a-custom-select-component-in-vuejs-8kt32pj-->

*/
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { computed } from "@vue/reactivity";
import { watch } from "vue";
import Image from "./Image.vue";
let props = defineProps({
  placeholder: {
    type: String,
  },
  modelValue: {
    type: [String, Number],
    required: false,
  },
  options: {
    type: Array,
    required: true,
  },
  valuekey: {
    type: String,
  },
  labelkey: {
    type: String,
  },
  border: {
    type: Boolean,
    default: false,
  },
  onChange: {
    type: Function,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  imageKey: {
    type: String,
  },
  searchable: {
    type: Boolean,
    default: false,
  },
});

let emit = defineEmits(["update:modelValue", "change", "clear"]);

let itemRef = ref(null);
let maxHeight = ref(200);

const target = ref(null);
onClickOutside(target, () => (open.value = false));
let selected = ref(props.modelValue);
let keyword = ref("");
let inpuRef = ref(null);

//显示 searchabled 模式的时候，，input
let showSearchableInput = computed(() => {
  return props.searchable && open.value;
});

function clickOpen() {
  if (open.value == false) {
    //如果是关闭到打开，那么就清空input
    keyword.value = "";
  }
  open.value = true;
  setTimeout(() => {
    //打开的时候设置select区域的高度
    maxHeight.value =
      window.innerHeight - itemRef.value.getBoundingClientRect().y;
  }, 10);
  if (props.searchable) {
    setTimeout(() => {
      console.log(inpuRef.value);
      inpuRef.value && inpuRef.value.focus();
    }, 100);
  }
}
let computedOptions = computed(() => {
  return props.options.filter((e) => {
    // console.log(e);
    //options是对象
    if (props.labelkey) {
      return (e[props.labelkey] + "").includes(keyword.value);
    }

    //options非对象的时候
    return (e + "").includes(keyword.value);
  });
});

watch(
  () => props.modelValue,
  (val) => {
    console.log(val);
    selected.value = val;
    setSelect();
  }
);

function setSelect() {
  if (props.labelkey) {
    //如果是对象
    let opt = props.options.find((e) => e[props.valuekey] == props.modelValue);
    if (opt) {
      selected.value = opt;
    } else {
      console.error("not find");
    }
  }
}

setSelect();

// console.log(selected);
let open = ref(false);

function choose(option) {
  selected.value = option;
  open.value = false;
  emit("update:modelValue", option[props.valuekey] || option);
  emit("change", option[props.valuekey] || option);
}

function clear() {
  selected.value = "";
  emit("update:modelValue", "");
  emit("clear");
}
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  height: 59px;
  line-height: 59px;
}

.selected {
  background-color: #fff;
  border-radius: 6px;
  color: #828d99;
  /* padding-left: 13px; */
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
}

.border {
  border: 1px solid #f3f4f5;
}

.border .selected.open {
  border: 1px solid #f3f4f5;
}

.selected.open {
  /* border-radius: 6px 6px 0px 0px; */
}

.sr {
  display: flex;
  position: absolute;
  right: 8px;
  /* top:50%;
  transform: translate(0,-50%); */
}

.items {
  box-sizing: border-box;
  box-shadow: 0px 0px 12px rgba(5, 28, 51, 0.05);
  position: absolute;
  left: 0;
  right: 0;
  z-index: 10;
  transform: translate(0, 5px);
  width: 100%;
  padding: 10px 10px 0;
  border: 1px solid #f3f4f5;
  border-radius: 8px;
  color: #828d99;
  background-color: #fff;
  overflow: auto;
  /* 当无边框的时候要往外面扩一点，用于搜索条件，无边框样式*/
}

.m-0 {
  margin: 0;
  /*有边框的时候 还原*/
}

.item {
  margin-bottom: 10px;
  padding: 10px 15px;
  border-radius: 8px;
  line-height: 20px;
  color: #828d99;
  cursor: pointer;
  user-select: none;
}

.item:hover {
  background-color: #8c1aff;
  color: #fff;
}

.selectHide {
  display: none;
}

.is-choose {
  background-color: #f5f7fa;
}

.delete {
  display: none;
  width: 9px;
  height: 9px;
  position: absolute;
  background-color: #fff;
  padding: 5px;
  top: 16px;
  right: 5px;
  cursor: pointer;
  line-height: 0;
  color: #828d99;
}

.custom-select.has-value:hover .delete {
  display: block;
}
</style>
