import * as THREE from 'three';
import './style.css';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// **camera and renderer always need to be updated together

// Scene
const scene = new THREE.Scene();

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
// const moonTexture2 = new THREE.TextureLoader().load('texture.jpg');

const geometry = new THREE.SphereGeometry(3, 64, 64);
// const material = new THREE.MeshStandardMaterial({
//   color: '#00ddff',
//   roughness: 0.4,
// });
// const material = new THREE.MeshStandardMaterial({
//   map: moonTexture,
// });

// Moon
const material = new THREE.MeshStandardMaterial({
  map: moonTexture,
  // normalMap: moonTexture2,
});

// mesh = moon
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes -> size of viewport
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
// set x,y,z position
light.position.set(0, 10, 10);
light.intensity = 300;

scene.add(light);

// PerspectiveCamera 1st parameter -> field of view. if it's wider than 50, it becomes like fisheye camera (a lot of distortion)
// last two param -> set min/max perspective (if z is 101, it disappears)
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.1,
  100
);
// depth (the bigger the further)
camera.position.z = 20;
scene.add(camera);

// finally, render the scene on the canvas

// Renderer
const canvas = document.querySelector('.webgl'); //webgl is the one on the html file
const renderer = new THREE.WebGLRenderer({ canvas });
// define how big the canvas is going to be and where to render
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(3);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 3.5;

// Resize (whenever window resizes)
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update camera

  // not to distort object
  camera.updateProjectionMatrix();
  camera.aspect = sizes.width / sizes.height;

  renderer.setSize(sizes.width, sizes.height);
});

// to re-render the canvas -> to make the object stay at its original ratio
const loop = () => {
  // the options to move mesh, light and so on

  // light.rotation.x += 0.6;
  // mesh.position.x += 0.1;

  // controls.update make object keeps animating
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// Timeline magic!
const tl = gsap.timeline({ defaults: { duration: 1 } });
// from zxy 0 to zxy 1
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo('nav', { y: '-100%' }, { y: '0%' });
tl.fromTo('.title', { opacity: 0 }, { opacity: 1 });

// Mouse animation color
let mouseDown = false;
let rgb = [12, 23, 55];
window.addEventListener('mousedown', () => (mouseDown = true));
window.addEventListener('mouseup', () => (mouseDown = false));

window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];
    // Let's animate
    let newColor = new THREE.Color(`rgb(${rgb.join(',')})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});

// add star
function addStar() {
  const geometry = new THREE.SphereGeometry(0.08, 10, 10);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);
