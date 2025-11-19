
import React, { useState, useEffect } from 'react';
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
import ResetPasswordPage from './components/pages/ResetPasswordPage.tsx';
import UserDashboard from './components/user/UserDashboard.tsx';
import { useData } from './components/DataContext.tsx';
import DeployKpiDashboardPage from './components/pages/DeployKpiDashboardPage.tsx';
import PortfolioPage from './components/pages/PortfolioPage.tsx';
import { authService } from './services/auth';


function App() {
  const { isLoggedIn, userRole, login, logout, error, loading, currentUser } = useData();
  
  // Debug logging for app state
  console.log('📊 App state:', { isLoggedIn, userRole, hasCurrentUser: !!currentUser, error, loading });
  const [authPage, setAuthPage] = useState<'login' | 'reset-password' | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin',
    position: 'Super Admin',
    email: 'admin@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026702d'
  });

  // Load admin profile from backend
  const loadAdminProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      
      const response = await fetch('http://localhost:8000/api/admin/firebase/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const profile = result.data;
        setAdminProfile({
          name: profile.name || 'Admin',
          position: profile.position || 'Super Admin',
          email: profile.email || 'admin@example.com',
          avatarUrl: profile.avatar_url || 'https://i.pravatar.cc/150?u=a042581f4e29026702d'
        });
      }
    } catch (error) {
      console.error('Failed to load admin profile:', error);
    }
  };

  // Check if this is a password reset page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('token') && window.location.pathname === '/reset-password') {
      setAuthPage('reset-password');
      return;
    }
  }, []);

  // Check for existing authentication on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Initializing authentication...');
      const token = localStorage.getItem('auth_token');
      const role = localStorage.getItem('user_role') as 'admin' | 'user' | null;
      const email = localStorage.getItem('user_email');
      
      console.log('📋 Auth data from localStorage:', { hasToken: !!token, role, email });
      
      if (token && role) {
        try {
          console.log('🔍 Validating token with backend...');
          // Try to validate the token by making a simple API call
          const response = await fetch('http://localhost:8000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            console.log('✅ Token is valid, logging in user');
            // Token is valid, restore login state
            login(role, email || undefined);
            // Load admin profile if admin
            if (role === 'admin') {
              await loadAdminProfile();
            }
          } else {
            console.log('❌ Token is invalid, clearing auth data');
            // Token is invalid, clear it
            authService.logout();
          }
        } catch (error) {
          // Backend is not available or token is invalid
          // For development, allow offline mode with stored credentials
          console.warn('⚠️ Backend not available, using offline mode:', error);
          login(role, email || undefined);
        }
      } else {
        console.log('ℹ️ No stored authentication found');
      }
      setIsInitializing(false);
      console.log('✅ Authentication initialization complete');
    };

    initializeAuth();
  }, [login]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSidebarOpen(false); // Close mobile sidebar on navigation
  };
  
  const handleLoginSuccess = async (role: 'admin' | 'user', userEmail?: string) => {
    console.log('🎉 Login success in App.tsx:', { role, userEmail });
    login(role, userEmail);
    setAuthPage(null);
    
    // Load admin profile after login
    if (role === 'admin') {
      await loadAdminProfile();
    }
    
    // For user logins, add a small delay to ensure DataContext is updated
    if (role === 'user') {
      console.log('🔄 User login detected, allowing DataContext to update...');
    }
  };

  const handleLogout = () => {
    authService.logout();
    logout();
    setCurrentPage('dashboard');
  };

  // Debug function to clear all localStorage (can be called from browser console)
  (window as any).clearAllStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleNavigateAuth = (page: 'login' | 'reset-password' | null) => {
    setAuthPage(page);
  };

  const handleAdminProfileUpdate = (updatedProfile: typeof adminProfile) => {
    setAdminProfile(updatedProfile);
    // Also reload from backend to ensure sync
    setTimeout(loadAdminProfile, 500);
  };

  const handleToggleSidebarCollapse = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
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

  // Show loading spinner during initialization
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-lime"></div>
      </div>
    );
  }

  // Show error message if there's a global error
  if (error && !isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-accent-lime text-black px-4 py-2 rounded-lg hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    if (authPage === 'login') {
      return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigateAuth} />;
    }
    if (authPage === 'reset-password') {
      return <ResetPasswordPage onSuccess={() => setAuthPage('login')} />;
    }
    return <LandingPage onNavigate={handleNavigateAuth} />;
  }

  // Additional safety check
  if (!userRole) {
    console.warn('User is logged in but no role found, logging out...');
    handleLogout();
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-lime"></div>
      </div>
    );
  }

  if (userRole === 'admin') {
    console.log('👨‍💼 Rendering admin dashboard');
    return (
      <div className="flex h-screen bg-dark-bg font-sans">
        <Sidebar 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
          adminProfile={adminProfile}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebarCollapse}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={currentPage} onMenuClick={() => setSidebarOpen(true)} userProfile={adminProfile} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark-bg">
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 mx-4 mt-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>{error}</span>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="text-sm underline hover:no-underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            <div className="container mx-auto px-4 sm:px-6 py-6">
              {loading && (
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-lime"></div>
                </div>
              )}
              {renderPage()}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (userRole === 'user') {
    console.log('👤 Rendering UserDashboard for user role');
    return (
        <UserDashboard onLogout={handleLogout} />
    );
  }

  return null;
}

export default App;
