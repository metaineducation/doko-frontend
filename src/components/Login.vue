<template>
  <Modal
    :visible="showLoginModal"
    width="550px"
    title="Sign in with your wallet"
    @close="closeModal"
  >
    <div class="wallet-item" @click="loginSubmit">
      <Image class="wallet-item-logo" src="/svg/metamask.svg" alt="" />
      <span class="wallet-item-name">Metamask</span>
    </div>
    <span v-show="showInstallMetaMaskButton" class="error">
      Please install MetaMask!
      <a
        style="text-decoration: underline"
        target="_blank"
        href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
      >
        click here
      </a>
    </span>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import api from "../api";
import Modal from "./Modal.vue";
import useUserStore from "@/stores/userStore";
import { onMounted, onUnmounted } from "vue";
import { useToast } from "vue-toastification";

import { checkChain } from "../utils/metamaskUtil";
import Image from "./Image.vue";

const toast = useToast();

const props = defineProps({
  onSuccess: Function,
  onError: Function,
  onClose: Function,
});

// login modal visible
const showLoginModal = ref(true);

function closeModal() {
  console.log("close");
  props.onClose && props.onClose(); //由于modal有  teleport 属性，所以这里删的是外面
  showLoginModal.value = false; //这里再把里面删掉
  window.removeEventListener("ethereum#initialized", handleEthereum, {
    once: true,
  });
}

let account = ref("");
const loginSubmit = async () => {
  if (!(await checkislogin())) {
    return;
  }

  if (checkMetaMaskInstalledLoading.value) {
    console.log("检查插件安装中...");
    return;
  }

  let isChecked = await checkChain();
  if (!isChecked) {
    console.log("checkChain false");
  }

  // let a = await GET_NONCE_API({
  //   address: account.value,
  // });

  // console.log(a);
  // debugger;

  //1先通过address拿 nonce
  const address = account.value;
  const resNonce = await api.userLogin.requestMetaMaskNonce({
    address: address,
  });

  if (resNonce.state.code) {
    return toast.error(resNonce.state.msg);
  }
  console.log(resNonce.data.value);
  //2 去签名
  const message =
    "Sign below to authenticate with ME Exchanger, nonce:" +
    resNonce.data.value;

  console.log(message);
  const signature = await window.ethereum.request({
    method: "personal_sign",
    params: [message, address, ""],
  });
  console.log(signature);

  const loginRes = await api.userLogin.customerLoginByMetaMask({
    walletAddress: address,
    signature: signature,
  });
  if (loginRes.state.code) {
    props.onError && props.onError(new Error(loginRes.state.msg));
    return toast.error(loginRes.state.msg);
  }
  const userStore = useUserStore();
  userStore.setUserInfo(loginRes.data);
  // showLoginModal.value = false;
  // trigger success
  props.onSuccess && props.onSuccess(loginRes.data);
  closeModal();
};

async function getAccount() {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  account.value = accounts[0];
}

let checkMetaMaskInstalledLoading = ref(true);
//是否显示安装插件按钮
let showInstallMetaMaskButton = ref(false);

async function handleEthereum() {
  const { ethereum } = window;
  if (ethereum && ethereum.isMetaMask) {
    console.log("Ethereum successfully detected!");
    checkMetaMaskInstalledLoading.value = false;
    await getAccount();
  } else {
    account.value = "Please install MetaMask!";
    showInstallMetaMaskButton.value = true;
    return console.log("Please install MetaMask!");
  }
}

async function checkislogin() {
  //检查是否安装了 metaMask
  if (window.ethereum) {
    await handleEthereum();
    return true;
  } else {
    window.addEventListener("ethereum#initialized", handleEthereum, {
      once: true,
    });

    // If the event is not dispatched by the end of the timeout,
    // the user probably doesn't have MetaMask installed.

    setTimeout(function () {
      handleEthereum();
      checkMetaMaskInstalledLoading.value = false;
    }, 3000); // 3 seconds

    //设置一个3s的loading
  }
}

onMounted(async () => {
  // console.log("login.vue onMounted");
});

onUnmounted(() => {
  // window.removeEventListener("ethereum#initialized", handleEthereum, {
  //   once: true,
  // });
});

//这样就能把子组件方法抛出去给父组件使用了
//https://segmentfault.com/q/1010000039304343
//使用 setup 语法糖，需要在子组件中使用 defineExpose 将父组件需要的属性和方法暴露出来后，父组件才能通过 childRef 来使用这些方法和属性。
//https://v3.cn.vuejs.org/api/sfc-script-setup.html#defineexpose
// defineExpose({
//   checkislogin,
//   loginSubmit,
//   // showlogin,
// });
</script>

<style scoped>
.mask {
  background-color: #000;
  opacity: 0.4;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
}
.login-wallet {
  z-index: 99;
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  position: absolute;
  width: 551px;
  height: 300px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 4px;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.wallet-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.wallet-item:hover {
  background: #f7f7f7;
  border-radius: 4px;
}
.wallet-item-logo {
  width: 60px;
  height: 60px;
}
.wallet-item-name {
  margin-left: 30px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 22px;
  color: #000000;
}
.error {
  color: red;
}
</style>
