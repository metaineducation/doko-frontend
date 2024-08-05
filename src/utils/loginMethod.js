import { render, createVNode } from "vue";
import useUserStore from "../stores/userStore";
import Login from "../components/Login.vue";

let loginWrapper = null;
let callbackQuene = [];
// if a page use login method over one time, please use callback type other than promise
const login = (cb) => {
  if (typeof cb === "function") callbackQuene.push(cb);
  const userStore = useUserStore();
  if (userStore.isLogin()) {
    handleLoginSuccess(userStore.userInfo);
    return;
  }
  let options = {
    onClose: () => {
      closeModal();
      callbackQuene = [];
    },
    onSuccess: (res) => {
      handleLoginSuccess(res);
    },
    onError: (e) => {
      console.log(e);
      callbackQuene = [];
    },
  };
  if (loginWrapper) return;
  loginWrapper = document.createElement("div");
  const vm = createVNode(Login, options, null);
  render(vm, loginWrapper);
  document.body.appendChild(loginWrapper);
};

function closeModal() {
  if (!loginWrapper) return;
  document.body.removeChild(loginWrapper);
  loginWrapper = null;
}

function handleLoginSuccess(userInfo) {
  while (callbackQuene.length) {
    const fn = callbackQuene.shift();
    fn(userInfo);
  }
}

export default login;
