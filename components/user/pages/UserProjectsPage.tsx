import React, { useState, useMemo } from 'react';
import { Project, Client } from '../../../types.ts';
import UserDashboardDetailsPage from './UserProjectDetailsPage.tsx';
import Modal from '../../Modal.tsx';
import UserDashboardCard from '../UserProjectCard.tsx';
import { MagnifyingGlassIcon } from '../../icons.tsx';

const UserDashboardsPage: React.FC<{ dashboards: Project[], client: Client }> = ({ dashboards, client }) => {
    const [selectedDashboard, setSelectedDashboard] = useState<Project | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const handleDashboardClick = (dashboard: Project) => {
        setSelectedDashboard(dashboard);
    };

    const handleCloseModal = () => {
        setSelectedDashboard(null);
    };

    const filteredDashboards = useMemo(() => {
        return dashboards.filter(dashboard => {
            const statusMatch = filterStatus === 'All' || dashboard.status === filterStatus;
            const searchMatch = dashboard.name.toLowerCase().includes(searchTerm.toLowerCase());
            return statusMatch && searchMatch;
        });
    }, [dashboards, searchTerm, filterStatus]);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboards for {client.company}</h1>
                    <p className="text-secondary-text">Here are all the dashboards assigned to your company.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="search"
                            placeholder="Search dashboards..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-card-bg text-white placeholder-secondary-text rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-accent-blue w-full sm:w-64"
                        />
                        <MagnifyingGlassIcon className="w-5 h-5 text-secondary-text absolute top-1/2 left-3 transform -translate-y-1/2" />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-card-bg text-white placeholder-secondary-text rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent-blue w-full sm:w-auto"
                        aria-label="Filter by status"
                    >
                        <option value="All">All Statuses</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                    </select>
                </div>
            </div>

            {filteredDashboards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDashboards.map(dashboard => (
                        <UserDashboardCard key={dashboard.id} dashboard={dashboard} onClick={() => handleDashboardClick(dashboard)} />
                    ))}
                </div>
            ) : dashboards.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-lime"></div>
                    <p className="text-white ml-4">Loading your dashboards...</p>
                </div>
            ) : (
                <div className="text-center py-16 bg-card-bg rounded-2xl">
                    <h3 className="text-xl font-semibold text-white">No Dashboards Found</h3>
                    <p className="text-secondary-text mt-2">Your search or filter criteria returned no results.</p>
                </div>
            )}
            {selectedDashboard && (
                <Modal title="Dashboard Details" onClose={handleCloseModal} size="4xl">
                    <UserDashboardDetailsPage dashboard={selectedDashboard} client={client}/>
                </Modal>
            )}
        </div>
    );
};

export default UserDashboardsPage;