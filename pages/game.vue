<template>
  <section class="container-fluid">
    <three-game/>
    <nav-links/>
  </section>
</template>

<script>
import ThreeGame from '~/components/ThreeGame.vue'
import NavLinks from '~/components/NavLinks.vue'
import emojijs from 'emoji-js'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  components: {
    ThreeGame,
    NavLinks
  },
  data() {
    return {
      blank: 'blank'
    }
  },
  beforeCreate: function() {
    this.emojijs = new emojijs.EmojiConvertor();
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
    },
  }
}
</script>

<style>

.container-fluid {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}

.under-construction {
  position: relative;
  z-index: 1;
  font-size: 36px;
  color: white;
}
</style>
