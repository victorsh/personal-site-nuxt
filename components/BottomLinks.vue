<template>
  <div v-bind:class="{'about-bottom-links': isAbout, 'home-bottom-links': isHome}" class="fixed-bottom">
    <a href="https://linkedin.com/in/victor-shahbazian/" target="_blank">
      <button type="button" class="btn btn-outline-success">Linkedin</button>
    </a>
    <a href="https://github.com/victorsh" target="_blank">
      <button type="button" class="btn btn-outline-info">Github</button>
    </a>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'BottomLinks',
  components: {

  },
  data() {
    return {
      black: 'blank',
      isHome: false,
      isAbout: false,
      isGame: false,
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

.about-bottom-links {
  z-index: 2;
  opacity: 0.9;
  padding: 10px;
  background: white;
}

.home-bottom-links {
  z-index: 2;
  opacity: 0.9;
  padding: 10px;
}

.game-bottom-links {
  z-index: 2;
  opacity: 0.9;
  padding: 10px;
}
</style>