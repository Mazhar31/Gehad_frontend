import React, { useState, useEffect } from 'react';
import UserHeader from './UserHeader.tsx';
import UserDashboardsPage from './pages/UserProjectsPage.tsx';
import UserProfilePage from './pages/UserProfilePage.tsx';
import UserAddinsPage from './pages/UserAddinsPage.tsx';
import { useData } from '../DataContext.tsx';

const UserDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [currentPage, setCurrentPage] = useState<'dashboards' | 'profile' | 'addins'>('dashboards');
    const { clients, projects, currentUser, handleSaveUser } = useData();

    // SEO Optimization for User Dashboards: Blackout internal pages from search engines
    useEffect(() => {
        const robotsMeta = document.createElement('meta');
        robotsMeta.name = 'robots';
        robotsMeta.content = 'noindex, nofollow';
        robotsMeta.id = 'private-robots-meta';
        document.head.appendChild(robotsMeta);
        
        const googleBotMeta = document.createElement('meta');
        googleBotMeta.name = 'googlebot';
        googleBotMeta.content = 'noindex, nofollow';
        googleBotMeta.id = 'private-googlebot-meta';
        document.head.appendChild(googleBotMeta);

        return () => {
            const r = document.getElementById('private-robots-meta');
            const g = document.getElementById('private-googlebot-meta');
            if (r) document.head.removeChild(r);
            if (g) document.head.removeChild(g);
        };
    }, []);

    if (!currentUser) {
        return (
            <div className="bg-dark-bg min-h-screen flex items-center justify-center">
                <p className="text-white">Loading user data or user not found...</p>
            </div>
        );
    }
    
    const userClient = clients.find(c => c.id === currentUser.clientId);
    
    // Always use real client data when available, fallback to temp client if not found
    const effectiveClient = userClient ? userClient : {
        id: currentUser.clientId || 'temp-client',
        company: 'No Client Assigned',
        email: currentUser.email,
        mobile: '',
        address: '',
        avatarUrl: currentUser.avatarUrl,
        groupId: undefined
    };
    
    const userProjects = projects.filter(p => currentUser.projectIds?.includes(p.id));
    const userDashboards = userProjects.filter(p => p.projectType === 'Dashboard' || !p.projectType);
    const addinProjects = userProjects.filter(p => p.projectType === 'Add-ins');

    const renderPage = () => {
        switch(currentPage) {
            case 'dashboards':
                return <UserDashboardsPage dashboards={userDashboards} client={effectiveClient} />;
            case 'addins':
                return <UserAddinsPage addins={addinProjects} />;
            case 'profile':
                return <UserProfilePage user={currentUser} onSave={handleSaveUser} />;
            default:
                return <UserDashboardsPage dashboards={userDashboards} client={effectiveClient} />;
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