import {
  DEFAULT_PARAMETERS, normalizeParameter, createRibbonVertices, createRibbonIndices
} from './ribbon';

test('editable values are finite, bounded and use the declared precision', () => {
  expect(normalizeParameter('folds', 7.8)).toBe(8);
  expect(normalizeParameter('folds', 900)).toBe(32);
  expect(normalizeParameter('twist', -900)).toBe(-180);
  expect(normalizeParameter('spread', 0.93)).toBe(0.95);
  expect(normalizeParameter('spread', Number.NaN)).toBe(0.9);
  expect(normalizeParameter('twist', Infinity)).toBe(120);
});

test('the ribbon is deterministic and keeps stable topology while morphing', () => {
  const original = createRibbonVertices(DEFAULT_PARAMETERS);
  expect(createRibbonVertices(DEFAULT_PARAMETERS)).toEqual(original);
  for (const parameters of [
    { folds: 6, twist: -180, spread: 0.4, },
    { folds: 32, twist: 180, spread: 1.6, }
  ]) {
    const changed = createRibbonVertices(parameters);
    expect(changed.length).toBe(original.length);
    expect(changed).not.toEqual(original);
    expect(Array.from(changed).every(Number.isFinite)).toBe(true);
    expect(Math.max(...changed.map(Math.abs))).toBeLessThan(3);
  }
  const indices = createRibbonIndices();
  expect(indices.length % 3).toBe(0);
  expect(Math.max(...indices)).toBeLessThan(original.length / 3);
});

test.each(['folds', 'twist', 'spread'] as const)('%s changes the actual geometry', key => {
  const original = createRibbonVertices(DEFAULT_PARAMETERS);
  const changed = createRibbonVertices({
    ...DEFAULT_PARAMETERS, [key]: DEFAULT_PARAMETERS[key] * 0.5,
  });
  expect(changed).not.toEqual(original);
});

test('every mesh edge is closed with consistently oriented adjacent faces', () => {
  const indices = createRibbonIndices();
  const edges = new Map<string, number[]>();
  for (let i = 0; i < indices.length; i += 3) {
    for (let corner = 0; corner < 3; corner++) {
      const a = indices[i + corner];
      const b = indices[i + (corner + 1) % 3];
      const key = `${Math.min(a, b)}:${Math.max(a, b)}`;
      edges.set(key, [...(edges.get(key) || []), a < b ? 1 : -1]);
    }
  }
  for (const directions of edges.values()) {
    expect(directions).toHaveLength(2);
    expect(directions[0] + directions[1]).toBe(0);
  }
});
