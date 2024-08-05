import { createApp } from "vue";
import "vue-toastification/dist/index.css";
import { createPinia } from "pinia";
import "@/styles/index.scss";
import "@/styles/global.scss";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount("#app");
