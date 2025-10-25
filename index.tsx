
import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Added file extension to App import to resolve module error.
import App from './App.tsx';
import { DataProvider } from './components/DataContext.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>
);