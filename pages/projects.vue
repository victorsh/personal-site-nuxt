<template>
  <section class="container">
    <nav-links/>
    <three-scene/>
    
    <div id='main'>
      <div v-bind:class="{'sub-row': isDesktop, 'sub-row-mobile': !isDesktop}">

        <div class='card' style='width: 18rem;'>
          <img class='card-img-top' src='/game_gif.gif' width="286px" height="180px" alt='game card'>
          <div class='card-body'>
            <h5 class='card-title'>Blocks Down (Beta)</h5>
            <p class='card-text'>A procedurally generated block dodge game. Currently in Beta.</p>
            <nuxt-link to="/game">
              <button type="button" class='btn btn-primary btn-sm'>Visit</button>
            </nuxt-link>
          </div>
        </div>

        <div class='card' style='width: 18rem;'>
          <img class='card-img-top' src='/cyclone_gif.gif' width="286px" height="180px" alt='cyclone card'>
          <div class='card-body'>
            <h5 class='card-title'>Cyclone Distributor's Inc.</h5>
            <p class='card-text'>E-Commerce site built with wordpress and woocommerce</p>
            <a href='https://cyclonedistributorsinc.com' class='btn btn-primary'>Visit</a>
          </div>
        </div>

      </div>

      <div v-bind:class="{'sub-row': isDesktop, 'sub-row-mobile': !isDesktop}">

        <div class='card' style='width: 18rem;'>
          <img class='card-img-top' src='/saturn_chat_gif.gif' width="286px" height="180px" alt='saturn-chat card'>
          <div class='card-body'>
            <h5 class='card-title'>Saturn Chat</h5>
            <p class='card-text'>A 3D chat-room experience</p>
            <a href='http://saturnchat.com' class='btn btn-primary'>Visit</a>
          </div>
        </div>

        <div class='card' style='width: 18rem;'>
          <img class='card-img-top' src='/stream_graph_gif.gif' width="286px" height="180px" alt='stream-graph card'>
          <div class='card-body'>
            <h5 class='card-title'>Some Project</h5>
            <p class='card-text'>Coursework to display data as a stream graph.</p>
            <a href='https://sad-einstein-467d18.netlify.com/' class='btn btn-primary'>Visit</a>
          </div>
        </div>

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
      emojiSmile: '',
      isDesktop: false,
    }
  },
  created: function() {
    console.log(this.$device.isDesktop);
    this.$device.isDesktop ? this.isDesktop = true : this.isDesktop = false;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 2;
  margin-top: 60px;
  margin-bottom: 60px;
}

.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.sub-row {
  display:flex;
  flex-direction: row;
  padding: 1%;
}

.sub-row-mobile {
  display:flex;
  flex-direction: column;
  padding: 1%;
}

.card {
  opacity: 0.9;
  margin-right: 2%;
  margin-bottom: 2%;
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
