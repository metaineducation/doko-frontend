import { render, createVNode } from "vue";
import Loading from "./Loading.vue";

let loadingInstance;

function createLoadingView(options) {
  if (loadingInstance) return loadingInstance;
  let loadingWrapper = document.createElement("div");
  const vm = createVNode(Loading, options, null);
  render(vm, loadingWrapper);
  document.body.appendChild(loadingWrapper);
  loadingInstance = {
    component: vm.component,
    wrapper: loadingWrapper,
  };
  return loadingInstance;
}

export default function (msg) {
  const options = {
    visible: true,
    message: msg,
  };
  const { component, wrapper } = createLoadingView(options);
  return {
    close() {
      component.props.visible = false;
      document.body.removeChild(wrapper);
    },
    setMessage(text) {
      component.props.message = text;
    },
  };
}
