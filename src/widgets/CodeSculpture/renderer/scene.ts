import {
  AmbientLight, BufferAttribute, BufferGeometry, DirectionalLight, DoubleSide,
  Group, LineBasicMaterial, LineSegments, Mesh, MeshStandardMaterial
} from 'three';
import {
  createRibbonIndices, createRibbonVertices, DEFAULT_PARAMETERS, type RibbonParameters
} from '../model/ribbon';

export const DEFAULT_ROTATION = { x: -0.48, y: -0.66, z: -0.22, };

// Shared with the offline poster renderer: no external models, textures or lights.
export function createSculpture () {
  const geometry = new BufferGeometry();
  const positions = createRibbonVertices(DEFAULT_PARAMETERS);
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setIndex(new BufferAttribute(createRibbonIndices(), 1));
  geometry.computeVertexNormals();
  const material = new MeshStandardMaterial({
    color: 0xe4e3df, roughness: 0.48, metalness: 0.12, side: DoubleSide,
  });
  const mesh = new Mesh(geometry, material);
  const edges = new BufferGeometry();
  // Sparse transverse lines reveal the construction without a dense triangle grid.
  const edgeIndices: number[] = [];
  for (let i = 0; i < 256; i++) {
    edgeIndices.push(i * 9, (i + 1) * 9, i * 9 + 8, (i + 1) * 9 + 8);
    if (i % 8 === 0) edgeIndices.push(i * 9, i * 9 + 8);
  }
  edgeIndices.push(256 * 9, 256 * 9 + 8);
  edges.setAttribute('position', geometry.getAttribute('position'));
  edges.setIndex(edgeIndices);
  const edgeMaterial = new LineBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0.16,
  });
  const lines = new LineSegments(edges, edgeMaterial);
  const group = new Group();
  group.add(mesh, lines);
  group.rotation.set(DEFAULT_ROTATION.x, DEFAULT_ROTATION.y, DEFAULT_ROTATION.z);
  return {
    group,
    update (parameters: RibbonParameters) {
      createRibbonVertices(parameters, positions);
      geometry.getAttribute('position').needsUpdate = true;
      geometry.computeVertexNormals();
      // Bounds change with spread; never reuse a stale frustum-culling sphere.
      geometry.computeBoundingSphere();
    },
    mode (wireframe: boolean) {
      mesh.visible = !wireframe;
      edgeMaterial.opacity = wireframe ? 0.85 : 0.16;
    },
    dispose () {
      geometry.dispose();
      edges.dispose();
      material.dispose();
      edgeMaterial.dispose();
    },
  };
}

export function createLighting () {
  const group = new Group();
  group.add(new AmbientLight(0xffffff, 0.7));
  for (const [x, y, z, intensity] of [[-3, 4, 5, 3], [4, -1, 2, 0.8], [0, 3, -4, 2]]) {
    const light = new DirectionalLight(0xffffff, intensity);
    light.position.set(x, y, z);
    group.add(light);
  }
  return group;
}
