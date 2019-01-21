import * as Three from 'three';

var player, floorBase, floorPlay;
var clock;
var delta = 0;

var frames = 0;
var pause = false;

var obstacles = [];
var coins = [];
var boardWidth = 8;
var boardHeight = 14;
var health = 3;
var coinsCollected = 0;
var stats;

export function initObjects(scene) {
  // Init Player
  player = new Three.Mesh(
    new Three.BoxGeometry(0.25, 0.25, 0.25), 
    new Three.MeshLambertMaterial( {color: 0xFF0000})
  );
  player.position.x = 1;
  player.position.y = -0.60;
  player.geometry.computeBoundingBox();
  player.name = 'player';
  scene.add( player );

  // Init Main Floor
  floorBase = new Three.Mesh(
    new Three.BoxGeometry(boardWidth, boardHeight - 2.1, 1), 
    new Three.MeshLambertMaterial({color: 0x42F4E2, side: Three.DoubleSide})
  );
  floorBase.rotation.x = Math.PI/2;
  floorBase.position.z = -boardHeight/2 + 0.5 - 1.5;
  floorBase.position.x = -0.5;
  floorBase.position.y = -1.01;
  floorBase.name = 'floor-base';
  scene.add(floorBase);

  // Init Play Floor
  floorPlay = new Three.Mesh(
    new Three.BoxGeometry(boardWidth, 2.5, 1), 
    new Three.MeshLambertMaterial({color: 0x4C2300, side: Three.DoubleSide})
  );
  floorPlay.rotation.x = Math.PI/2;
  floorPlay.position.z = -1.0;
  floorPlay.position.x = -0.5;
  floorPlay.position.y = -1;
  floorPlay.name = 'floor-play';
  scene.add(floorPlay);

  // Init Light
  let ambiLight = new Three.AmbientLight(0x404040);
  ambiLight.name = 'ambi-light'
  scene.add(ambiLight);

  let dirLight = new Three.DirectionalLight(0xffffff, 0.7);
  dirLight.name = 'dir-light';
  scene.add(dirLight);
}