<template>
  <div id='nav-container' class='fixed-top'>
    <nuxt-link to="/">
      <button type="button" class='btn btn-outline-light'>Home</button>
    </nuxt-link>
    <nuxt-link to="/game">
      <button type="button" class='btn btn-outline-light'>Game</button>
    </nuxt-link>
    <nuxt-link to="/about">
      <button type="button" class='btn btn-outline-light'>About</button>
    </nuxt-link>
    <nuxt-link to="/blog">
      <button type="button" class='btn btn-outline-light'>Blog</button>
    </nuxt-link>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'NavLinks',
  components: {

  },
  data() {
    return {
      black: 'blank'
    }
  },
  computed: {
    ...mapState([
      'rotateCube',
      'pageState'
    ]),
    ...mapMutations([
      'setRotateCube',
      'setPageState'
    ])
  },
  methods: {
    updateCube: function() {
      this.$store.commit('setRotateCube', true);
    },
    switchPage: function(page) {
      this.$store.commit('setPageState', page)
    }
  }
}
</script>


<style>
  #nav-container {
    z-index: 1;
    padding: 15px;
  }
</style>