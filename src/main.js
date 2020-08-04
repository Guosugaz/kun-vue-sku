import Vue from "vue";
import App from "./App";
import VueSku from "./lib";

Vue.use(VueSku);

new Vue({
    render: h => h(App)
}).$mount("#app");