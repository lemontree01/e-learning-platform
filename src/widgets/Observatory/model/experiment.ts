export const EXPERIMENT_END = 1200;
export type RequestStatus = 'idle' | 'running' | 'complete' | 'cancelled';

// A deterministic visualization: no network requests or visitor code are executed.
export function getExperimentFrame (time: number, cancelOlder: boolean) {
  const first: RequestStatus = cancelOlder && time >= 200
    ? 'cancelled'
    : time >= 1100 ? 'complete' : time > 0 ? 'running' : 'idle';
  const second: RequestStatus = time >= 650 ? 'complete' : time >= 200 ? 'running' : 'idle';
  const result = time >= 1100 && !cancelOlder ? 'react' : time >= 650 ? 'react hooks' : null;
  return {
    first,
    second,
    query: time >= 200 ? 'react hooks' : 'react',
    result,
    stale: time >= 1100 && !cancelOlder,
  };
}
