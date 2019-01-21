import Vue from 'vue'

export default {
  /* ******************************************** */
  // State
  /* ******************************************** */
  state: () => ({
    mintingToken: false,
    tokenMinted: false,
    rotateCube: false,
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
    setMintingToken (state, status) {
      state.mintingToken = status;
    },
    setTokenMinted (state, status) {
      state.tokenMinted = status;
    },
    setRotateCube (state, status) {
      state.rotateCube = status;
    },
    setPageState (state, status) {
      state.pageState = status;
    }
  }
}