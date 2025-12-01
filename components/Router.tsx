import React from 'react';
import App from '../App.tsx';
import DashboardView from './DashboardView.tsx';
import DashboardViewer from './DashboardViewer.tsx';

// Simple router component without external dependencies
const Router: React.FC = () => {
  const path = window.location.pathname;
  
  // Check if this is a dashboard URL pattern: /dashboard/clientName/projectName
  const dashboardMatch = path.match(/^\/dashboard\/([^\/]+)\/([^\/]+)$/);
  // Check if this is an addins URL pattern: /addins/clientName/projectName
  const addinsMatch = path.match(/^\/addins\/([^\/]+)\/([^\/]+)$/);
  
  if (dashboardMatch || addinsMatch) {
    const match = dashboardMatch || addinsMatch;
    const [, clientName, projectName] = match;
    
    // Validate session - if no valid session, redirect to login page
    const sessionData = sessionStorage.getItem('dashboard_access_session');
    if (!sessionData) {
      console.log('❌ No project session found, redirecting to login');
      window.location.href = '/?page=login';
      return null;
    }
    
    try {
      const session = JSON.parse(sessionData);
      const expectedKey = `${clientName}-${projectName}`;
      
      if (session.key !== expectedKey || Date.now() > session.expires || session.token !== localStorage.getItem('auth_token')) {
        console.log('❌ Invalid project session, redirecting to login');
        window.location.href = '/?page=login';
        return null;
      }
    } catch {
      console.log('❌ Corrupted project session, redirecting to login');
      window.location.href = '/?page=login';
      return null;
    }
    
    return <DashboardViewer clientName={clientName} projectName={projectName} />;
  }
  
  // Check if this is a legacy dashboard URL pattern: /clientName/projectName
  const legacyDashboardMatch = path.match(/^\/([^\/]+)\/([^\/]+)$/);
  
  if (legacyDashboardMatch) {
    const [, clientName, projectName] = legacyDashboardMatch;
    return <DashboardView />;
  }
  
  // Default to main app
  return <App />;
};

export default Router;