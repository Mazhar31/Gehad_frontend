import React from 'react';
import { Project } from '../../types.ts';
import { ArrowTopRightOnSquareIcon } from '../icons.tsx';

const UserAddinCard: React.FC<{ addin: Project }> = ({ addin }) => {
    const addinImage = addin.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop';

    return (
        <div 
            onClick={() => {
                if (!addin.dashboardUrl) return;
                
                // Check if URL is external (not internal deployment)
                const isInternalUrl = addin.dashboardUrl && (addin.dashboardUrl.startsWith('/dashboard/') || addin.dashboardUrl.startsWith('/addins/'));
                
                if (!isInternalUrl) {
                    // For external URLs, open directly
                    window.open(addin.dashboardUrl, '_blank');
                } else {
                    // For internal projects, use secure session
                    const urlParts = addin.dashboardUrl.split('/');
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
                    window.open(addin.dashboardUrl, '_blank');
                }
            }}
            className="block bg-card-bg rounded-2xl overflow-hidden group transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent-blue/20 border border-border-color hover:border-accent-blue/50 cursor-pointer"
        >
            <div className="aspect-video relative">
                <img src={addinImage} alt={addin.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-bold text-white text-lg">{addin.name}</h3>
                </div>
                <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <ArrowTopRightOnSquareIcon className="w-5 h-5 text-white" />
                </div>
            </div>
        </div>
    );
};

export default UserAddinCard;