import { OrthographicCamera, Scene, WebGLRenderer, ACESFilmicToneMapping } from 'three';
import { createLighting, createSculpture } from './scene';

const scene = new Scene();
const sculpture = createSculpture();
scene.add(sculpture.group, createLighting());
const camera = new OrthographicCamera(-2.7, 2.7, 2.1, -2.1, 0.1, 20);
camera.position.z = 7;
const renderer = new WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true, });
renderer.setSize(1080, 840);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);
document.body.dataset.ready = 'true';
