import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import App from './App.vue'
import store from './store/'
import Element from 'element-ui'

import '@/directives'
import '@/sass/main.scss'

Vue.config.productionTip = false

Vue.use(Element)
Vue.use(Vuex)
/*
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')*/

const app = new Vue({
  router,
  store,
  //i18n,
  render: (h) => h(App)
})

// Connection socket websocket

store.dispatch('WS/COWS')
store.dispatch('user/autoLogin').finally(() => {
  app.$mount('#app')
})

/*
try {
  //Y a t il un jeton valide (cookies)
console.log('ighggggg',)

  let rep = await HTTP.get('/user/me')
  console.log('ic22i',rep)
  this.$store.commit('user/setName',rep.data.name)
  //Co au WS
  await this.$store.dispatch('WS/COWS')
  // console.log(this.$router)
  if (this.$router.currentRoute.path == '/login') {
    this.$router.push('home')
  }
} catch (err) {
  this.$router.push('login')
}
}
}*/