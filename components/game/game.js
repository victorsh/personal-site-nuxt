/* Notes 
 * {Issues}
 * - Noticing slight jitter on gameplay, does not seem to effect FPS counter
 * 
 * {TODO}
 * - Change move speed to class variable instead of inside function
 * - Create Game Reset
 * - Connect to UI
 * 
 * {Events}
 * - obstacle-collided
 * - coin-collided
 * - game-over
 */

import * as THREE from 'three';

function Game() {
  this.timeDiff = 0;
  this.pause = false;
  this.speed = 1;
  this.holdSpeed = 3;
  this.playerSpeed = 4;
  this.genInterval = 2;
  this.totalDistance = 0;

  this.boardHeight = 12;
  this.boardWidth = 8;
  
  this.health = 3;
  this.coinsCollected = 0;
  
  this.disabledCoins = new Set();
  this.enabledCoins = new Set();
  this.disabledObstacles = new Set();
  this.enabledObstacles = new Set();

  this.leftOn = false;
  this.rightOn = false;
  this.upOn = false;
  this.downOn = false;
  this.touchOn = true;
  this.ongoingTouches;

  this.touchS = new THREE.Vector2();
  this.touchM = new THREE.Vector2();

  this.obstacleCollision = new Event('obstacle-collided');
  this.coinCollision = new Event('coin-collided');
  this.distanceUpdate = new Event('distance-update');
  this.gameOver = new Event('game-over');
}

Game.prototype.resetGame = function() {

}

Game.prototype.initObjects = function(scene) {
  
  // Init Player
  let player = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.25, 0.25), 
    new THREE.MeshLambertMaterial( {color: 0xFF0000})
  );
  player.position.x = 1;
  player.position.y = -0.1;
  player.geometry.computeBoundingBox();
  player.name = 'player';
  scene.add( player );

  // Init Main Floor
  let floorBase = new THREE.Mesh(
    new THREE.BoxGeometry(this.boardWidth, this.boardHeight - 2.1, 1), 
    new THREE.MeshLambertMaterial({color: 0x545a5b, side: THREE.DoubleSide})
  );
  floorBase.rotation.x = Math.PI/2;
  floorBase.position.z = -this.boardHeight/2 + 0.5 - 1.5;
  floorBase.position.x = -0.5;
  floorBase.position.y = -1.01;
  floorBase.name = 'floor-base';
  scene.add(floorBase);

  // Init Play Floor
  let floorPlay = new THREE.Mesh(
    new THREE.BoxGeometry(this.boardWidth, 2.5, 1), 
    new THREE.MeshLambertMaterial({color: 0xa3c2c6, side: THREE.DoubleSide})
  );
  floorPlay.rotation.x = Math.PI/2;
  floorPlay.position.z = -1.0;
  floorPlay.position.x = -0.5;
  floorPlay.position.y = -1;
  floorPlay.name = 'floor-play';
  scene.add(floorPlay);

  // Init Light
  let ambiLight = new THREE.AmbientLight(0x404040);
  ambiLight.name = 'ambi-light'
  scene.add(ambiLight);

  let dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.name = 'dir-light';
  scene.add(dirLight);

  // Initialize Coins and Obstacles
  let coinGeom = new THREE.CylinderGeometry(0.20, 0.20, 0.05, 20, 32);
  let coinMat = new THREE.MeshPhongMaterial({color: 0xFFF20C, opacity: 1.0, transparent: true});
  let boxGeom = new THREE.BoxGeometry(0.85, 0.10, 0.85);
  let boxMat = new THREE.MeshPhongMaterial({color: 0x27AD35, opacity: 1.0, transparent: true});

  for(let i = 0; i<this.boardWidth*this.boardHeight/2; i++){
    let coin = new THREE.Mesh(coinGeom, coinMat);
    coin.name = 'coin-'+i;
    this.disabledCoins.add(coin.name);
    coin.position.x = -3;
    coin.position.y = -0.01;
    coin.position.z = -16;
    scene.add(coin);

    let obstacle = new THREE.Mesh(boxGeom, boxMat);
    obstacle.name = 'obstacle-'+i;
    this.disabledObstacles.add(obstacle.name);
    obstacle.position.x = -4;
    obstacle.position.y = -0.01;
    obstacle.position.z = -16;
    scene.add(obstacle);
  }
}

