<template>
  <div>
    <div v-if="loading" id="three-loading">Loading...</div>
    <div id="three-container"></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import OrbitControls from 'orbit-controls-es6'
import * as utils from './utils/timeout';
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'ThreeScene',
  data() {
    return {
      loading: true,
      camera: null,
      scene: null,
      renderer: null,
      clock: null,
      controls: null,
      accelerateCube: 0.01,
    }
  },
  computed: {
    ...mapState([
      'rotateCube',
      'cubeRotationButton'
    ]),
    ...mapMutations([
      'setRotateCube',
      'setCubeRotateButton'
    ])
  },
  created: function(){

  },
  mounted() {
    let loadDiv = document.querySelector('#three-loading');
    loadDiv.style.top = window.innerHeight/10 - loadDiv.offsetHeight/2 + 'px';
    loadDiv.style.left = window.innerWidth/2 - loadDiv.offsetWidth/2 + 'px';

    this.init().then(()=>{
      this.loading = false;
      this.animate();
    });
  },
  destroyed: function() {
    document.removeEventListener('resize', this.onWindowResize, false);
  },
  methods: {
    loadTextures: async function() {

    },
    init: async function() {
      let container = document.getElementById('three-container');
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(75, windowWidth/windowHeight, 0.1, 1000);
      this.clock = new THREE.Clock();

      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setClearColor('#000000')
      this.renderer.setSize(windowWidth, windowHeight);
      this.camera.position.z = 10;
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.update()

      this.scene = new THREE.Scene();

      // Load Textures
      let particleTexture = await this.loadTexture('/particle_white.png');

      // Setup Light
      let dirLight = new THREE.DirectionalLight(0xFFFFFF);
      this.scene.add(dirLight);

      // Setup Particle System
      let pointsGeometry = new THREE.Geometry();
      for(let i = 0; i<1000; i++){
        let point = new THREE.Vector3()
        point.x = THREE.Math.randFloatSpread(100)
        point.y = THREE.Math.randFloatSpread(100)
        point.z = THREE.Math.randFloatSpread(100)
        pointsGeometry.vertices.push(point)
      }
      let pointsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF, map: particleTexture,
        blending: THREE.NormalBlending,
        transparent: true
      })
      let pointsSystem = new THREE.Points(pointsGeometry, pointsMaterial);
      pointsSystem.sortParticles = true;
      pointsSystem.name = 'the-particles';
      this.scene.add(pointsSystem);

      // Create Rotation Object
      // Change rendered objecty shape and color based on Route Path
      let geometry;
      let material;
      if(this.$route.path === '/') {
        geometry = new THREE.OctahedronBufferGeometry(2, 0);
        material = new THREE.MeshPhongMaterial({color: '#00d0ff'});
      } else if (this.$route.path === '/about') {
        geometry = new THREE.IcosahedronBufferGeometry(2, 0);
        material = new THREE.MeshPhongMaterial({color: '#1eff8b', wireframe: true});
      }
      
      let mesh = new THREE.Mesh(geometry, material);
      mesh.name = 'rotator-object';
      this.scene.add(mesh);

      container.appendChild(this.renderer.domElement);
      window.addEventListener('resize', this.onWindowResize, false)

      // await utils.timeout(3000);
    },
    animate: function() {
      requestAnimationFrame(this.animate);
      let delta = this.clock.getDelta();
      let rtObject = this.scene.getObjectByName('rotator-object');
      let pointsSystem = this.scene.getObjectByName('the-particles');
      if(this.$store.state.rotateCube){
        this.accelerateCube += 0.1 * delta;
        rtObject.rotation.x += this.accelerateCube;
        rtObject.rotation.y += this.accelerateCube;

        pointsSystem.rotation.x += this.accelerateCube * 0.01;
        if(this.accelerateCube > 1.0){
          this.$store.commit('setRotateCube', false);
        }
      } else {
        if(this.accelerateCube > 0.01 && this.accelerateCube < 0.02){
          this.$store.commit('setCubeRotateButton', true);
        }
        if(this.accelerateCube > 0.01) {
          this.accelerateCube -= 0.1 * delta;
        }

        rtObject.rotation.x += this.accelerateCube;
        rtObject.rotation.y += this.accelerateCube;

        pointsSystem.rotation.x += this.accelerateCube * 0.01;
      }

      pointsSystem.rotation.y -= 0.001;

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    },
    loadTexture: function(url) {
      return new Promise(resolve => {
        new THREE.TextureLoader().load(url, resolve);
      })
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

</script>

<style scoped>
  #three-container {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
  }

  #three-loading {
    position: fixed;
    top: 0;
    left: 0;
    text-align: center;
    z-index: 1;
    color: white;
  }
</style>