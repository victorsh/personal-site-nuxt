import * as Three from 'three'

export function test() {
  console.log('called from test');
}

export function initObjects(scene) {
  let light = new Three.DirectionalLight(0xFFFFFF);
  light.name = 'dir-light-1';
  scene.add(light);

  // let geometry = new Three.BoxGeometry(2, 2, 2);
  let geometry = new Three.OctahedronBufferGeometry(2, 0);
  let material = new Three.MeshPhongMaterial({color: '#00d0ff'});
  let mesh = new Three.Mesh(geometry, material);
  mesh.name = 'octahedron';
  scene.add(mesh);
}