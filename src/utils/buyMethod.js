import { render, createVNode } from "vue";
import Buy from "../components/Buy.vue";
let wrapper = null;
/*
  opt : {
    product
  }

*/
const buy = (opt) => {
  let options = {
    product: opt.product,
    onClose: () => {
      closeModal();
    },
    onSuccess: (closebuyModal, transactionHash) => {
      opt.onSuccess(closebuyModal, transactionHash);
      console.log("success", closebuyModal, transactionHash);
    },
    onError: (e) => {
      console.error(e);
    },
  };
  if (wrapper) return;
  wrapper = document.createElement("div");
  const vm = createVNode(Buy, options, null);
  render(vm, wrapper);
  document.body.appendChild(wrapper);
};

function closeModal() {
  if (!wrapper) return;
  document.body.removeChild(wrapper);
  wrapper = null;
}

export default buy;
