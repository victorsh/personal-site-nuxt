<template>
  <section class="container">
    <nav-links/>
    <three-scene/>
    
    <div id='main'>
      <h2 class="title pulsate noselect">
        Victor Shahbazian
      </h2>
      <h5 class="subtitle noselect">
        exploring an endless <code>void</code> of computational possibilities
      </h5>
      <div v-if="cubeRotateButton === true">
        <button type="button" class="btn btn-success" @click.prevent="updateCube">
          >
        </button>
      </div>
    </div>
    
    <bottom-links />

  </section>
</template>

<script>
import emojijs from 'emoji-js'
import ThreeScene from '~/components/ThreeScene.vue'
import NavLinks from '~/components/NavLinks.vue'
import BottomLinks from '~/components/BottomLinks.vue'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  components: {
    ThreeScene,
    NavLinks,
    BottomLinks
  },
  data() {
    return {
      blank: 'blank',
      emojiSmile: ''
    }
  },
  created: function() {

  },
  computed: {
    ...mapState([
      'rotateCube',
      'cubeRotateButton',
      'pageState'
    ]),
    ...mapMutations([
      'setRotateCube',
      'setCubeRotateButton',
      'setPageState'
    ])
  },
  methods: {
    updateCube: function() {
      this.$store.commit('setRotateCube', true);
      this.$store.commit('setCubeRotateButton', false);
    },
    switchPage: function(page) {
      this.$store.commit('setPageState', page)
    }
  }
}
</script>

<style>
#main {
  position: relative;
  z-index: 2;
}

.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.container h2 {
  font-size: 32px;
}

.container h5 {
  font-size: 20px;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #fff6d6;
  letter-spacing: 1px;
}

.pulsate {
  -webkit-animation: pulsate 3s ease-in-out;
  animation: pulsate 3s ease-out;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  opacity: 0.1;
}

@keyframes pulsate {
  0% {
    opacity: 0.1;
  }
  50% {
    opacity: 1.0;
  }
  100% {
    opacity: 0.1;
  }
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #fff9e5;
  word-spacing: 5px;
  padding-bottom: 15px;
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

  #nav-container {
    padding: 10px;
  }
</style>
