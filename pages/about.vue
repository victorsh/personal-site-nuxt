<template>
  <section class="container-about">
    <nav-links/>
    <three-scene/>
    
    <div id='main-about'>
      <div class='title-about'>About</div>
      <div class='subtitle-about'>
        <p>I'm a computer science graduate with an interest in web based technologies. Computers have
        facinated me all throughout my life. I'd like to learn everything there is to know about 
        computation, unfortunatly, this requires a large amount of horizontal and vertical scaling. To remedy
        this conundrum I decided to focus my computational curiosity on web based technologies. The web has always 
        fascinated me in it's ability to run on any device with a connection to the internet.</p>
        <p> Even when focusing my attention to a single field of computation, I still feel overwhelmed by the vast array
        of possibilities based around web based development. This is however more exciting to me than anything
        else, I feel fortunate to live in a time where there is so much progress being made on the web. I will
        continue to explore and create using these rapidly changing technologies and hopefully, in the future,
        contribute to their enchancement. </p>
      </div>

      <div class='title-about'>this.site</div>
      <div class='subtitle-about'>
        This website was built using a combination of related technologies.
        I can break down the app as hosting, frameworks, and graphics.
        <ul>
          <li>I'm using ...</li>
          <ul>
            <li>Netlify as hosting, enabling continuos integration & development.</li>
            <li>NuxtJS + Bootstrap to build the front-end.</li>
            <li>ThreeJS to create the 3D visuals.</li>
            <li>Express for the back-end.</li>
          </ul>
        </ul>
      </div>
    </div>
    
    <bottom-links />

  </section>
</template>

<script>
import ThreeScene from '~/components/ThreeScene.vue'
import NavLinks from '~/components/NavLinks.vue'
import BottomLinks from '~/components/BottomLinks.vue'
import { mapState, mapActions, mapMutations } from 'vuex'
import emojijs from 'emoji-js'

export default {
  components: {
    ThreeScene,
    NavLinks,
    BottomLinks
  },
  data() {
    return {
      blank: 'blank'
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
#main-about {
  position: relative;
  z-index: 1;
  text-align: left;
  margin-top: 60px;
  margin-bottom: 60px;
}

#main-about ul li {
  list-style-type: none;
  color: #1eff8b;
}

.container-about {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  padding-left: 10%;
  padding-right: 10%;
}

.container h2 {
  font-size: 32px;
}

.container h5 {
  font-size: 20px;
}

.title-about {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 28px;
  color: #ff0000;
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

.subtitle-about {
  font-weight: 300;
  font-size: 16px;
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
