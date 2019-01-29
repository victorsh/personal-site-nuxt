<template>
  <div id='nav-container' v-bind:class="{'nav-about': isAbout, 'nav-home': isHome, 'nav-game': isGame, 'nav-project': isProject}" class='fixed-top'>
    <nuxt-link to="/">
      <button type="button" class='btn btn-outline-info btn-sm'>Home</button>
    </nuxt-link>
    <nuxt-link to="/game">
      <button type="button" class='btn btn-outline-success btn-sm'>Game</button>
    </nuxt-link>
    <nuxt-link to="/about">
      <button type="button" class='btn btn-outline-info btn-sm'>About</button>
    </nuxt-link>
    <nuxt-link to="/projects">
      <button type="button" class='btn btn-outline-danger btn-sm'>Projects</button>
    </nuxt-link>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'NavLinks',
  data() {
    return {
      black: 'blank',
      isHome: false,
      isAbout: false,
      isGame: false,
      isProject: false
    }
  },
  beforeMount: function() {
    if(this.$route.path === '/'){
      this.isHome = true;
      this.isAbout = false;
      this.isGame = false;
      this.isProject = false;
    } else if(this.$route.path === '/about') {
      this.isAbout = true;
      this.isHome = false;
      this.isGame = false;
      this.isProject = false;
    } else if(this.$route.path === '/game') {
      this.isGame = true;
      this.isAbout = false;
      this.isHome = false;
      this.isProject = false;
    } else if(this.$route.path === '/projects') {
      this.isGame = false;
      this.isAbout = false;
      this.isHome = false;
      this.isProject = true;
    }
  },
  beforeCreate: function() {

  },
  computed: {
    ...mapState([
      'rotateCube'
    ]),
    ...mapMutations([
      'setRotateCube'
    ])
  },
  methods: {
    updateCube: function() {
      this.$store.commit('setRotateCube', true);
    }
  }
}
</script>


<style>
  #nav-container {
    z-index: 3;
    padding: 10px;
  }
  .nav-home {
    background: none;
  }

  .nav-about {
    background: white;
  }

  .nav-project {
    background: white;
  }

  .nav-game {
    background: none;
  }
</style>