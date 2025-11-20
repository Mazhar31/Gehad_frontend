import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './components/Router.tsx';
import { DataProvider } from './components/DataContext.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <DataProvider>
        <Router />
      </DataProvider>
    </ErrorBoundary>
  </React.StrictMode>
);