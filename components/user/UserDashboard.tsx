import React, { useState, useEffect } from 'react';
import UserHeader from './UserHeader.tsx';
import UserProjectsPage from './pages/UserProjectsPage.tsx';
import UserInvoicesPage from './pages/UserInvoicesPage.tsx';
import UserProfilePage from './pages/UserProfilePage.tsx';
import { useData } from '../DataContext.tsx';

const UserDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [currentPage, setCurrentPage] = useState<'projects' | 'invoices' | 'profile'>('projects');
    const { clients, projects, invoices, users, handleSaveInvoice, handleSaveUser } = useData();

    // Mocking the logged-in user. Let's take the first user from the list.
    const currentUser = users[0]; // Alice Martin from Innovate Inc.
    const userClient = clients.find(c => c.id === currentUser.clientId);

    useEffect(() => {
        // If user is normal and trying to access invoices, redirect to projects.
        if (currentUser.role === 'normal' && currentPage === 'invoices') {
            setCurrentPage('projects');
        }
    }, [currentPage, currentUser.role]);

    if (!currentUser || !userClient) {
        return <div>Error: Could not load user data.</div>;
    }
    
    const userProjects = projects.filter(p => currentUser.projectIds?.includes(p.id));
    const userInvoices = invoices.filter(i => i.clientId === currentUser.clientId);

    const renderPage = () => {
        switch(currentPage) {
            case 'projects':
                return <UserProjectsPage projects={userProjects} client={userClient} />;
            case 'invoices':
                if (currentUser.role === 'normal') {
                    // This is a fallback, the useEffect should prevent this from being reached.
                    return <UserProjectsPage projects={userProjects} client={userClient} />;
                }
                return <UserInvoicesPage invoices={userInvoices} client={userClient} onSaveInvoice={handleSaveInvoice} />;
            case 'profile':
                return <UserProfilePage user={currentUser} onSave={handleSaveUser} />;
            default:
                return <UserProjectsPage projects={userProjects} client={userClient} />;
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