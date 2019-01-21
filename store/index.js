import Vue from 'vue'

export default {
  /* ******************************************** */
  // State
  /* ******************************************** */
  state: () => ({
    rotateCube: false,
    cubeRotateButton: true,
    pageState: 'start'
  }),
  /* ******************************************** */
  // Actions
  /* ******************************************** */
  actions: {
    async MINT_TOKEN() {
      return await this.$axios.get(process.env.API_URL_DEV+'/mint')
    },
    async GET_HELLO() {
      return this.$axios.get(process.env.API_URL_DEV+'/hello')
    }
  },
  /* ******************************************** */
  // Mutations
  /* ******************************************** */
  mutations: {
    setRotateCube (state, status) {
      state.rotateCube = status;
    },
    setCubeRotateButton (state, status) {
      state.cubeRotateButton = status;
    },
    setPageState (state, status) {
      state.pageState = status;
    }
  }
}