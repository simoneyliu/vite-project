import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene == container
const scene = new THREE.Scene();

/**
 * First argument = Field of View; amount that is visible based on a full 360 degrees
 * Second argument = aspect ratio; Calculating the user's browser window
 * Last 2 arguments = View Frustum; Controls what objects are visible relative to the camera itself
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  // Rendering the canvas background
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
// Setting full screen canvas
renderer.setSize(window.innerWidth, window.innerHeight);

// Move camera position to Z axis
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

/**
 * Creating the geometric objects
 * Material = wrapping paper for an object
 * Mesh = Geometry + material
 */
const geometry = new THREE.TorusGeometry(10, 1, 8, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

//Lighting up the Torus
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

// LightHelper Shows the position and direction of light source
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// Listens to dom elements from the mouse and updates the camera accordingly
// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  // Randomly placing the stars by means of randFloatSpread function
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(300).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('images/space.jpg');
scene.background = spaceTexture;

// Avatar
const katelynTexture = new THREE.TextureLoader().load('images/meblue.jpg');
const katelyn = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: katelynTexture }));

scene.add(katelyn);

// Moon
const moonTexture = new THREE.TextureLoader().load('images/moon.jpg');

// A normal map provides depth
const normalTexture = new THREE.TextureLoader().load('images/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
scene.add(moon);

// Both .z and .setX do the same thing
moon.position.z = 30;
moon.position.setX(10);
katelyn.position.z = -5;
katelyn.position.x = 2;

// Scroll animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  katelyn.rotation.y += 0.01;
  katelyn.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Recursive function to continuously render
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  //controls.update();

  renderer.render(scene, camera);
}

animate();
