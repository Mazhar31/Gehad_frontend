import React, { useState, useEffect } from 'react';
import UserHeader from './UserHeader.tsx';
import UserDashboardsPage from './pages/UserProjectsPage.tsx';
import UserInvoicesPage from './pages/UserInvoicesPage.tsx';
import UserProfilePage from './pages/UserProfilePage.tsx';
import UserAddinsPage from './pages/UserAddinsPage.tsx';
import { useData } from '../DataContext.tsx';

const UserDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [currentPage, setCurrentPage] = useState<'dashboards' | 'invoices' | 'profile' | 'addins'>('dashboards');
    const { clients, projects, invoices, currentUser, handleSaveInvoice, handleSaveUser } = useData();

    if (!currentUser) {
        // This should theoretically not be reached if App.tsx logic is correct,
        // but it's a good safeguard.
        return (
            <div className="bg-dark-bg min-h-screen flex items-center justify-center">
                <p className="text-white">Loading user data or user not found...</p>
            </div>
        );
    }
    
    const userClient = clients.find(c => c.id === currentUser.clientId);

    useEffect(() => {
        // If user is normal and trying to access invoices, redirect to dashboards.
        if (currentUser.role === 'normal' && currentPage === 'invoices') {
            setCurrentPage('dashboards');
        }
    }, [currentPage, currentUser.role]);

    if (!userClient) {
        return <div className="bg-dark-bg min-h-screen flex items-center justify-center"><p className="text-white">Error: Could not load user's client data.</p></div>;
    }
    
    const userProjects = projects.filter(p => currentUser.projectIds?.includes(p.id));
    const userInvoices = invoices.filter(i => i.clientId === currentUser.clientId);

    const userDashboards = userProjects.filter(p => p.projectType === 'Dashboard' || !p.projectType);
    const addinProjects = userProjects.filter(p => p.projectType === 'Add-ins');

    const renderPage = () => {
        switch(currentPage) {
            case 'dashboards':
                return <UserDashboardsPage dashboards={userDashboards} client={userClient} />;
            case 'addins':
                return <UserAddinsPage addins={addinProjects} />;
            case 'invoices':
                if (currentUser.role === 'normal') {
                    // This is a fallback, the useEffect should prevent this from being reached.
                    return <UserDashboardsPage dashboards={userDashboards} client={userClient} />;
                }
                return <UserInvoicesPage invoices={userInvoices} client={userClient} onSaveInvoice={handleSaveInvoice} />;
            case 'profile':
                return <UserProfilePage user={currentUser} onSave={handleSaveUser} />;
            default:
                return <UserDashboardsPage dashboards={userDashboards} client={userClient} />;
        }
    };

    return (
        <div className="bg-dark-bg min-h-screen text-primary-text font-sans">
            <UserHeader 
                userName={currentUser.name} 
                userAvatar={currentUser.avatarUrl}
                currentPage={currentPage}
                onNavigate={setCurrentPage}
                onLogout={onLogout}
                userRole={currentUser.role}
            />
            <main className="container mx-auto px-4 sm:px-6 py-8">
                {renderPage()}
            </main>
        </div>
    );
};

export default UserDashboard;