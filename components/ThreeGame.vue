<template>
  <div>
    <div id="game-stats">
      <img src='/heart-icon.png' width="16px" height="16px" /><div id="player-health"></div>
      <img src='/coin-icon.png' width="16px" height="16px" /><div id="player-coins"></div>
      <div id="player-distance"></div>
    </div>
    <button id="pause-button" type="button" @click.prevent="pauseGame" class='btn btn-outline-danger btn-sm'>Pause</button>
    <button id="speed-button" type="button" class='btn btn-outline-success btn-sm'>speed</button>
    <div id="three-container"></div>
  </div>
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
      
      // Load UI
      let gameStats = document.querySelector('#game-stats');
      gameStats.style.top = this.getWindowHeight()/8 + 'px';

      let playerHealth = document.querySelector('#player-health');
      playerHealth.innerHTML = this.game.getHealth();

      let playerCoins = document.querySelector('#player-coins');
      playerCoins.innerHTML = this.game.getCoins();

      let playerDistance = document.querySelector('#player-distance');
      playerDistance.innerHTML = 'Distance: ' + this.game.getDistance();

      let speedButton = document.querySelector('#speed-button');
      speedButton.style.top = this.getWindowHeight() - 50 + 'px';
      speedButton.addEventListener('mousedown', this.speedUpGame, false);
      speedButton.addEventListener('mouseup', this.slowDownGame, false);
      speedButton.addEventListener('touchstart', this.speedUpGame, false);
      speedButton.addEventListener('touchend', this.slowDownGame, false);

      let pauseButton = document.querySelector('#pause-button');
      pauseButton.style.top = this.getWindowHeight() - 50 + 'px';
      pauseButton.style.left = this.getWindowWidth() - pauseButton.offsetLeft*7 + 'px';
      // Start Animating
      this.animate();
    });
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.onWindowResizeGame, false);
    window.removeEventListener('obstacle-collided', this.handleObstacleCollision, false);
    window.removeEventListener('coin-collided', this.handleObstacleCollision, false);
    window.removeEventListener('distance-update', this.handleUpdateDistance, false);
    window.removeEventListener('game-over', this.handleGameOver, false);
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
      this.camera = new Three.PerspectiveCamera(75, width/height, 1, 20);
      this.clock = new Three.Clock();

      this.renderer = new Three.WebGLRenderer({antialias: true});
      this.renderer.setClearColor('#000000');
	    this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(width, height);

      this.camera.position.z = -6;
      this.camera.position.y = 12;
      this.camera.lookAt(0, 0, -6);
      this.camera.position.x = -0.5;

      this.scene = new Three.Scene();

      container.appendChild(this.renderer.domElement);
      
      // ADD EVENT LISTENERS
      window.addEventListener('resize', this.onWindowResizeGame, false);
      window.addEventListener('obstacle-collided', this.handleObstacleCollision, false);
      window.addEventListener('coin-collided', this.handleCoinCollision, false);
      window.addEventListener('distance-update', this.handleUpdateDistance, false);
      window.addEventListener('game-over', this.handleGameOver, false);

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
    toScreenPosition: function() {
      let vector = new THREE.Vector3();
      let widthHalf = 0.5 * this.renderer.context.canvas.width;
      let heightHelf = 0.5 * this.renderer.context.canvas.height;

      obj.updateMatrixWorld();
      vector.setFromMatrixPosition(obj.matrixWorld);
      vector.project(this.camera);

      vector.x = ( vector.x * widthHalf ) + widthHalf;
      vector.y = - ( vector.y * heightHalf ) + heightHalf;

      return { 
        x: vector.x,
        y: vector.y
      };
    },
    getWindowWidth: function() {
      return window.innerWidth;
    },
    getWindowHeight: function() {
      return window.innerHeight;
    },
    pauseGame: function(e) {
      this.game.pauseGame();
    },
    speedUpGame: function(e) {
      e.preventDefault();
      this.game.speedUpGame();
    },
    slowDownGame: function(e) {
      e.preventDefault();
      this.game.slowDownGame();
    },
    resetGame: function() {
      this.handleObstacleCollision();
      this.handleCoinCollision();
      this.handleUpdateDistance();
    },
    handleObstacleCollision: function() {
      let health = this.game.decreaseHealth();
      let playerHealth = document.querySelector('#player-health');
      playerHealth.innerHTML = health;
    },
    handleCoinCollision: function() {
      let coins = this.game.increaseCoins();
      let playerCoins = document.querySelector('#player-coins');
      playerCoins.innerHTML = coins;
    },
    handleUpdateDistance: function() {
      let distance = this.game.getDistance();
      let playerDistance = document.querySelector('#player-distance');
      playerDistance.innerHTML = 'Distance: ' + distance;
    },
    handleGameOver: function() {
      console.log('game over!');
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

  #pause-button {
    position: fixed;
    z-index: 2;
    left: 10px;
  }

  #speed-button {
    position: fixed;
    z-index: 2;
    left: 10px;
  }

  #game-stats {
    position: fixed;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: white;
    z-index: 2;
  }

  #player-health {
    margin-right: 20px;
    margin-left: 2px;
  }

  #player-coins {
    margin-right: 20px;
    margin-left: 2px;
  }

  #player-distance {

  }
</style>