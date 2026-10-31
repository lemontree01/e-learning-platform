import { type Group } from 'three';
import { createIcon, createStage, REST_POSE } from './iconScene';

const TAU = Math.PI * 2;
// About one turn every 11 seconds.
const IDLE_SPIN = 0.55;
const STIFFNESS = 70;
const DAMPING = 12;
// Without input for this long the icons ease to a stop and the loop ends, so an idle page
// costs no CPU; any input starts them again.
const IDLE_AFTER = 8000;

// One WebGL context for every card: browsers cap contexts at about 16 per page.
const { renderer, scene, camera, } = createStage({ powerPreference: 'low-power', });
const icons = new Map<number, Group>();
const visible = new Set<Card>();
const mounted = new Set<Card>();
let last = 0;
let frame = 0;
let active = performance.now();

function start () {
  if (frame || !visible.size) return;
  last = performance.now();
  frame = requestAnimationFrame(tick);
}

for (const type of ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart']) {
  addEventListener(type, () => { active = performance.now(); start(); }, {
    passive: true, capture: true,
  });
}

interface Card {
  id: number;
  context: CanvasRenderingContext2D;
  onLive: (live: boolean) => void;
  shown: boolean;
  hovered: boolean;
  x: number;
  y: number;
  front: number;
  yaw: number;
  spin: number;
  pitch: number;
  lean: number;
  scale: number;
  grow: number;
}

function spring (value: number, velocity: number, target: number, delta: number) {
  const next = velocity + (STIFFNESS * (target - value) - DAMPING * velocity) * delta;
  return [value + next * delta, next] as const;
}

function draw (card: Card) {
  const canvas = card.context.canvas;
  const ratio = Math.min(devicePixelRatio, 1.5);
  const width = Math.round(canvas.clientWidth * ratio);
  const height = Math.round(canvas.clientHeight * ratio);
  if (!width || !height) return;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const size = renderer.domElement;
  if (size.width !== width || size.height !== height) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  let icon = icons.get(card.id);
  if (!icon) {
    icon = createIcon(card.id);
    icons.set(card.id, icon);
  }
  icon.rotation.set(card.pitch, card.yaw, 0);
  icon.scale.setScalar(card.scale);
  scene.add(icon);
  renderer.render(scene, camera);
  scene.remove(icon);
  // Copied in the same task as the render, so the drawing buffer is still intact.
  card.context.clearRect(0, 0, width, height);
  card.context.drawImage(size, 0, 0);
  if (!card.shown) { card.shown = true; card.onLive(true); }
}

function tick (now: number) {
  const delta = Math.min((now - last) / 1000, 0.05);
  last = now;
  const resting = now - active > IDLE_AFTER;
  let settled = resting;
  for (const card of visible) {
    if (card.hovered) {
      [card.yaw, card.spin] = spring(card.yaw, card.spin, card.front + card.x * 1.2, delta);
    } else {
      card.spin += ((resting ? 0 : IDLE_SPIN) - card.spin) * Math.min(delta * 2, 1);
      card.yaw += card.spin * delta;
    }
    const pitch = card.hovered ? card.y * 0.8 : REST_POSE.pitch;
    [card.pitch, card.lean] = spring(card.pitch, card.lean, pitch, delta);
    [card.scale, card.grow] = spring(card.scale, card.grow, card.hovered ? 1.14 : 1, delta);
    draw(card);
    settled &&= !card.hovered && Math.max(Math.abs(card.spin), Math.abs(card.lean),
      Math.abs(card.grow), Math.abs(card.pitch - pitch), Math.abs(card.scale - 1)) < 0.002;
  }
  frame = visible.size && !settled ? requestAnimationFrame(tick) : 0;
}

renderer.domElement.addEventListener('webglcontextlost', () => {
  cancelAnimationFrame(frame);
  frame = 0;
  visible.clear();
  for (const card of mounted) card.onLive(false);
  mounted.clear();
});

// Mounts a live icon into a 2D canvas: `onLive(true)` once its first frame is drawn,
// `onLive(false)` if WebGL is lost and the poster must come back.
export function mountIcon (canvas: HTMLCanvasElement, id: number, onLive: (live: boolean) => void) {
  const context = canvas.getContext('2d');
  if (!context) return null;
  const card: Card = {
    id,
    context,
    onLive,
    shown: false,
    hovered: false,
    x: 0,
    y: 0,
    front: 0,
    yaw: REST_POSE.yaw,
    spin: 0,
    pitch: REST_POSE.pitch,
    lean: 0,
    scale: 1,
    grow: 0,
  };
  mounted.add(card);
  return {
    show (shown: boolean) {
      if (!mounted.has(card)) return;
      if (!shown) { visible.delete(card); return; }
      visible.add(card);
      if (!card.shown) draw(card);
      start();
    },
    // x and y run from -0.5 to 0.5 across the artwork.
    point (x: number, y: number) {
      // Entering: one quick turn that lands facing the viewer.
      if (!card.hovered) card.front = Math.ceil(card.yaw / TAU) * TAU + TAU;
      card.hovered = true;
      card.x = x;
      card.y = y;
    },
    leave () { card.hovered = false; },
    unmount () { visible.delete(card); mounted.delete(card); },
  };
}

export type LiveIcon = NonNullable<ReturnType<typeof mountIcon>>;
