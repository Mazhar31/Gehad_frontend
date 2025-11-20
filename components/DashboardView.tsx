import React, { useEffect, useState } from 'react';

const DashboardView: React.FC = () => {
    const [clientName, setClientName] = useState<string>('');
    const [projectName, setProjectName] = useState<string>('');
    
    useEffect(() => {
        // Extract client and project names from URL path
        const path = window.location.pathname;
        const match = path.match(/^\/([^\/]+)\/([^\/]+)$/);
        if (match) {
            setClientName(decodeURIComponent(match[1]));
            setProjectName(decodeURIComponent(match[2]));
        }
    }, []);

    useEffect(() => {
        // Check if user is accessing directly without proper authentication
        const token = localStorage.getItem('auth_token');
        const userRole = localStorage.getItem('user_role');
        
        if (!token || !userRole) {
            // Redirect to main frontend if no authentication
            window.location.href = window.location.origin;
            return;
        }
    }, []);

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard In Progress</h1>
                    <p className="text-secondary-text text-lg mb-4">
                        {clientName && projectName ? 
                            `${clientName} - ${projectName}` : 
                            'Loading dashboard...'
                        }
                    </p>
                    <p className="text-secondary-text">
                        This dashboard is currently being developed and will be available soon.
                    </p>
                </div>
                
                <div className="bg-card-bg rounded-lg p-6 max-w-md mx-auto">
                    <h3 className="text-white font-semibold mb-2">What's Coming:</h3>
                    <ul className="text-secondary-text text-sm space-y-1">
                        <li>• Interactive data visualizations</li>
                        <li>• Real-time analytics</li>
                        <li>• Custom reporting features</li>
                        <li>• Performance metrics</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;