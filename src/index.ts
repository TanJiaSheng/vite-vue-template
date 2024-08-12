import MagicInput from './index.vue'

MagicInput.name = 'magic-input'

MagicInput.install = function (Vue: any) {
    // 注册组件
    Vue.component('magic-input', MagicInput)
}

export default MagicInput