// Create event listeners
// Make sure to modify this to create event listeners based
// on whether or not the user is on mobile or desktop
Game.prototype.initInteractions = function(){
  window.addEventListener('keydown', this.handleKeyDown.bind(this), false);
  window.addEventListener('keyup', this.handleKeyUp.bind(this), false);

  // window.addEventListener('mousedown', printEvents, false);
  // window.addEventListener('mouseup', printEvents, false);
  // window.addEventListener('mousemove', printEvents, false);

  window.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
  window.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
  window.addEventListener('touchcancel', this.handleTouchCancel.bind(this), false);
  window.addEventListener('touchmove', this.handleTouchMove.bind(this), {passive: false});
}

// Remove event listeners before switching pages
Game.prototype.removeInteractions = function(){
  window.removeEventListener('keydown', this.handleKeyDown.bind(this), false);
  window.removeEventListener('keyup', this.handleKeyUp.bind(this), false);

  // window.removeEventListener('mouseup', printEvents, false);
  // window.removeEventListener('mousedown', () => { console.log('mousedown')}, false);
  // window.removeEventListener('mousemove', printEvents, false);

  window.removeEventListener('touchstart', this.handleTouchStart.bind(this), false);
  window.removeEventListener('touchend', this.handleTouchEnd.bind(this), false);
  window.removeEventListener('touchcancel', this.handleTouchCancel.bind(this), false);
  window.removeEventListener('touchmove', this.handleTouchMove.bind(this), {passive: false});
}

// Main game loop, passed in through animate function on
// game component
Game.prototype.loop = function(scene, delta) {
  if(!this.pause){

    this.handleMovement(scene, delta);
    this.touchControls(scene, delta);

    // Run game logic based on time interval
    this.timeDiff += this.speed * delta;
    if(this.timeDiff > this.genInterval) {
      this.totalDistance++;
      window.dispatchEvent(this.distanceUpdate); // <-- Dispatch Event
      this.addRow(scene); // <-- Add new objects
      this.timeDiff = 0;
    }

    let player = scene.getObjectByName('player');
    for(let value of this.enabledObstacles){
      let obstacle = scene.getObjectByName(value);
      obstacle.position.z += this.speed * delta;

      if(obstacle.position.z > 1){
        obstacle.position.z = -16;
        this.enabledObstacles.delete(value); // <-- Remove Obstacle
        this.disabledObstacles.add(value);
      } else {
        let collided = this.checkCollision(obstacle, player);
        if(collided) {
          window.dispatchEvent(this.obstacleCollision); // <-- Dispatch Event
          obstacle.position.z = -16;
          this.enabledObstacles.delete(value); // <-- Remove Obstacle
          this.disabledObstacles.add(value);
        }
      }
    }

    for(let value of this.enabledCoins){
      let coin = scene.getObjectByName(value);
      coin.position.z += this.speed * delta;

      if(coin.position.z > 1){
        coin.position.z = -16;
        this.enabledCoins.delete(value); // <-- Remove Obstacle
        this.disabledCoins.add(value);
      } else {
        let collided = this.checkCollision(coin, player);
        if(collided){
          window.dispatchEvent(this.coinCollision); // <-- Dispatch Event
          coin.position.z = -16;
          this.enabledCoins.delete(value); // <-- Remove Obstacle
          this.disabledCoins.add(value);
        }
      }
    }

  }
}

// Adds new row to game scene by randomly selecting Obstacles/Coins/Empty
Game.prototype.addRow = function(scene) {

  // Add next row to game scene
  let obstacleCount = 0;
  for(let i = 0; i<this.boardWidth; i++){
    let choice = Math.random();
    let difficulty = 0.70

    if(choice > 0 && choice < difficulty && obstacleCount !== 7){
      let objArr = Array.from(this.disabledObstacles);
      this.disabledObstacles.delete(objArr[0]);
      this.enabledObstacles.add(objArr[0]);

      let obstacle = scene.getObjectByName(objArr[0]);
      obstacle.position.x = -4 + i;
      obstacle.position.z = -this.boardHeight;
      obstacleCount++;
    } else if (choice >= difficulty && choice < 0.95 || obstacleCount === 7){
      // do nothing
    } else {
      let coinArr = Array.from(this.disabledCoins);
      this.disabledCoins.delete(coinArr[0]);
      this.enabledCoins.add(coinArr[0]);

      let coin = scene.getObjectByName(coinArr[0]);
      coin.position.x = -4 + i;
      coin.position.z = -this.boardHeight;
    }
  }
}

