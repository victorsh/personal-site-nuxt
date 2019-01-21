<template>
  <div id="three-container"></div>
</template>

<script>
import * as THREE from 'three'
import OrbitControls from 'orbit-controls-es6'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'ThreeScene',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      clock: null,
      controls: null,
      mesh: null,
      pointsSystem: null,
      light: null,
      accelerateCube: 0.01
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
    this.init().then(()=>{
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
      let width = window.innerWidth;
      let height = window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
      this.clock = new THREE.Clock();

      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setClearColor('#000000')
      this.renderer.setSize(width, height);
      this.camera.position.z = 10;
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.update()

      this.scene = new THREE.Scene();

      // Loading
      let particleTexture = await this.loadTexture('/particle_white.png');

      this.light = new THREE.DirectionalLight(0xFFFFFF);
      this.scene.add(this.light);

      this.pointsGeometry = new THREE.Geometry();
      for(let i = 0; i<1000; i++){
        var point = new THREE.Vector3()
        point.x = THREE.Math.randFloatSpread(100)
        point.y = THREE.Math.randFloatSpread(100)
        point.z = THREE.Math.randFloatSpread(100)
        this.pointsGeometry.vertices.push(point)
      }
      // let particleTexture = new THREE.TextureLoader().load('/particle_white.png');
      this.pointsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF, map: particleTexture,
        blending: THREE.AdditiveBlending,
        transparent: true
      })
      this.pointsSystem = new THREE.Points(this.pointsGeometry, this.pointsMaterial);
      this.pointsSystem.sortParticles = true;
      this.scene.add(this.pointsSystem);

      // let geometry = new THREE.BoxGeometry(2, 2, 2);
      let geometry;
      let material;
      if(this.$route.path === '/') {
        geometry = new THREE.OctahedronBufferGeometry(2, 0);
        material = new THREE.MeshPhongMaterial({color: '#00d0ff'});
      } else if (this.$route.path === '/about') {
        geometry = new THREE.IcosahedronBufferGeometry(2, 0);
        material = new THREE.MeshPhongMaterial({color: '#1eff8b', wireframe: true});
      }
      
      this.mesh = new THREE.Mesh(geometry, material);
      this.scene.add(this.mesh);

      container.appendChild(this.renderer.domElement);
      window.addEventListener('resize', this.onWindowResize, false)

      await timeout(3000);
    },
    animate: function() {
      requestAnimationFrame(this.animate);
      let delta = this.clock.getDelta();
      if(this.$store.state.rotateCube){
        this.accelerateCube += 0.1 * delta;
        this.mesh.rotation.x += this.accelerateCube;
        this.mesh.rotation.y += this.accelerateCube;

        this.pointsSystem.rotation.x += this.accelerateCube * 0.01;
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

        this.mesh.rotation.x += this.accelerateCube;
        this.mesh.rotation.y += this.accelerateCube;

        this.pointsSystem.rotation.x += this.accelerateCube * 0.01;
      }

      this.pointsSystem.rotation.y -= 0.001;

      // this.pointsSystem.material.opacity -= 0.01

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

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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