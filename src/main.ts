import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount("#app");

if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
  import("./mock/adapter").then(({ initMockAdapter }) => {
    import("./utils/http").then(({ default: http }) => {
      initMockAdapter(http);
    });
  });
}
