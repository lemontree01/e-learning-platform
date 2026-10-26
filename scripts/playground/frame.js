// Trusted broker. Learner code never executes in this document.
addEventListener('message', function initialize(event) {
  if (event.source !== parent || event.ports.length !== 1) return;
  removeEventListener('message', initialize);
  const port = event.ports[0];
  const packet = event.data;
  const url = URL.createObjectURL(new Blob([packet.worker], { type: 'text/javascript' }));
  const worker = new Worker(url);
  let started = false, finished = false;
  const stop = () => { worker.terminate(); URL.revokeObjectURL(url); port.close(); };
  worker.onmessage = ({ data }) => {
    if (finished || !data || typeof data !== 'object') return;
    if (data.type === 'started' && !started) { started = true; port.postMessage({ type: 'started' }); }
    if (data.type !== 'result') return;
    finished = true;
    const text = typeof data.output === 'string' ? data.output.slice(0, 16384) : '';
    const bytes = new TextEncoder().encode(text);
    let length = 0, lines = 0;
    while (length < bytes.length && length < 16384 && lines < 200) {
      if (bytes[length++] === 10) lines++;
    }
    const output = new TextDecoder().decode(bytes.subarray(0, length), { stream: true });
    const status = length < bytes.length ? 'output-limit' :
      ['completed', 'error', 'output-limit'].includes(data.status) ? data.status : 'error';
    port.postMessage({ type: 'result', output, status });
    stop();
  };
  worker.onerror = event => {
    event.preventDefault();
    if (!finished) port.postMessage({ type: 'result', status: 'error', output: 'Runtime could not start.' });
    finished = true;
    stop();
  };
  port.onmessage = () => stop();
  port.start();
  addEventListener('pagehide', stop, { once: true });
  worker.postMessage(packet.run, Object.values(packet.run.assets));
});
