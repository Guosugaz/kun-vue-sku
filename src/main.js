import Vue from "vue";
import App from "./App";
import VueSpec from "./lib";

Vue.use(VueSpec);

new Vue({
    render: h => h(App)
}).$mount("#app");