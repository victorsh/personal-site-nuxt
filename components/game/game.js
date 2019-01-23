import * as THREE from 'three';

function Game() {
  this.pause = false;

  this.boardHeight = 14;
  this.boardWidth = 8;
  
  this.health = 3;
  this.coinsCollected = 0;
  
  this.disabledCoins = [];
  this.enabledCoins = [];
  this.disabledObstacles = [];
  this.enabledObstacles = []
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
    new THREE.MeshLambertMaterial({color: 0x42F4E2, side: THREE.DoubleSide})
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
    new THREE.MeshLambertMaterial({color: 0x4C2300, side: THREE.DoubleSide})
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
  let coinGeom = new THREE.CylinderGeometry(0.20, 0.20, 0.1, 20, 32);
  let coinMat = new THREE.MeshPhongMaterial({color: 0xFFF20C});
  let boxGeom = new THREE.BoxGeometry(0.85, 0.85, 0.85);
  let boxMat = new THREE.MeshPhongMaterial({color: 0x27AD35});

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
    obstacle.position.y = -0.7;
    obstacle.position.z = -8;
    scene.add(obstacle);
  }
}

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

Game.prototype.loop = function(scene, delta) {
  for(let i = 0; i<this.boardWidth*this.boardHeight; i++){
    let coin = scene.getObjectByName('coin-'+i);
    let obstacle = scene.getObjectByName('obstacle-'+i);
    coin.rotation.x += 0.1;
    obstacle.rotation.y += 0.1;
  }
}

Game.prototype.objectLogic = function(scene, delta) {
  
  let obstacleName = this.disabledObstacles.pop();
  let obstacle = scene.getObjectByName(obstacleName);
  this.enabledObstacles.push(obstacleName);

  let coinName = this.disabledCoins.pop();
  let coin = scene.getObjectByName(coinName);
  this.enabledCoins.push(coinName);
}

function logger(e){
  console.log(e);
}



export default Game;