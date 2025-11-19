import React from 'react';
import KpiCard from '../StockCard.tsx';
import DetailsCard from '../DetailsCard.tsx';
import RecentProjects from '../RecentProjects.tsx';
import { useData } from '../DataContext.tsx';
import { FolderIcon, UsersIcon, DocumentTextIcon, BanknotesIcon } from '../icons.tsx';
import { useDashboard } from '../../hooks/useDashboard';

interface DashboardPageProps {
    onNavigate: (page: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
    const { projects, clients, invoices, loading, error } = useData();
    const { stats, recentProjects, loading: dashboardLoading, error: dashboardError } = useDashboard();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-lime"></div>
                <p className="text-gray-400">Loading data from Firebase...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="text-red-400 text-center">
                    <p className="text-lg font-semibold">Failed to load data</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    // Use API stats if available, otherwise calculate from local data
    const totalProjects = stats?.total_projects ?? projects.length;
    const totalClients = stats?.total_clients ?? clients.length;
    const activeProjects = stats?.active_projects ?? projects.filter(p => p.status === 'In Progress').length;
    const totalRevenue = stats?.total_revenue ?? invoices
        .filter(inv => inv.status === 'Paid')
        .reduce((sum, inv) => sum + inv.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0), 0);
    
    // Use API recent projects if available, otherwise use local data
    const displayProjects = recentProjects.length > 0 ? recentProjects.slice(0, 5) : projects.slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Error Message */}
            {dashboardError && (
                <div className="bg-yellow-900/20 border border-yellow-500/50 text-yellow-400 px-4 py-3 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span>Using local data: {dashboardError}</span>
                        {dashboardLoading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                        )}
                    </div>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="Total Projects"
                    value={totalProjects.toString()}
                    icon={FolderIcon}
                    change="+5 this month"
                    changeType="positive"
                />
                <KpiCard
                    title="Total Clients"
                    value={totalClients.toString()}
                    icon={UsersIcon}
                    change="+2 this month"
                    changeType="positive"
                />
                <KpiCard
                    title="Active Projects"
                    value={activeProjects.toString()}
                    icon={DocumentTextIcon}
                    change="+1 this week"
                    changeType="positive"
                />
                <KpiCard
                    title="Total Revenue"
                    value={`$${(totalRevenue / 1000).toFixed(1)}k`}
                    icon={BanknotesIcon}
                    change="+8.5%"
                    changeType="positive"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentProjects projects={displayProjects} clients={clients} onViewAll={() => onNavigate('projects')} />
                </div>
                <div className="lg:col-span-1">
                    <DetailsCard clients={clients.slice(0, 4)} onViewAll={() => onNavigate('clients')} />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;