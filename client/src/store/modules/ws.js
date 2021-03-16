const state = {
  ws: undefined,
  wsMessage: undefined,
  onMessagefn: {}
}
 /* eslint-disable no-console */
const getters = {
  getWs: (state) => state.ws,
  getWSMessage: (state) => state.wsMessage,
}

const actions = {
  add_fn: ({ state }, fn) => {
    let id = Math.random().toString(36).substr(2, 9)
    //state.onMessagefn.push({ [id]: fn })
    state.onMessagefn[id] = fn
    return id
  },
  COWS: async ({ state, commit }) => {
      //TODO var env
      if (state.ws != undefined) state.ws.close()
      const ws = await new WebSocket('ws://localhost:8090/game')
      commit('setWs',ws)
  },
}
const mutations = {
  setWs: (state,ws) => {
    state.ws = ws
    state.ws.onopen = () => {
      state.ws.onmessage = ({data}) => {
        for (let k of Object.keys(state.onMessagefn)) {
          state.onMessagefn[k].fn(JSON.parse(data))
        }
      }
    }
  },
  remove_fn: (state, id) => {
    delete state.onMessagefn[id]
    /*for (let k in state.onMessagefn) {
      if (state.onMessagefn[k][id]) {
        state.onMessagefn.splice(k,1)
      }
    }*/
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
