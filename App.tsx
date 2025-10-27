





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
import OrganizationManagementPage from './components/pages/OrganizationManagementPage.tsx';
// FIX: Added file extension to import to resolve module error.
import PaymentPlansPage from './components/pages/PaymentPlansPage.tsx';
// FIX: Added file extension to import to resolve module error.
import SettingsPage from './components/pages/SettingsPage.tsx';
// FIX: Added file extension to import to resolve module error.
import UserManagementPage from './components/pages/UserManagementPage.tsx';
import LandingPage from './components/LandingPage.tsx';
import LoginPage from './components/pages/LoginPage.tsx';
import UserDashboard from './components/user/UserDashboard.tsx';
import { useData } from './components/DataContext.tsx';
import DeployKpiDashboardPage from './components/pages/DeployKpiDashboardPage.tsx';
import PortfolioPage from './components/pages/PortfolioPage.tsx';


function App() {
  const { isLoggedIn, userRole, login, logout } = useData();
  const [authPage, setAuthPage] = useState<'login' | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin',
    position: 'Super Admin',
    email: 'admin@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026702d'
  });

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSidebarOpen(false); // Close sidebar on navigation
  };
  
  const handleLoginSuccess = (role: 'admin' | 'user', userEmail?: string) => {
    login(role, userEmail);
    setAuthPage(null);
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('dashboard'); // Reset to default page on logout
  };

  const handleNavigateAuth = (page: 'login' | null) => {
    setAuthPage(page);
  };

  const handleAdminProfileUpdate = (updatedProfile: typeof adminProfile) => {
    setAdminProfile(updatedProfile);
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
      case 'organization-management':
        return <OrganizationManagementPage />;
      case 'payment-plans':
        return <PaymentPlansPage />;
      case 'deploy-kpi-dashboard':
        return <DeployKpiDashboardPage />;
      case 'portfolio':
        return <PortfolioPage />;
      case 'settings':
        return <SettingsPage userProfile={adminProfile} onProfileUpdate={handleAdminProfileUpdate} />;
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
          adminProfile={adminProfile}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={currentPage} onMenuClick={() => setSidebarOpen(true)} userProfile={adminProfile} />
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