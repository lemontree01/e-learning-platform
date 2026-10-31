export interface RibbonParameters {
  folds: number;
  twist: number;
  spread: number;
}

export type Parameter = keyof RibbonParameters;

export const DEFAULT_PARAMETERS: Readonly<RibbonParameters> = {
  folds: 16, twist: 120, spread: 0.9,
};

export const PARAMETERS = {
  folds: { min: 6, max: 32, step: 1, },
  twist: { min: -180, max: 180, step: 5, },
  spread: { min: 0.4, max: 1.6, step: 0.05, },
} as const;

export function normalizeParameter (key: Parameter, value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_PARAMETERS[key];
  const { min, max, step, } = PARAMETERS[key];
  const bounded = Math.min(max, Math.max(min, value));
  return Number((Math.round(bounded / step) * step).toFixed(2));
}

const LENGTH = 256;
const WIDTH = 8;
const LAYER = (LENGTH + 1) * (WIDTH + 1);

// A thick, continuous accordion strip follows an open circular spine. Stable
// sampling lets fractional fold counts morph without replacing GPU buffers.
export function createRibbonVertices (
  parameters: RibbonParameters,
  vertices: Float32Array = new Float32Array(LAYER * 2 * 3)
): Float32Array {
  for (let layer = 0; layer < 2; layer++) {
    for (let i = 0; i <= LENGTH; i++) {
      const t = i / LENGTH;
      const angle = t * Math.PI * 1.78 - Math.PI * 0.72;
      const radius = 0.85 + parameters.spread * 0.45;
      const roll = (t - 0.5) * parameters.twist * Math.PI / 180;
      const cosRoll = Math.cos(roll);
      const sinRoll = Math.sin(roll);
      const fold = (2 / Math.PI) * Math.asin(Math.sin(t * parameters.folds * Math.PI * 2));
      const depth = fold * 0.13 + (layer === 0 ? 0.012 : -0.012);
      for (let j = 0; j <= WIDTH; j++) {
        const width = (j / WIDTH - 0.5) * 0.92;
        const radial = radius + width * cosRoll - depth * sinRoll;
        const offset = (layer * LAYER + i * (WIDTH + 1) + j) * 3;
        vertices[offset] = Math.cos(angle) * radial;
        vertices[offset + 1] = Math.sin(angle) * radial;
        vertices[offset + 2] = width * sinRoll + depth * cosRoll +
          Math.sin(angle * 0.7) * 0.24;
      }
    }
  }
  return vertices;
}

export function createRibbonIndices (): Uint16Array {
  const indices: number[] = [];
  const quad = (a: number, b: number, c: number, d: number) => {
    indices.push(a, b, d, b, c, d);
  };
  for (let i = 0; i < LENGTH; i++) {
    for (let j = 0; j < WIDTH; j++) {
      const a = i * (WIDTH + 1) + j;
      const b = a + WIDTH + 1;
      quad(a, a + 1, b + 1, b);
      quad(a + LAYER, b + LAYER, b + 1 + LAYER, a + 1 + LAYER);
    }
    const left = i * (WIDTH + 1);
    const right = left + WIDTH;
    quad(left, left + WIDTH + 1, left + WIDTH + 1 + LAYER, left + LAYER);
    quad(right, right + LAYER, right + WIDTH + 1 + LAYER, right + WIDTH + 1);
  }
  for (let j = 0; j < WIDTH; j++) {
    quad(j, j + LAYER, j + 1 + LAYER, j + 1);
    const end = LENGTH * (WIDTH + 1) + j;
    quad(end, end + 1, end + 1 + LAYER, end + LAYER);
  }
  return new Uint16Array(indices);
}
