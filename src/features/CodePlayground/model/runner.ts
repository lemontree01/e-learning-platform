import { inputLimit, parseResult, type Language, type RunResult } from './protocol';

interface Asset { url: string; integrity: string; bytes: number }
interface RunHandle { result: Promise<RunResult>; stop: () => void }
let active: RunHandle | null = null;
const files: Record<Language, string[]> = {
  javascript: ['worker.js', 'quickjs.wasm'],
  python: ['worker.js', 'python.js', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'],
};

function assetInfo (manifest: unknown, name: string): Asset {
  const asset = (manifest as { assets?: Record<string, Asset> })?.assets?.[name];
  if (!asset || !/^\/code-runtime\/[\w.-]+$/.test(asset.url) ||
      !/^sha256-[A-Za-z0-9+/]{43}=$/.test(asset.integrity) ||
      !Number.isSafeInteger(asset.bytes) || asset.bytes < 1 || asset.bytes > 16 * 1024 * 1024) {
    throw new Error('Invalid runtime manifest.');
  }
  return asset;
}

export function startRun (
  language: Language, source: string, input: string, onStarted: () => void, sandboxTitle: string
): RunHandle {
  active?.stop();
  const controller = new AbortController();
  let frame: HTMLIFrameElement | null = null;
  let port: MessagePort | null = null;
  let done = false;
  let settle: (result: RunResult) => void = () => {};
  let timer: ReturnType<typeof setTimeout>;
  const result = new Promise<RunResult>(resolve => { settle = resolve; });
  const finish = (value: RunResult) => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    controller.abort();
    port?.postMessage('stop');
    port?.close();
    frame?.remove();
    if (active === handle) active = null;
    settle(value);
  };
  const handle: RunHandle = { result, stop: () => { finish({ status: 'stopped', output: '', }); }, };
  active = handle;
  timer = setTimeout(() => { finish({ status: 'unavailable', output: '', }); }, 60000);
  const exceeded = inputLimit(source, input);
  if (exceeded) { finish({ status: exceeded, output: '', }); return handle; }

  void (async () => {
    try {
      const options = { credentials: 'omit' as const, signal: controller.signal, };
      const response = await fetch('/code-runtime/manifest.json', { ...options, cache: 'no-store', });
      if (!response.ok) throw new Error('Runtime unavailable.');
      const manifest: unknown = await response.json();
      const assets: Record<string, ArrayBuffer> = {};
      for (const name of files[language]) {
        const asset = assetInfo(manifest, name);
        const response = await fetch(asset.url, {
          ...options, integrity: asset.integrity, cache: 'force-cache',
        });
        if (!response.ok) throw new Error('Runtime unavailable.');
        const bytes = await response.arrayBuffer();
        if (bytes.byteLength !== asset.bytes) throw new Error('Incomplete runtime.');
        assets[name] = bytes;
      }
      if (done) return;
      const worker = new TextDecoder().decode(assets['worker.js']);
      delete assets['worker.js'];
      const channel = new MessageChannel();
      port = channel.port1;
      frame = document.createElement('iframe');
      frame.hidden = true;
      frame.title = sandboxTitle;
      frame.setAttribute('sandbox', 'allow-scripts');
      frame.referrerPolicy = 'no-referrer';
      frame.setAttribute('allow', "camera 'none'; microphone 'none'; geolocation 'none'");
      frame.src = '/code-sandbox/frame.html';
      let started = false;
      port.onmessage = ({ data, }: MessageEvent<unknown>) => {
        if (done) return;
        if (!started && data && typeof data === 'object' && 'type' in data && data.type === 'started') {
          started = true;
          clearTimeout(timer);
          timer = setTimeout(() => { finish({ status: 'timeout', output: '', }); }, 3300);
          onStarted();
        }
        const value = parseResult(data);
        if (value) finish(value);
      };
      frame.addEventListener('load', () => {
        frame?.contentWindow?.postMessage({ worker, run: { language, source, input, assets, }, },
          '*', [channel.port2, ...Object.values(assets)]);
      }, { once: true, });
      clearTimeout(timer);
      timer = setTimeout(() => { finish({ status: 'unavailable', output: '', }); }, 30000);
      document.body.append(frame);
    } catch {
      if (!done) finish({ status: 'unavailable', output: '', });
    }
  })();
  return handle;
}
