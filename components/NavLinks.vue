<template>
  <div id='nav-container' v-bind:class="{'nav-home': isHome, 'nav-about': isAbout, 'nav-game': isGame}" class='fixed-top'>
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
  beforeMount: function() {
    if(this.$route.path === '/'){
      this.isHome = true;
      this.isAbout = false;
      this.isGame = false;
    } else if(this.$route.path === '/about') {
      this.isAbout = true;
      this.isHome = false;
      this.isGame = false;
    } else if(this.$route.path === '/game') {
      this.isGame = true;
      this.isAbout = false;
      this.isHome = false;
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
    z-index: 2;
    padding: 10px;
  }
  .nav-home {
    background: none;
  }

  .nav-about {
    background: white;
  }

  .nav-game {
    background: none;
  }
</style>