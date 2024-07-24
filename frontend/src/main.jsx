import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { restoreCSRF, csrfFetch } from './store/csrf';
import { ModalProvider, Modal } from './context/Modal';
import App from './App';
import configureStore from './store';
import * as sessionActions from './store/session';
import * as spotActions from './store/spots'
import './index.css';

const store = configureStore();

//testing
if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
  window.spotActions = spotActions;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <App />
        <Modal />
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);
