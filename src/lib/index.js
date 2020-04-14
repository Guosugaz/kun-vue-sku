import Spec from "./Spec";

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(SlideVerify)
}

export default {
    install(Vue) {
        Vue.component("VueSpec", Spec)
    }
}
