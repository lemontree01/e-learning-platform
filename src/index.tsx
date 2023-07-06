import {
  createRoot
} from 'react-dom/client';
import { App } from '~/app/App';

const rootEl = document.querySelector('#root');
if (!rootEl) throw new Error('Cannot find root element with that id');
const root = createRoot(rootEl);
root.render(
  <App />
);
