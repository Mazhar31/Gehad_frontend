import React from 'react';
// FIX: Added file extension to import to resolve module error.
import KpiCard from '../StockCard.tsx';
// FIX: Added file extension to import to resolve module error.
import DetailsCard from '../DetailsCard.tsx';
// FIX: Added file extension to import to resolve module error.
import RecentProjects from '../RecentProjects.tsx';
import { useData } from '../DataContext.tsx';
// FIX: Added file extension to import to resolve module error.
import { FolderIcon, UsersIcon, DocumentTextIcon, BanknotesIcon } from '../icons.tsx';

interface DashboardPageProps {
    onNavigate: (page: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
    const { projects, clients, invoices } = useData();

    if (!projects || !clients || !invoices) {
        return <div>Loading...</div>;
    }

    const totalProjects = projects.length;
    const totalClients = clients.length;
    const pendingInvoices = invoices.filter(inv => inv.status === 'Pending').length;
    const totalRevenue = invoices
        .filter(inv => inv.status === 'Paid')
        // FIX: Calculated total revenue by summing up items from each invoice, as 'amount' property does not exist on Invoice type.
        .reduce((sum, inv) => sum + inv.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0), 0);

    return (
        <div className="space-y-6">
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
                    title="Pending Invoices"
                    value={pendingInvoices.toString()}
                    icon={DocumentTextIcon}
                    change="+1 this week"
                    changeType="negative"
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
                    <RecentProjects projects={projects.slice(0, 5)} clients={clients} onViewAll={() => onNavigate('projects')} />
                </div>
                <div className="lg:col-span-1">
                    <DetailsCard clients={clients.slice(0, 4)} onViewAll={() => onNavigate('clients')} />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;