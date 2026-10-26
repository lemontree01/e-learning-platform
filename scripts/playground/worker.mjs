import { newQuickJSWASMModuleFromVariant, newVariant } from 'quickjs-emscripten-core';
import variant from '@jitl/quickjs-wasmfile-release-sync';

// Capture host capabilities and primitives before any untrusted Python/JS interop.
const send = self.postMessage.bind(self);
const close = self.close.bind(self);
const slice = Function.prototype.call.bind(String.prototype.slice);
const decode = Function.prototype.call.bind(TextDecoder.prototype.decode);
const createBlobURL = data => URL.createObjectURL(new Blob([data], { type: 'text/javascript' }));
const now = Date.now.bind(Date);
const Bytes = Uint8Array;
const Decoder = TextDecoder;
const prevent = Function.prototype.call.bind(Event.prototype.preventDefault);
const stopEvent = Function.prototype.call.bind(Event.prototype.stopImmediatePropagation);
for (const type of ['error', 'unhandledrejection']) {
  addEventListener(type, event => { prevent(event); stopEvent(event); }, true);
}
// Pyodide is not an isolation boundary. Even if code reaches native JS, these
// capabilities must not be recoverable through a WorkerGlobalScope prototype.
for (let object = self; object; object = Object.getPrototypeOf(object)) {
  for (const key of ['postMessage', 'Worker', 'SharedWorker', 'reportError']) {
    if (object === self || Object.hasOwn(object, key)) {
      Object.defineProperty(object, key, { value: undefined, writable: false, configurable: false });
    }
  }
}

self.onmessage = async ({ data }) => {
  self.onmessage = null;
  let output = '', bytes = 0, lines = 0, limited = false;
  const encoder = new TextEncoder(), decoder = new TextDecoder();
  const encode = Function.prototype.call.bind(TextEncoder.prototype.encode);
  const appendBytes = chunk => {
    if (limited) throw new Error('Output limit reached.');
    let length = 0;
    while (length < chunk.length && bytes < 16384 && lines < 200) {
      if (chunk[length] === 10) lines++;
      length++; bytes++;
    }
    // Copy only the bounded portion; never join attacker-owned strings/arrays.
    const part = new Bytes(length);
    for (let index = 0; index < length; index++) part[index] = chunk[index];
    output += decode(decoder, part, { stream: true });
    if (length !== chunk.length || bytes >= 16384 || lines >= 200) limited = true;
    return length;
  };
  const append = text => {
    if (typeof text !== 'string') return;
    appendBytes(encode(encoder, slice(text, 0, 16384)));
  };
  const emit = status => {
    const encoded = encode(encoder, output);
    let text = output;
    if (encoded.length > 16384) {
      const bounded = new Bytes(16384);
      for (let index = 0; index < 16384; index++) bounded[index] = encoded[index];
      text = decode(new Decoder(), bounded, { stream: true });
      limited = true;
    }
    send({ type: 'result', status: limited ? 'output-limit' : status, output: slice(text, 0, 16384) });
  };
  const input = typeof data.input === 'string' ? data.input.split('\n') : [];
  let inputIndex = 0;
  try {
    if (data.language === 'javascript') {
      const engine = await newQuickJSWASMModuleFromVariant(newVariant(variant, {
        wasmBinary: data.assets['quickjs.wasm'],
        wasmLocation: 'https://runtime.invalid/quickjs.wasm',
      }));
      const runtime = engine.newRuntime();
      runtime.setMemoryLimit(16 * 1024 * 1024);
      runtime.setMaxStackSize(512 * 1024);
      const vm = runtime.newContext();
      const deadline = now() + 3000;
      runtime.setInterruptHandler(() => now() > deadline || limited);
      try {
        const console = vm.newObject();
        for (const name of ['log', 'info', 'warn', 'error']) {
          const fn = vm.newFunction(name, (...args) => {
            for (let index = 0; index < args.length; index++) {
              if (index) append(' ');
              const value = vm.dump(args[index]);
              append(typeof value === 'string' ? value : JSON.stringify(value) ?? String(value));
            }
            append('\n');
          });
          vm.setProp(console, name, fn); fn.dispose();
        }
        vm.setProp(vm.global, 'console', console); console.dispose();
        const prompt = vm.newFunction('prompt', () => vm.newString(input[inputIndex++] ?? ''));
        vm.setProp(vm.global, 'prompt', prompt); prompt.dispose();
        send({ type: 'started' });
        const result = vm.evalCode(data.source, 'lesson.js');
        if (result.error) {
          const error = vm.dump(result.error); result.error.dispose();
          throw new Error(error.message || 'JavaScript execution failed.');
        }
        result.value.dispose();
        const jobs = runtime.executePendingJobs();
        if (jobs.error) { jobs.error.dispose(); throw new Error('Asynchronous code failed.'); }
      } finally { vm.dispose(); runtime.dispose(); }
    } else if (data.language === 'python') {
      importScripts(createBlobURL(data.assets['python.js']));
      const loadPython = self.__lessonPython;
      delete self.__lessonPython;
      const stdlib = URL.createObjectURL(new Blob([data.assets['python_stdlib.zip']]));
      const lock = decode(decoder, data.assets['pyodide-lock.json']);
      // Pyodide's loader expects a fetch-based instantiator. Satisfy its one
      // virtual WASM URL from preloaded bytes, never from an HTTP connection.
      const blobFetch = self.fetch.bind(self);
      self.fetch = async resource => {
        const href = resource instanceof URL ? resource.href : resource;
        if (href === 'https://runtime.invalid/pyodide.asm.wasm') {
          return new Response(data.assets['pyodide.asm.wasm'], {
            headers: { 'Content-Type': 'application/wasm' },
          });
        }
        if (href === stdlib) return blobFetch(resource);
        throw new Error('Network access is disabled.');
      };
      const python = await loadPython({
        indexURL: 'https://runtime.invalid/',
        stdLibURL: stdlib,
        lockFileContents: lock,
        jsglobals: Object.freeze(Object.create(null)),
        stdout: () => {}, stderr: () => {}, stdin: () => input[inputIndex++] ?? null,
      }, data.assets['pyodide.asm.wasm']);
      Object.defineProperty(self, 'fetch', {
        value: () => Promise.reject(new Error('Network access is disabled.')),
        writable: false, configurable: false,
      });
      python.setStdout({ write: appendBytes });
      python.setStderr({ write: appendBytes });
      send({ type: 'started' });
      // No packages/import hooks: only the bundled standard library is available.
      try { python.runPython(data.source); }
      finally { python.runPython('import sys\nsys.stdout.flush()\nsys.stderr.flush()'); }
    } else throw new Error('Unsupported language.');
    // A hostile program can mutate JS prototypes; enforce a primitive size cap
    // immediately before using the privately captured native result channel.
    emit('completed');
  } catch (error) {
    const message = typeof error?.message === 'string' ? slice(error.message, 0, 2048) : 'Execution failed.';
    if (!limited) {
      try { append((output ? '\n' : '') + message); } catch {}
    }
    emit('error');
  } finally { close(); }
};
