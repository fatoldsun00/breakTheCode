import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes:  [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { noguard: true }
    },
    {
      path: '/home', 
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: { noguard: true }
    },
    {
      path: '/game/:idGame',
      name: 'game',
      component: () => import('../views/Game.vue'),
      meta: { noguard: true }
    },
    {
      path: '*',
      redirect: '/login'
    }]
  
})

export default router
