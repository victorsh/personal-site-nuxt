<template>
  <div id="three-container"></div>
</template>

<script>
import * as Three from 'three'
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
    this.init();
    this.animate();
  },
  destroyed: function() {
    document.removeEventListener('resize', this.onWindowResize, false);
  },
  methods: {
    init: function() {
      let container = document.getElementById('three-container');
      let width = window.innerWidth;
      let height = window.innerHeight;
      this.camera = new Three.PerspectiveCamera(75, width/height, 0.1, 1000);
      this.clock = new Three.Clock();

      this.renderer = new Three.WebGLRenderer({antialias: true});
      this.renderer.setClearColor('#000000')
      this.renderer.setSize(width, height);
      this.camera.position.z = 10;
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.update()

      this.scene = new Three.Scene();

      // Loading
      this.loadingManagerThree = new Three.LoadingManager(() => {
        console.log('loading');
      });
      this.loader = new Three.ImageLoader();
      this.loader.load(
        '/particle.png',
        function (image) {
          console.log('loaded');
        },
        undefined,
        function () {
          console.error('An error has occurred loading the particle image');
        }
      )

      this.light = new Three.DirectionalLight(0xFFFFFF);
      this.scene.add(this.light);

      this.pointsGeometry = new Three.Geometry()
      for(let i = 0; i<1000; i++){
        var point = new Three.Vector3()
        point.x = Three.Math.randFloatSpread(100)
        point.y = Three.Math.randFloatSpread(100)
        point.z = Three.Math.randFloatSpread(100)
        this.pointsGeometry.vertices.push(point)
      }
      this.pointsMaterial = new Three.PointsMaterial({
        color: 0xFFFFFF, map: Three.ImageUtils.loadTexture(
          "/particle_white.png"
        ),
        blending: Three.AdditiveBlending,
        transparent: true
      })
      this.pointsSystem = new Three.Points(this.pointsGeometry, this.pointsMaterial)
      this.pointsSystem.sortParticles = true;
      this.scene.add(this.pointsSystem)

      // let geometry = new Three.BoxGeometry(2, 2, 2);
      let geometry;
      let material;
      if(this.$route.path === '/') {
        geometry = new Three.OctahedronBufferGeometry(2, 0);
        material = new Three.MeshPhongMaterial({color: '#00d0ff'});
      } else if (this.$route.path === '/about') {
        geometry = new Three.IcosahedronBufferGeometry(2, 0);
        material = new Three.MeshPhongMaterial({color: '#1eff8b', wireframe: true});
      }
      
      this.mesh = new Three.Mesh(geometry, material);
      this.scene.add(this.mesh);

      container.appendChild(this.renderer.domElement);
      window.addEventListener('resize', this.onWindowResize, false)

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
</style>