import React from 'react';
import App from '../App.tsx';
import DashboardView from './DashboardView.tsx';

// Simple router component without external dependencies
const Router: React.FC = () => {
  const path = window.location.pathname;
  
  // Check if this is a dashboard URL pattern: /clientName/projectName
  const dashboardMatch = path.match(/^\/([^\/]+)\/([^\/]+)$/);
  
  if (dashboardMatch) {
    const [, clientName, projectName] = dashboardMatch;
    return <DashboardView />;
  }
  
  // Default to main app
  return <App />;
};

export default Router;