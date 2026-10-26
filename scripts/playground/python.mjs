import { loadPyodide } from 'pyodide';
import createModule from '../../node_modules/pyodide/pyodide.asm.mjs';

// Trusted bootstrap only; the Worker captures and removes this before execution.
self.__lessonPython = (options, wasmBinary) => loadPyodide({
  ...options,
  createPyodideModule: config => createModule({ ...config, wasmBinary }),
});
