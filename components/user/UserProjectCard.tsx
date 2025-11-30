import React from 'react';
import { Project } from '../../types.ts';
import { getSafeImageUrl } from '../../utils/imageUtils';

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
    clientName?: string;
}

const UserDashboardCard: React.FC<UserDashboardCardProps> = ({ dashboard, onClick, clientName }) => {
    // Use the uploaded dashboard image with cache-busting
    const dashboardImage = getSafeImageUrl(dashboard.imageUrl, 'project');

    return (
        <div 
            onClick={onClick}
            className="bg-card-bg p-5 rounded-2xl flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-blue/10 border border-border-color hover:border-accent-blue/50"
        >
            {/* Header: Dashboard Name & Status */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 flex-1 pr-4">
                    <h3 className="font-bold text-white text-lg">{dashboard.name}</h3>
                    {dashboard.dashboardUrl && (
                        <div className="w-2 h-2 bg-green-400 rounded-full" title="Dashboard deployed"></div>
                    )}
                </div>
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
            <div className="border-t border-border-color pt-4 text-sm mt-auto">
                <div>
                    <p className="text-xs text-secondary-text">Start Date</p>
                    <p className="font-semibold text-white">
                        {dashboard.startDate ? new Date(dashboard.startDate).toLocaleDateString() : 'Not set'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserDashboardCard;