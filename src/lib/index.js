import Spec from "./Spec";

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.component("VueSku", Spec)
}

export default {
    install(Vue) {
        Vue.component("VueSku", Spec)
    }
}
