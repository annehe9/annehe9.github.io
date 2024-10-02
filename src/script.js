import * as THREE from 'three'
import { randFloat } from 'three/src/math/MathUtils.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DeviceOrientationControls } from './deviceOrientationControls';
import gsap from 'gsap'
import GUI from 'lil-gui'
import { VRButton } from 'three/addons/webxr/VRButton.js';

// Debugging GUI
const gui = new GUI({
    width: 300,
    title: 'Settings',
    closeFolders: true
})
gui.close();
//gui.hide();

// Setup
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const scene = new THREE.Scene();
const canvas = document.querySelector('canvas.webgl');

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height); //add camera with fov and aspect ratio
camera.position.z = 3;
scene.add(camera);

// Render
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// AxesHelper
const axesHelper = new THREE.AxesHelper(10);
axesHelper.position.z = -5
scene.add(axesHelper);

/*
// WebXR
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));
*/

// Create meshes
const meshes = new THREE.Group();
const box1 = new THREE.BoxGeometry(1,1,1);
const box2 = new THREE.BoxGeometry(1,2,1);
const mat = new THREE.MeshBasicMaterial({color: 0xff0000});
const mesh = new THREE.Mesh(box1, mat);
const mesh2 = new THREE.Mesh(box2, mat);
mesh.position.set(2,2,-5)
mesh2.position.set(-1,0.5,-3);
meshes.add(mesh);
meshes.add(mesh2);
// Add to scene
scene.add(meshes);

gui
    .add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('mesh y');

// gui can only add properties so make object that stores the vars
const storageVars = {
    timestep: 0.1
}
gui.add(storageVars, 'timestep', 0, 1, 0.1);
gui.addColor(mat, 'color');

const debugObject = {};
debugObject.spin = () =>
{
    gsap.to(mesh2.rotation, { duration: 1, y: mesh2.rotation.y + Math.PI * 2 })
}
gui.add(debugObject, 'spin');
const testFolder = gui.addFolder('Testing');
testFolder.add(mesh, 'visible');
//testFolder.close();

// Animation
const clock = new THREE.Clock();
/*
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    mesh.position.y = Math.cos(elapsedTime);
    mesh.position.x = Math.sin(elapsedTime);
    //camera.lookAt(meshes.position);
    renderer.render(scene,camera);
    window.requestAnimationFrame(tick)
}
tick();
*/


//const controls = new OrbitControls(camera, canvas);
const controls = new DeviceOrientationControls(camera);

renderer.setAnimationLoop( animate );
function animate() {
    //mesh.setRotationFromAxisAngle(Vector3(0,1,0))
    var delt = clock.getDelta();
    mesh.rotation.x += 1*delt;
    mesh2.rotation.x += 5*delt;
    //meshes.rotation.y = 1*clock.getElapsedTime();

    //camera.position.x = cursor.x*5;
    //camera.position.y = cursor.y*5;
    /*
    camera.position.z = 3;
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 10
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 10
    camera.position.y = cursor.y * 10
    */
    //camera.lookAt(mesh.position);
    controls.update();
	renderer.render( scene, camera );
}

// Cursor
const cursor = {
    x:0,
    y:0
}
window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX/ sizes.width - 0.5
    cursor.y = -e.clientY / sizes.height + 0.5
})

// Resize
window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

// Fullscreen
window.addEventListener('dblclick', () =>
{
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
})

// Device Orientation
/*
window.addEventListener("deviceorientation", handleOrientation, true);
function handleOrientation(event) {
    const absolute = event.absolute;
    const alpha = event.alpha*Math.PI/180.0;
    const beta = event.beta*Math.PI/180.0;
    const gamma = event.gamma*Math.PI/180.0;
  
    camera.setRotationFromAxisAngle((0,0,1), gamma);
    camera.setRotationFromAxisAngle((0,1,0), beta);
    camera.updateProjectionMatrix();
    controls.update();

    console.log(beta);
    console.log(gamma);
    console.log(camera.rotation);
  }
*/