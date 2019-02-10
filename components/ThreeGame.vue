<template>
  <div>
    <div id="game-stats">
      <img src='/heart-icon.png' width="16px" height="16px" /><div id="player-health">{{health}}</div>
      <img src='/coin-icon.png' width="16px" height="16px" /><div id="player-coins">{{coins}}</div>
      <div id="player-distance">Distance {{distance}}</div>
    </div>
    <button id="pause-button" type="button" @click.prevent="showPauseGame" class='btn btn-outline-danger btn-sm'>Pause</button>
    <button id="speed-button" type="button" class='btn btn-outline-success btn-sm'>speed</button>
    <div id="three-container"></div>

    <!-- Pop-up windows -->
    <b-modal ref="startGame" 
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      :hide-header-close="true"
      hide-footer
      centered
      title="StartGame"
    >
      <p class="my-4">The objective of the game is to last as long as possible by keeping health above -1.</p>
      <p class="my-4">You lose health when you hit the green blocks.</p>
      <p class="my-4">The final score is determined by the number of coins collected and distance traveled.</p>
      <p class="my-4">Controls Desktop: Move using WASD or Arrow Keys. Use space bar to speed up blocks.</p>
      <p class="my-4">Controls Mobile: Touch anywhere on the screen to move. Use buttons to pause and speed up.</p>
      <b-btn class="mt-3" variant="outline-success" block @click="hideStartGamePlay">Start Game</b-btn>
      <b-btn class="mt-3" variant="outline-danger" block @click="hideStartGameExit">Exit Game</b-btn>
    </b-modal>

    <b-modal 
      ref="pauseGame" 
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      :hide-header-close="true"
      hide-footer
      centered
      title="Game Paused"
    >
      <p>The game is paused</p>
      <b-btn class="mt-3" variant="outline-success" block @click="hidePauseGamePlay">Continue Game</b-btn>
      <b-btn class="mt-3" variant="outline-danger" block @click="hidePauseGameExit">Exit Game</b-btn>
    </b-modal>

    <b-modal 
      ref="gameOver"
       :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      :hide-header-close="true"
      hide-footer 
      centered 
      title="Game-Over"
    >
      <p class="my-4">Score = Coins: {{this.coins}} X 100 + Distance: {{this.distance}} = {{this.coins*100 + this.distance}}
      <p class="my-4">Try Again?</p>
      <b-btn class="mt-3" variant="outline-success" block @click="hideGameOverPlay">Try Again</b-btn>
      <b-btn class="mt-3" variant="outline-danger" block @click="hideGameOverExit">Exit</b-btn>
    </b-modal>
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
      health: 3,
      coins: 0,
      distance: 0
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

      let speedButton = document.querySelector('#speed-button');
      speedButton.style.top = this.getWindowHeight() - 50 + 'px';

      let pauseButton = document.querySelector('#pause-button');
      pauseButton.style.top = this.getWindowHeight() - 50 + 'px';
      pauseButton.style.left = this.getWindowWidth() - pauseButton.offsetLeft*7 + 'px';

      speedButton.addEventListener('mousedown', this.speedUpGame, false);
      speedButton.addEventListener('mouseup', this.slowDownGame, false);
      speedButton.addEventListener('touchstart', this.speedUpGame, false);
      speedButton.addEventListener('touchend', this.slowDownGame, false);

      // Start Animating
      this.animate();
      // Pause the Game
      this.pauseGame();
      // Display Start Screen
      this.showStartGame();
    });
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.onWindowResizeGame, false);
    window.removeEventListener('obstacle-collided', this.handleObstacleCollision, false);
    window.removeEventListener('coin-collided', this.handleObstacleCollision, false);
    window.removeEventListener('distance-update', this.handleUpdateDistance, false);
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
    // ---------------------------------------------------> Threejs Commands
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
    // ---------------------------------------------------> Game Commands
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
      this.game.reset(this.scene);
      this.health = 3;
      this.coins = 0;
      this.distance = 0;
      this.pauseGame();
    },
    handleObstacleCollision: function() {
      let health = this.game.decreaseHealth();
      this.health = health;
      if(health < 0){
        this.showGameOver();
      }
    },
    handleCoinCollision: function() {
      let coins = this.game.increaseCoins();
      this.coins = coins;
    },
    handleUpdateDistance: function() {
      let distance = this.game.getDistance();
      this.distance = distance;
    },
    handleGameOver: function() {
      this.showGameOver();
    },
    // ---------------------------------------------------> Modal Commands
    showStartGame: function() {
      this.$refs.startGame.show();
    },
    hideStartGamePlay: function() {
      this.$refs.startGame.hide();
      this.pauseGame();
    },
    hideStartGameExit: function() {
      this.$refs.startGame.hide();
      this.pauseGame();
      this.$router.push('/');
    },
    showPauseGame: function() {
      this.$refs.pauseGame.show();
      this.pauseGame();
    },
    hidePauseGamePlay: function() {
      this.$refs.pauseGame.hide();
      this.pauseGame();
    },
    hidePauseGameExit: function() {
      this.$refs.pauseGame.hide();
      this.pauseGame();
      this.$router.push('/');
    },
    showGameOver: function() {
      this.$refs.gameOver.show();
      this.pauseGame();
    },
    hideGameOverPlay: function() {
      this.resetGame()
      this.$refs.gameOver.hide();
    },
    hideGameOverExit: function() {
      this.$refs.gameOver.hide();
      this.$router.push('/');
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
    top: 100px;
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

  .z-fixed {
    position: fixed;
    z-index: 2;
    top: 100px;
    left:100px;
  }
</style>