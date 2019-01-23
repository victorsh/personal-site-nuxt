<template>
  <div id="three-container"></div>
</template>

<script>
import * as Three from 'three'
import Game from './game/game'
import * as utils from './utils/timeout'

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
      game: null
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
  },
  mounted() {
    this.init().then(()=>{
      this.loading = false;
      this.animate();
    });
  },
  destroyed: function() {
    window.removeEventListener('resize', this.onWindowResize, false);
  },
  methods: {
    init: async function() {
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
      window.addEventListener('resize', this.onWindowResize, false);
      
      this.game = new Game();
      this.game.initObjects(this.scene);
      this.game.initInteractions();
      this.game.removeInteractions();
    },
    animate: function() {
      requestAnimationFrame(this.animate);
      let delta = this.clock.getDelta();
      
      // let player = this.scene.getObjectByName("player");
      // interactions.handleMovement(delta, player, 8);
      this.game.loop(this.scene, delta);

      this.renderer.render(this.scene, this.camera);
    },
    onWindowResize: function () {
      let width = this.getWindowWidth();
      let height = this.getWindowHeight();
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

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