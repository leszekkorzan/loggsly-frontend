import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { onServiceWorkerUpdate } from '@3m1/service-worker-updater';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
serviceWorkerRegistration.register({
  onUpdate: onServiceWorkerUpdate
});