import { getExperimentFrame } from './experiment';

test('the newer request finishes first, then an older response overwrites it', () => {
  expect(getExperimentFrame(0, false).result).toBeNull();
  expect(getExperimentFrame(200, false).query).toBe('react hooks');
  expect(getExperimentFrame(649, false).result).toBeNull();
  expect(getExperimentFrame(650, false).result).toBe('react hooks');
  expect(getExperimentFrame(1099, false).stale).toBe(false);
  expect(getExperimentFrame(1100, false)).toMatchObject({ result: 'react', stale: true, });
});

test('cancelling the older request preserves the latest result', () => {
  expect(getExperimentFrame(199, true).first).toBe('running');
  expect(getExperimentFrame(200, true).first).toBe('cancelled');
  expect(getExperimentFrame(1200, true)).toMatchObject({
    result: 'react hooks', stale: false, first: 'cancelled', second: 'complete',
  });
});

test('scrubbing back reconstructs the same state without retained responses', () => {
  getExperimentFrame(1200, false);
  expect(getExperimentFrame(100, false)).toMatchObject({
    query: 'react', result: null, first: 'running', second: 'idle', stale: false,
  });
  expect(getExperimentFrame(700, false)).toEqual(getExperimentFrame(700, false));
});
