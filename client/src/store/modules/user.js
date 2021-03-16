const state = {
  name: undefined,
}

const getters = {
  getName: (state) => state.name,
}

const actions = {
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
