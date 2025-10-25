
import React, { useState } from 'react';
// FIX: Added file extension to import to resolve module error.
import Sidebar from './components/Sidebar.tsx';
// FIX: Added file extension to import to resolve module error.
import Header from './components/Header.tsx';
// FIX: Added file extension to import to resolve module error.
import DashboardPage from './components/pages/DashboardPage.tsx';
// FIX: Added file extension to import to resolve module error.
import ProjectsPage from './components/pages/ProjectsPage.tsx';
// FIX: Added file extension to import to resolve module error.
import ClientsPage from './components/pages/ClientsPage.tsx';
// FIX: Added file extension to import to resolve module error.
import InvoicesPage from './components/pages/InvoicesPage.tsx';
// FIX: Added file extension to import to resolve module error.
import CategoriesPage from './components/pages/CategoriesPage.tsx';
// FIX: Added file extension to import to resolve module error.
import PaymentPlansPage from './components/pages/PaymentPlansPage.tsx';
// FIX: Added file extension to import to resolve module error.
import SettingsPage from './components/pages/SettingsPage.tsx';
// FIX: Added file extension to import to resolve module error.
import UserManagementPage from './components/pages/UserManagementPage.tsx';
import LandingPage from './components/LandingPage.tsx';
import LoginPage from './components/pages/LoginPage.tsx';
import UserDashboard from './components/user/UserDashboard.tsx';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [authPage, setAuthPage] = useState<'login' | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSidebarOpen(false); // Close sidebar on navigation
  };
  
  const handleLoginSuccess = (role: 'admin' | 'user') => {
    setIsLoggedIn(true);
    setUserRole(role);
    setAuthPage(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentPage('dashboard'); // Reset to default page on logout
  };

  const handleNavigateAuth = (page: 'login' | null) => {
    setAuthPage(page);
  };


  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'projects':
        return <ProjectsPage />;
      case 'clients':
        return <ClientsPage />;
      case 'user-management':
        return <UserManagementPage />;
      case 'invoices':
        return <InvoicesPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'payment-plans':
        return <PaymentPlansPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  if (!isLoggedIn) {
    if (authPage === 'login') {
      return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigateAuth} />;
    }
    return <LandingPage onNavigate={handleNavigateAuth} />;
  }

  if (userRole === 'admin') {
    return (
      <div className="flex h-screen bg-dark-bg font-sans">
        <Sidebar 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={currentPage} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark-bg">
            <div className="container mx-auto px-4 sm:px-6 py-6">
              {renderPage()}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (userRole === 'user') {
    return (
        <UserDashboard onLogout={handleLogout} />
    );
  }

  return null;
}

export default App;