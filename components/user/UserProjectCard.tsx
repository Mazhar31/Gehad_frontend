import React from 'react';
import { Project } from '../../types.ts';

const getStatusClass = (status: Project['status']) => {
    switch (status) {
        case 'Completed': return 'bg-green-500/10 text-green-400';
        case 'In Progress': return 'bg-blue-500/10 text-blue-400';
        case 'On Hold': return 'bg-yellow-500/10 text-yellow-400';
        default: return 'bg-gray-500/10 text-gray-400';
    }
};

interface UserDashboardCardProps {
    dashboard: Project;
    onClick: () => void;
}

const UserDashboardCard: React.FC<UserDashboardCardProps> = ({ dashboard, onClick }) => {
    // Use the uploaded dashboard image, or a fallback if none exists.
    const dashboardImage = dashboard.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    return (
        <div 
            onClick={onClick}
            className="bg-card-bg p-5 rounded-2xl flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-blue/10 border border-border-color hover:border-accent-blue/50"
        >
            {/* Header: Dashboard Name & Status */}
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-white text-lg flex-1 pr-4">{dashboard.name}</h3>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(dashboard.status)}`}>
                    {dashboard.status}
                </div>
            </div>
            
            {/* Embedded Dashboard Image */}
            <div className="aspect-video bg-dark-bg rounded-lg overflow-hidden my-2 flex-grow">
                <img 
                    src={dashboardImage}
                    alt={`${dashboard.name} dashboard preview`}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Footer: Dates */}
            <div className="border-t border-border-color pt-4 flex items-center text-sm mt-auto">
                <div>
                    <p className="text-xs text-secondary-text">Start Date</p>
                    <p className="font-semibold text-white">{dashboard.startDate}</p>
                </div>
            </div>
        </div>
    );
};

export default UserDashboardCard;