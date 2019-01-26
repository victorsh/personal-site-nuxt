import * as THREE from 'three';

function Game() {
  this.pause = false;
  this.timeDiff = 0;
  this.speed = 2;
  this.genInterval = 2;

  this.boardHeight = 14;
  this.boardWidth = 8;
  
  this.health = 3;
  this.coinsCollected = 0;
  
  this.disabledCoins = [];
  this.enabledCoins = [];
  this.disabledObstacles = [];
  this.enabledObstacles = [];
}

Game.prototype.initObjects = function(scene) {
  // Init Player
  let player = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.25, 0.25), 
    new THREE.MeshLambertMaterial( {color: 0xFF0000})
  );
  player.position.x = 1;
  player.position.y = -0.60;
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
  let coinMat = new THREE.MeshPhongMaterial({color: 0xFFF20C, opacity: 0.5, transparent: true});
  let boxGeom = new THREE.BoxGeometry(0.85, 0.10, 0.85);
  let boxMat = new THREE.MeshPhongMaterial({color: 0x27AD35, opacity: 0.7, transparent: true});

  for(let i = 0; i<this.boardWidth*this.boardHeight; i++){
    let coin = new THREE.Mesh(coinGeom, coinMat);
    coin.name = 'coin-'+i;
    this.disabledCoins.push(coin.name);
    coin.position.x = 5;
    coin.position.y = 0.5;
    coin.position.z = -10;
    scene.add(coin);

    let obstacle = new THREE.Mesh(boxGeom, boxMat);
    obstacle.name = 'obstacle-'+i;
    this.disabledObstacles.push(obstacle.name);
    obstacle.position.x = 1;
    obstacle.position.y = -0.1;
    obstacle.position.z = -8;
    scene.add(obstacle);
  }
}

// Create event listeners
// Make sure to modify this to create event listeners based
// on whether or not the user is on mobile or desktop
Game.prototype.initInteractions = function(){
  window.addEventListener('keydown', logger, false);
  window.addEventListener('keyup', logger, false);
  // window.removeEventListener('mouseup', printEvents, false);
  // window.removeEventListener('mousedown', printEvents, false);
  // window.removeEventListener('mousemove', printEvents, false);

  // window.removeEventListener('touchstart', printEvents, false);
  // window.removeEventListener('touchend', printEvents, false);
  // window.removeEventListener('touchcancel', printEvents, false);
  // window.removeEventListener('touchmove', printEvents, false);
}

// Remove event listeners before switching pages
Game.prototype.removeInteractions = function(){
  window.removeEventListener('keydown', logger, false);
  window.removeEventListener('keyup', logger, false);
  // window.addEventListener('mousedown', printEvents, false);
  // window.addEventListener('mouseup', printEvents, false);
  // window.addEventListener('mousemove', printEvents, false);

  // window.addEventListener('touchstart', printEvents, false);
  // window.addEventListener('touchend', printEvents, false);
  // window.addEventListener('touchcancel', printEvents, false);
  // window.addEventListener('touchmove', printEvents, false);
}

// Main game loop, passed in through animate function on
// game component
Game.prototype.loop = function(scene, delta) {
  // Run game logic based on time interval
  this.timeDiff += delta;
  if(this.timeDiff > this.genInterval) {
    this.objectLogic(scene, delta);
    this.timeDiff = 0;
  }

  // Handle Animation and Collision
  for(let i = 0; i<this.enabledObstacles.length; i++){
    
    if(typeof this.enabledCoins[i] !== 'undefined'){
      let coin = scene.getObjectByName(this.enabledCoins[i]);
      coin.position.z += this.speed * delta;
      if (coin.position.z > 1){
        coin.position.z = -15;
        this.disableCoin(scene);
      }
    }
    
    let obstacle = scene.getObjectByName(this.enabledObstacles[i]);
    obstacle.position.z += this.speed * delta;
    if(obstacle.position.z > 1) {
      obstacle.position.z = -15;
      this.disabledObstacle(scene);
    }
  }
}

Game.prototype.objectLogic = function(scene, delta) {
  
  for(let i = 0; i<this.boardWidth; i++){
    let choice = Math.floor(Math.random() * 3);
    console.log(choice)
    switch(choice) {
      case 0:
        // create block
      break;
      case 1:
        // create coin
      break;
      case 2:

      break;
      default:
        //
    }
  }

  this.enableObstacle(scene);
  this.enableCoin(scene);
}

Game.prototype.enableObstacle = function(scene) {
  if(this.disabledObstacles.length !== 0){
    let obstacleName = this.disabledObstacles.pop();
    let obstacle = scene.getObjectByName(obstacleName);
    this.enabledObstacles.push(obstacleName);
  }
}

Game.prototype.disabledObstacle = function(scene) {
  if(this.enabledObstacles.length !== 0){
    let obstacleName = this.enabledObstacles.pop();
    let obstacle = scene.getObjectByName(obstacleName);
    this.disabledObstacles.push(obstacleName);
  }
}

Game.prototype.enableCoin = function(scene) {
  if(this.disabledCoins.length !== 0){
    let coinName = this.disabledCoins.pop();
    let coin = scene.getObjectByName(coinName);
    this.enabledCoins.push(coinName);
  }
}

Game.prototype.disableCoin = function(scene) {
  if(this.enabledCoins.length !== 0){
    let coinName = this.enabledCoins.pop();
    let coin = scene.getObjectByName(coinName);
    this.disabledCoins.push(coinName);
  }
}

function logger(e){
  console.log(e);
}

function checkCollision(object1, object2){
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