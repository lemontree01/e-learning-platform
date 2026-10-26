import { startRun } from './runner';

const originalFetch = global.fetch;
const fetchMock = jest.fn();
beforeEach(() => { global.fetch = fetchMock; fetchMock.mockReset(); });
afterAll(() => { global.fetch = originalFetch; });

test('oversized code never loads or executes a runtime', async () => {
  const run = startRun('javascript', 'x'.repeat(32769), '', jest.fn());
  expect(await run.result).toEqual({ status: 'source-limit', output: '', });
  expect(fetchMock).not.toHaveBeenCalled();
  expect(document.querySelector('iframe')).toBeNull();
});

test('a manifest cannot cause requests to another origin or application path', async () => {
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({
      assets: {
        'worker.js': { url: 'https://example.test/steal', integrity: 'sha256-' + 'a'.repeat(43) + '=', bytes: 1, },
      },
    }),
  });
  const run = startRun('javascript', '1', '', jest.fn());
  expect((await run.result).status).toBe('unavailable');
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith('/code-runtime/manifest.json', expect.objectContaining({
    credentials: 'omit',
  }));
});

test('Stop cancels asset downloads before a sandbox can be created', async () => {
  fetchMock.mockImplementation(async () => await new Promise(() => {}));
  const run = startRun('python', 'print(1)', '', jest.fn());
  const signal = fetchMock.mock.calls[0][1].signal as AbortSignal;
  run.stop();
  expect((await run.result).status).toBe('stopped');
  expect(signal.aborted).toBe(true);
  expect(document.querySelector('iframe')).toBeNull();
});