// UI Binding
Game.prototype.decreaseHealth = function() {
  this.health--;
  return this.health;
}

// UI Binding
Game.prototype.increaseCoins = function() {
  this.coinsCollected++;
  return this.coinsCollected;
}

Game.prototype.getHealth = function() {
  return this.health;
}

Game.prototype.getCoins = function() {
  return this.coinsCollected;
}

Game.prototype.getDistance = function() {
  return this.totalDistance;
}

Game.prototype.pauseGame = function() {
  this.pause = !this.pause;
}

Game.prototype.speedUpGame = function() {
  this.speed = this.holdSpeed;
}

Game.prototype.slowDownGame = function() {
  this.speed = this.speed - 2;
}

/***************************** Interactions *******************************/
Game.prototype.handleKeyDown = function(e) {
  if(e.keyCode === 65 || e.keyCode == 37) {
      // console.log('down: a');
    this.leftOn = true;
  } else if (e.keyCode === 68 || e.keyCode === 39) {
      // console.log('down: d');
    this.rightOn = true;
  } else if(e.keyCode === 87 || e.keyCode === 38) {
      // console.log('down: w');
    this.upOn = true;
  } else if(e.keyCode === 83 || e.keyCode === 40) {
      // console.log('down: s');
    this.downOn = true;
  } else if(e.keyCode === 32) { // space speed up
    this.speed = this.holdSpeed;
  }
  // console.log(this.leftOn, this.rightOn, this.upOn, this.downOn);
}

// Handle Keyboard inputs
Game.prototype.handleKeyUp = function(e){
  if(e.keyCode === 65 || e.keyCode == 37){
      // console.log('up: a');
      this.leftOn = false;
  }else if(e.keyCode === 68 || e.keyCode == 39){
      // console.log('up: d');
      this.rightOn = false;
  }else if(e.keyCode === 87 || e.keyCode == 38){
      // console.log('up: w');
      this.upOn = false;
  }else if(e.keyCode === 83 || e.keyCode == 40){
      // console.log('up: s');
      this.downOn = false;
  }else if(e.keyCode === 80){ //p pause
    this.pause = !this.pause;
  } else if(e.keyCode === 32){ // speed
    this.speed = this.speed - 2;
  }

  // console.log(this.leftOn, this.rightOn, this.upOn, this.downOn);
}

Game.prototype.handleMovement = function(scene, delta) {
  let player = scene.getObjectByName('player');
  
  if(this.leftOn || this.rightOn || this.upOn || this.downOn){
    if(this.leftOn){
      if(player.position.x > -this.boardWidth/2 - 0.3){
        player.position.x -= this.playerSpeed * delta;
      } else {
        player.position.x = -this.boardWidth/2 - 0.3;
      }
    }
    if(this.rightOn){
      if(player.position.x < this.boardWidth/2 - 0.7){
        player.position.x += this.playerSpeed * delta;
      } else {
        player.position.x = this.boardWidth/2 - 0.7;
      }
    }
    if(this.upOn){
      if(player.position.z > -2.3){
        player.position.z -= this.playerSpeed * delta;
      } else {
        player.position.z = -2.3;
      }
    }
    if(this.downOn){
      if(player.position.z < 0){
        player.position.z += this.playerSpeed * delta;
      } else {
        player.position.z = 0;
      }
    }
  }
}

// //////////////////////////////////////////////// Touch Events
Game.prototype.handleTouchStart = function(e){
  // if(!pause) e.preventDefault();
  // console.log('touchStart');
  let touches = e.changedTouches;
  for(let i = 0; i<touches.length; i++){
      // console.log(touches[i]);
  }
  this.touchS.x = touches[0].clientX;
  this.touchS.y = touches[0].clientY;
  this.touchM.x = touches[0].clientX;
  this.touchM.y = touches[0].clientY;
  this.touchOn = true;
}

