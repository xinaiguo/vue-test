import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'
import toast from './components/common/toast'
import FastClick from 'fastclick'


Vue.config.productionTip = false
Vue.config.devtools = true;

Vue.prototype.$bus = new Vue();
Vue.use(toast)

// 解决移动端点击延迟300秒
FastClick.attach(document.body)


new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
