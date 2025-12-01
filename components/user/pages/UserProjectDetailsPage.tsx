import React from 'react';
import { Project, Client } from '../../../types.ts';
import { CalendarDaysIcon, ClockIcon, CheckCircleIcon, ArrowTopRightOnSquareIcon } from '../../icons.tsx';

const getStatusInfo = (status: Project['status']) => {
    switch (status) {
        case 'Completed': return { class: 'text-accent-green', icon: CheckCircleIcon };
        case 'In Progress': return { class: 'text-accent-blue', icon: ClockIcon };
        case 'On Hold': return { class: 'text-yellow-400', icon: ClockIcon };
        default: return { class: 'text-secondary-text', icon: ClockIcon };
    }
};

interface DetailItemProps {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-4">
        <div className="bg-white/5 p-3 rounded-lg text-accent-blue">
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <p className="text-sm text-secondary-text">{label}</p>
            <p className="font-semibold text-white">{value}</p>
        </div>
    </div>
);

const UserDashboardDetailsPage: React.FC<{ dashboard: Project, client: Client }> = ({ dashboard, client }) => {
    const statusInfo = getStatusInfo(dashboard.status);
    const StatusIcon = statusInfo.icon;
    
    // Use client data from project if available, otherwise fallback to passed client
    const displayClient = dashboard.client || client;

    return (
        <div className="p-2 text-white">
            <div className="bg-card-bg rounded-2xl p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div>
                        <p className="text-sm text-secondary-text">{displayClient.company}</p>
                        <h2 className="text-2xl font-bold text-white">{dashboard.name}</h2>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <StatusIcon className={`w-6 h-6 ${statusInfo.class}`} />
                        <span className={`text-lg font-semibold ${statusInfo.class}`}>{dashboard.status}</span>
                    </div>
                </div>
                <div className="mt-6">
                    <div className="flex justify-between text-sm text-secondary-text mb-1">
                        <span>Progress</span>
                        <span className="text-white font-semibold">{dashboard.progress ?? 0}%</span>
                    </div>
                    <div className="w-full bg-dark-bg rounded-full h-2.5">
                        <div className="bg-accent-blue h-2.5 rounded-full" style={{ width: `${dashboard.progress ?? 0}%` }}></div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem icon={CalendarDaysIcon} label="Start Date" value={dashboard.startDate} />
            </div>

            {dashboard.dashboardUrl && (
                <div className="mt-8 pt-6 border-t border-border-color text-center">
                    <button
                        onClick={() => {
                            // Check if URL is external (not internal deployment)
                            const isInternalUrl = dashboard.dashboardUrl && (dashboard.dashboardUrl.startsWith('/dashboard/') || dashboard.dashboardUrl.startsWith('/addins/'));
                            
                            if (!isInternalUrl) {
                                // For external URLs, open directly
                                window.open(dashboard.dashboardUrl, '_blank');
                            } else {
                                // For internal projects, use secure session
                                const urlParts = dashboard.dashboardUrl.split('/');
                                const clientSlug = urlParts[2];
                                const projectSlug = urlParts[3];
                                
                                // Create session data
                                const sessionData = {
                                    key: `${clientSlug}-${projectSlug}`,
                                    timestamp: Date.now(),
                                    expires: Date.now() + (5 * 60 * 1000), // 5 minutes
                                    token: localStorage.getItem('auth_token')
                                };
                                
                                // Store session
                                sessionStorage.setItem('dashboard_access_session', JSON.stringify(sessionData));
                                
                                // Use the actual dashboardUrl from project
                                window.open(dashboard.dashboardUrl, '_blank');
                            }
                        }}
                        className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-pro-bg-start to-pro-bg-end text-white font-bold py-3 px-8 rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/30"
                    >
                        <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                        <span>Dashboard Access</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDashboardDetailsPage;