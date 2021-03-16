import router from '@/router/'
import { HTTP } from '../../axios-wrapper'

const state = {
  name: undefined,
}

const getters = {
  getName: (state) => state.name,
}

const actions = {
  autoLogin: async ({ commit })  => {
    try {
      let { data } = await HTTP.get('/user/me')
      commit('setName', data.name)
      if (router.currentRoute.path == '/login') {
        router.push('home')
      }
    } catch (err) {
      router.push('login')
    }
  },
}
const mutations = {
  setName: (state,name) => {
      state.name = name
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
