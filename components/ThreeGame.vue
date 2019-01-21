<template>
  <div id="three-container"></div>
</template>

<script>
import * as Three from 'three'
import * as game from './game/game'
import OrbitControls from 'orbit-controls-es6'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'ThreeGame',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      clock: null,
      controls: null,
      mesh: null,
      light: null,
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
    game.test();
  },
  mounted() {
    this.init();
    this.animate();
  },
  destroyed: function() {
    window.removeEventListener('resize', this.onWindowResize, false);
    window.removeEventListener('keyup', printEvents, false);
    window.removeEventListener('keydown', printEvents, false);
    
    window.removeEventListener('mouseup', printEvents, false);
    window.removeEventListener('mousedown', printEvents, false);
    window.removeEventListener('mousemove', printEvents, false);

    window.removeEventListener('touchstart', printEvents, false);
    window.removeEventListener('touchend', printEvents, false);
    window.removeEventListener('touchcancel', printEvents, false);
    window.removeEventListener('touchmove', printEvents, false);
  },
  methods: {
    init: function() {
      let container = document.getElementById('three-container');
      let width = window.innerWidth;
      let height = window.innerHeight;
      this.camera = new Three.PerspectiveCamera(75, width/height, 0.1, 1000);
      this.clock = new Three.Clock();

      this.renderer = new Three.WebGLRenderer({antialias: true});
      this.renderer.setClearColor('#000000');
      this.renderer.setSize(width, height);
      this.camera.position.z = 10;
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.update()

      this.scene = new Three.Scene();

      game.initObjects(this.scene);

      container.appendChild(this.renderer.domElement);
      window.addEventListener('resize', this.onWindowResize, false);
      window.addEventListener('keyup', printEvents, false);
      window.addEventListener('keydown', printEvents, false);

      window.addEventListener('mousedown', printEvents, false);
      window.addEventListener('mouseup', printEvents, false);
      window.addEventListener('mousemove', printEvents, false);

      window.addEventListener('touchstart', printEvents, false);
      window.addEventListener('touchend', printEvents, false);
      window.addEventListener('touchcancel', printEvents, false);
      window.addEventListener('touchmove', printEvents, false);

    },
    initializeObjects: function() {
      this.light = new Three.DirectionalLight(0xFFFFFF);
      this.scene.add(this.light);

      // let geometry = new Three.BoxGeometry(2, 2, 2);
      let geometry = new Three.OctahedronBufferGeometry(2, 0);
      let material = new Three.MeshPhongMaterial({color: '#00d0ff'});
      this.mesh = new Three.Mesh(geometry, material);
      this.scene.add(this.mesh);
    },
    animate: function() {
      requestAnimationFrame(this.animate);
      let delta = this.clock.getDelta();

      this.scene.getObjectByName("octahedron").rotation.x += 0.1 * delta;
      this.scene.getObjectByName("octahedron").rotation.y += 0.1 * delta;

      this.controls.update();
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