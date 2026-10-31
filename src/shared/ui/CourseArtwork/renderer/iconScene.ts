import {
  ACESFilmicToneMapping, AmbientLight, DirectionalLight, EdgesGeometry, ExtrudeGeometry, Group,
  LineBasicMaterial, LineSegments, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene,
  WebGLRenderer, type WebGLRendererParameters
} from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { COURSE_ICONS } from '../courseIcons';

// Three-quarter view shows the extrusion. Posters use this pose; live icons start in it.
export const REST_POSE = { pitch: -0.16, yaw: -0.5, };

// Same ceramic finish as the homepage sculpture.
const material = new MeshStandardMaterial({ color: 0xe4e3df, roughness: 0.48, metalness: 0.12, });
const edgeMaterial = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16, });
const loader = new SVGLoader();

// A 24x24 icon path extruded into a solid about 2.4 units across, centred on the origin.
export function createIcon (id: number) {
  const shapes = loader.parse(`<svg><path d="${COURSE_ICONS[id % COURSE_ICONS.length]}"/></svg>`)
    .paths.flatMap(path => SVGLoader.createShapes(path));
  // The negative offset keeps the outline: fine gaps in logos stay open.
  const geometry = new ExtrudeGeometry(shapes, {
    depth: 2.6,
    curveSegments: 16,
    bevelThickness: 0.3,
    bevelSize: 0.15,
    bevelOffset: -0.15,
    bevelSegments: 2,
  });
  // SVG y points down; a half turn flips it without reversing the faces.
  geometry.rotateX(Math.PI);
  geometry.center();
  geometry.scale(0.1, 0.1, 0.1);
  const icon = new Group();
  icon.add(
    new Mesh(geometry, material), new LineSegments(new EdgesGeometry(geometry, 30), edgeMaterial)
  );
  return icon;
}

export function createStage (parameters: WebGLRendererParameters = {}) {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, ...parameters, });
  renderer.toneMapping = ACESFilmicToneMapping;
  const scene = new Scene();
  scene.add(new AmbientLight(0xffffff, 0.7));
  for (const [x, y, z, intensity] of [[-3, 4, 5, 3], [4, -1, 2, 0.8], [0, 3, -4, 2]]) {
    const light = new DirectionalLight(0xffffff, intensity);
    light.position.set(x, y, z);
    scene.add(light);
  }
  const camera = new PerspectiveCamera(26, 5 / 3, 0.1, 40);
  camera.position.z = 9;
  return { renderer, scene, camera, };
}
