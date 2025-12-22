import React, { useState, useEffect } from 'react';
// FIX: Added file extension to import to resolve module error.
import UserHeader from './UserHeader.tsx';
// FIX: Added file extension to import to resolve module error.
import UserDashboardsPage from './pages/UserProjectsPage.tsx';
// FIX: Added file extension to import to resolve module error.
import UserInvoicesPage from './pages/UserInvoicesPage.tsx';
// FIX: Added file extension to import to resolve module error.
import UserProfilePage from './pages/UserProfilePage.tsx';
// FIX: Added file extension to import to resolve module error.
import UserAddinsPage from './pages/UserAddinsPage.tsx';
import { useData } from '../DataContext.tsx';
import { projectAPI, invoiceAPI, userAPI } from '../../services/api';
import { Project, Invoice } from '../../types';

const UserDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [currentPage, setCurrentPage] = useState<'dashboards' | 'invoices' | 'profile' | 'addins'>('dashboards');
    const { clients, projects, invoices, currentUser, handleSaveInvoice, handleSaveUser } = useData();
    
    console.log('📊 UserDashboard rendered with currentUser:', currentUser);
    console.log('📊 Available clients:', clients);
    console.log('📊 Looking for client ID:', currentUser?.clientId);
    console.log('📊 All invoices from context:', invoices);
    console.log('📊 User project IDs:', currentUser?.projectIds);
    const [userProjects, setUserProjects] = useState<Project[]>([]);
    const [userInvoices, setUserInvoices] = useState<Invoice[]>([]);
    const [userAddins, setUserAddins] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load user-specific data from context data
    useEffect(() => {
        if (!currentUser) {
            setLoading(true);
            return;
        }
        
        setLoading(true);
        const localProjects = projects.filter(p => currentUser.projectIds?.includes(p.id));
        setUserProjects(localProjects.filter(p => p.projectType === 'Dashboard' || !p.projectType));
        setUserAddins(localProjects.filter(p => p.projectType === 'Add-ins'));
        
        // Filter invoices by user's assigned projects (backend should do this, but adding as safety)
        const userProjectIds = currentUser.projectIds || [];
        console.log('🔍 Filtering invoices. User projects:', userProjectIds);
        console.log('🔍 Available invoices:', invoices.map(i => ({ id: i.id, projectId: i.projectId, clientId: i.clientId })));
        
        const filteredInvoices = invoices.filter(invoice => {
            const matchesClient = invoice.clientId === currentUser.clientId;
            const matchesProject = !invoice.projectId || userProjectIds.includes(invoice.projectId);
            console.log(`🔍 Invoice ${invoice.id}: client match=${matchesClient}, project match=${matchesProject}`);
            return matchesClient && matchesProject;
        });
        
        console.log('🔍 Filtered invoices:', filteredInvoices);
        setUserInvoices(filteredInvoices);
        setLoading(false);
    }, [currentUser, projects, invoices]);

    // Removed redirect logic - allow all users to access invoices

    // Handle invoice payment
    const handlePayInvoice = async (invoiceId: string) => {
        try {
            const updatedInvoice = await invoiceAPI.payInvoice(invoiceId);
            setUserInvoices(prev => prev.map(inv => inv.id === invoiceId ? updatedInvoice : inv));
        } catch (err) {
            console.error('Failed to pay invoice:', err);
            // Fallback to local update
            await handleSaveInvoice({ ...userInvoices.find(i => i.id === invoiceId)!, status: 'Paid' });
            setUserInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'Paid' as const } : inv));
        }
    };

    // Handle profile update
    const handleProfileUpdate = async (userData: any) => {
        try {
            await userAPI.updateProfile(userData);
            await handleSaveUser({ ...currentUser!, ...userData });
        } catch (err) {
            console.error('Failed to update profile:', err);
            // Fallback to local update
            await handleSaveUser({ ...currentUser!, ...userData });
        }
    };

    if (!currentUser) {
        console.log('⚠️ UserDashboard: No currentUser found, showing loading state');
        // This should theoretically not be reached if App.tsx logic is correct,
        // but it's a good safeguard.
        return (
            <div className="bg-dark-bg min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-lime mx-auto mb-4"></div>
                    <p className="text-white">Loading user data...</p>
                    <p className="text-secondary-text text-sm mt-2">If this persists, please try logging in again.</p>
                </div>
            </div>
        );
    }
    
    const userClient = clients.find(c => c.id === currentUser.clientId);
    
    // Always use real client data when available
    const effectiveClient = userClient ? userClient : {
        id: currentUser.clientId || 'temp-client',
        company: 'No Client Assigned',
        email: currentUser.email,
        mobile: '',
        address: '',
        avatarUrl: currentUser.avatarUrl,
        groupId: undefined
    };

    const userDashboards = userProjects;
    const addinProjects = userAddins;
    const displayInvoices = userInvoices;

    const renderPage = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-lime"></div>
                </div>
            );
        }

        switch(currentPage) {
            case 'dashboards':
                return <UserDashboardsPage dashboards={userDashboards} client={effectiveClient} />;
            case 'addins':
                return <UserAddinsPage addins={addinProjects} />;
            case 'invoices':
                return <UserInvoicesPage invoices={displayInvoices} client={effectiveClient} onSaveInvoice={handlePayInvoice} />;
            case 'profile':
                return <UserProfilePage user={currentUser} onSave={handleProfileUpdate} />;
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
                {error && (
                    <div className="bg-yellow-900/20 border border-yellow-500/50 text-yellow-400 px-4 py-3 mb-6 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span>Using local data: {error}</span>
                        </div>
                    </div>
                )}
                {renderPage()}
            </main>
        </div>
    );
};

export default UserDashboard;