<template>
  <div id='nav-container' class='fixed-top'>
    <nuxt-link to="/">
      <button type="button" class='btn btn-outline-info btn-sm'>Home</button>
    </nuxt-link>
    <nuxt-link to="/game">
      <button type="button" class='btn btn-outline-success btn-sm'>Game</button>
    </nuxt-link>
    <nuxt-link to="/about">
      <button type="button" class='btn btn-outline-info btn-sm'>About</button>
    </nuxt-link>
    <!-- <nuxt-link to="/blog">
      <button type="button" class='btn btn-outline-info btn-sm'>Blog</button>
    </nuxt-link> -->
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
    padding: 10px;
    background: white;
    opacity: 0.9;
  }
</style>