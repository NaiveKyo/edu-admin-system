// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/common.css'  // global css
import '@/icons'

Vue.config.productionTip = false

Vue.use(ElementUI)

// 全局变量用来控制父子组件共用同一页面时的显隐
var isShow = true

/* eslint-disable no-new */
new Vue({
  beforeCreate() {
    Vue.prototype.$isShow = isShow
  },
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