Game.prototype.handleTouchEnd = function(e){
  // if(!this.pause) e.preventDefault();
  // console.log('touchEnd');
  let touches = e.changedTouches;
  for(let i = 0; i<touches.length; i++){
      // console.log(touches[i]);
  }
  this.leftOn = this.rightOn = this.upOn = this.downOn = false;
  this.touchOn = false;
}

Game.prototype.handleTouchCancel = function(e){
  // if(!this.pause) e.preventDefault();
  // console.log('touchCancel');
  let touches = e.changedTouches;
  for(let i = 0; i<touches.length; i++){
      console.log(touches[i]);
      let idx = this.ongoingTouchIndexById(touches[i].identifier);
      this.ongoingTouches.splice(idx, 1);
  }
}

// Helper function for handleTouchCancel
Game.prototype.ongoingTouchIndexById = function(idToFind) {
  for (let i = 0; i < this.ongoingTouches.length; i++) {
    let id = this.ongoingTouches[i].identifier;
    
    if (id == idToFind) {
      return i;
    }

  }
  return -1;    // not found
}

Game.prototype.handleTouchMove = function(e){
  // if(!this.pause) e.preventDefault();
  // console.log('touchMove');
  let touches = e.changedTouches;
  for(let i = 0; i<touches.length; i++){
      // console.log(touches[i]);
  }
  let tx = touches[0].clientX;
  let ty = touches[0].clientY;
  this.touchM.x = touches[0].clientX;
  this.touchM.y = touches[0].clientY;
  let angle = Math.atan2(ty - this.touchS.y, tx - this.touchS.x);
  // console.log(angle);
}

Game.prototype.touchControls = function(scene, delta) {
  if(this.touchOn){
    let angle = Math.atan2(this.touchM.y - this.touchS.y, this.touchM.x - this.touchS.x);
    let distance = Math.sqrt(Math.pow((this.touchM.y - this.touchS.y), 2) + Math.pow((this.touchM.x - this.touchS.x), 2));
    let player = scene.getObjectByName('player');
    
    if(distance > 0){
      if (player.position.x < -this.boardWidth/2) {
        player.position.x = -this.boardWidth/2;
      } else if(player.position.x > this.boardWidth/2 - 1) {
        player.position.x = this.boardWidth/2 - 1;
      } else {
        player.position.x += Math.cos(angle) * delta * this.playerSpeed;
      }
      
      if (player.position.z < -2.3) {
        player.position.z = -2.3;
      } else if(player.position.z > 0) {
        player.position.z = 0;
      } else {
        player.position.z += Math.sin(angle) * delta * this.playerSpeed;
      }
    }
  }
}

/**************** Utility Functions ******************************/

Game.prototype.checkCollision = function(object1, object2){
  // Calculate min and max of both objects
  let obDim, obxmin, obxmax, obzmin, obzmax, obymin, obymax;
  object1.geometry.computeBoundingBox();
  obDim = object1.geometry.boundingBox;
  obxmin = object1.position.x - obDim.max.x;
  obxmax = object1.position.x + obDim.max.x;
  obzmin = object1.position.z - obDim.max.z;
  obzmax = object1.position.z + obDim.max.z;
  obymin = object1.position.y - obDim.max.y;
  obymax = object1.position.y + obDim.max.y;

  let playerDim, cbxmin, cbxmax, cbzmin, cbzmax, cbymin, cbymax;
  object2.geometry.computeBoundingBox();
  playerDim = object2.geometry.boundingBox;
  cbxmin = object2.position.x - playerDim.max.x;
  cbxmax = object2.position.x + playerDim.max.x;
  cbzmin = object2.position.z - playerDim.max.z;
  cbzmax = object2.position.z + playerDim.max.z;
  cbymin = object2.position.y - playerDim.max.y;
  cbymax = object2.position.y + playerDim.max.y;
  
  // Collision Logic
  if((obxmin <= cbxmax && obxmax >= cbxmin)&&
      (obzmin <= cbzmax && obzmax >= cbzmin)&&
      (obymin <= cbymax && obymax >= cbymin)){
      return true;
  } else {
      return false;
  }
}

export default Game;