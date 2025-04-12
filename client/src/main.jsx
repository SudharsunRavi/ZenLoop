import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.jsx'

import { persistor, store } from '../src/utils/redux/store.jsx';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
