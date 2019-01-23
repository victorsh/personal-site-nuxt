<template>
  <div id="three-container"></div>
</template>

<script>
import * as Three from 'three'
import Game from './game/game'
import * as utils from './utils/timeout'
import * as Stats from 'stats-js'

import OrbitControls from 'orbit-controls-es6'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'ThreeGame',
  data() {
    return {
      loading: true,
      camera: null,
      scene: null,
      renderer: null,
      clock: null,
      controls: null,
      game: null,
      stats: null,
      reqAnim: null,
    }
  },
  computed: {
    ...mapState([
      'rotateCube'
    ]),
    ...mapMutations([
      'setRotateCube'
    ])
  },
  created: function(){
    this.currentPage = true;
  },
  mounted() {
    this.init().then(()=>{
      this.loading = false;
      this.animate();
    });
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.onWindowResizeGame, false);
  },
  destroyed: function() {
    this.game.removeInteractions();

    // Remove GL
    this.renderer.forceContextLoss();
    this.renderer.context = null;
    this.renderer.domElement = null;
    this.renderer = null;

    document.body.removeChild(this.stats.dom);
    cancelAnimationFrame(this.reqAnim);
  },
  methods: {
    init: async function() {
      
      // Enable Stats
      this.stats = new Stats();
      this.stats.showPanel(0);
      document.body.appendChild(this.stats.dom);

      let container = document.getElementById('three-container');
      let width = window.innerWidth;
      let height = window.innerHeight;
      this.camera = new Three.PerspectiveCamera(75, width/height, 0.1, 1000);
      this.clock = new Three.Clock();

      this.renderer = new Three.WebGLRenderer({antialias: true});
      this.renderer.setClearColor('#000000');
	    this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(width, height);

      this.camera.position.z = -7;
      this.camera.position.y = 10;
      this.camera.lookAt(0, 0, -7);
      this.camera.position.x = -0.5;

      this.scene = new Three.Scene();

      container.appendChild(this.renderer.domElement);
      window.addEventListener('resize', this.onWindowResizeGame, false);

      this.game = new Game();
      this.game.initObjects(this.scene);
      this.game.initInteractions();
    },
    animate: function() {
      this.stats.begin();
      this.reqAnim = requestAnimationFrame(this.animate);
      let delta = this.clock.getDelta();
      
      // let player = this.scene.getObjectByName("player");
      // interactions.handleMovement(delta, player, 8);
      this.game.loop(this.scene, delta);

      this.renderer.render(this.scene, this.camera);
      this.stats.end();
    },
    onWindowResizeGame: function () {
      let width = this.getWindowWidth();
      let height = this.getWindowHeight();
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      console.log('Game');
      this.renderer.setSize(width, height);
    },
    getWindowWidth: function() {
      return window.innerWidth;
    },
    getWindowHeight: function() {
      return window.innerHeight;
    }
  }
}

function printEvents(e) {
  console.log(e);
}
</script>

<style scoped>
  #three-container {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
  }
</style>