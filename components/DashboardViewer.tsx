import React, { useEffect, useState, useCallback } from 'react';
import { useData } from './DataContext.tsx';
import { clientAPI, projectAPI, authAPI } from '../services/api';

interface DashboardViewerProps {
    clientName: string;
    projectName: string;
}

const DashboardViewer: React.FC<DashboardViewerProps> = ({ clientName, projectName }) => {
    const { projects, clients, currentUser, userRole } = useData();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
    const [dataLoaded, setDataLoaded] = useState(false);

    const validateAccess = useCallback(async (clientsToUse: any[], projectsToUse: any[], userToUse: any) => {
        console.log('🔍 Validating access for:', { clientName, projectName });
        console.log('📊 Available clients:', clientsToUse.map(c => ({ id: c.id, company: c.company })));
        console.log('📋 Available projects:', projectsToUse.map(p => ({ id: p.id, name: p.name, clientId: p.clientId })));
            
        // Helper function to create slug (same as backend)
        const createSlug = (name: string) => {
            return name.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/-+/g, '-') // Replace multiple hyphens with single
                .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
        };
            
        // Find client by slug matching or by user's client ID
        let client = clientsToUse.find(c => {
            const clientSlug = createSlug(c.company);
            console.log(`🏢 Comparing client: "${c.company}" → "${clientSlug}" vs "${clientName}"`);
            return clientSlug === clientName.toLowerCase();
        });

        // If not found and user has client_id, try to match by ID
        if (!client && userToUse?.client_id) {
            client = clientsToUse.find(c => c.id === userToUse.client_id);
            if (client) {
                console.log('🏢 Found client by user client_id:', client.company || client.id);
            }
        }

        if (!client) {
            console.error('❌ Client not found. Available client slugs:', 
                clientsToUse.map(c => ({ company: c.company, slug: createSlug(c.company) })));
            setError(`Client not found. Looking for: "${clientName}"`);
            setLoading(false);
            return;
        }

        console.log('✅ Client found:', client.company);

        // Find project by slug and client
        const project = projectsToUse.find(p => {
            if (p.clientId !== client.id) return false;
            const projectSlug = createSlug(p.name);
            console.log(`📋 Comparing project: "${p.name}" → "${projectSlug}" vs "${projectName}"`);
            return projectSlug === projectName.toLowerCase();
        });

        if (!project) {
            console.error('❌ Project not found. Available project slugs for client:', 
                projectsToUse.filter(p => p.clientId === client.id).map(p => ({ name: p.name, slug: createSlug(p.name) })));
            setError(`Project not found. Looking for: "${projectName}" under client "${client.company}"`);
            setLoading(false);
            return;
        }

        console.log('✅ Project found:', project.name);

        // Check if project has a deployed dashboard
        if (!project.dashboardUrl) {
            setError('No dashboard deployed for this project');
            setLoading(false);
            return;
        }

        // Check user access permissions
        const effectiveUserRole = userToUse?.user_type || userRole;
        if (effectiveUserRole === 'user') {
            // Regular users can only access projects they're assigned to
            const userProjectIds = userToUse?.project_ids || userToUse?.projectIds || [];
            if (!userProjectIds.includes(project.id)) {
                setError('Access denied: You are not assigned to this project');
                setLoading(false);
                return;
            }

            // Also check if user belongs to the same client
            const userClientId = userToUse?.client_id || userToUse?.clientId;
            if (userClientId !== client.id) {
                setError('Access denied: Project belongs to different client');
                setLoading(false);
                return;
            }
        }

        // If all checks pass, set the dashboard URL
        console.log('✅ Dashboard URL from project:', project.dashboardUrl);
        setDashboardUrl(project.dashboardUrl);
        setLoading(false);
    }, [clientName, projectName, userRole]);

    useEffect(() => {
        const loadDataAndValidate = async () => {
            if (dataLoaded) return; // Prevent multiple loads
            
            // Session validation is now handled in Router.tsx
            // This component only loads if session is valid
            
            // Check if user is logged in by checking for auth token
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                setError('Please log in to access dashboards');
                setLoading(false);
                return;
            }

            console.log('🔑 Auth token found, proceeding with data loading...');

            let effectiveClients = clients;
            let effectiveProjects = projects;
            let effectiveCurrentUser = currentUser;

            // If data not loaded from context, load directly
            if (clients.length === 0 || projects.length === 0 || !currentUser) {
                console.log('📡 Loading data directly...');
                try {
                    // Get current user info
                    if (!effectiveCurrentUser) {
                        const userResponse = await authAPI.getCurrentUser();
                        effectiveCurrentUser = userResponse.data || userResponse;
                    }

                    // Load clients and projects based on user role
                    if (effectiveClients.length === 0) {
                        try {
                            const clientsData = await clientAPI.getAll();
                            effectiveClients = clientsData;
                        } catch (error) {
                            console.log('Failed to load all clients, user might not have admin access');
                            // For regular users, we'll get client info from user data
                        }
                    }

                    if (effectiveProjects.length === 0) {
                        try {
                            // Try to get all projects first (admin)
                            const projectsData = await projectAPI.getAll();
                            effectiveProjects = projectsData;
                        } catch (error) {
                            console.log('Failed to load all projects, trying user projects...');
                            try {
                                // Fallback to user projects
                                const userProjectsData = await projectAPI.getUserProjects();
                                effectiveProjects = userProjectsData;
                            } catch (userError) {
                                console.error('Failed to load user projects:', userError);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Failed to load data:', error);
                    setError('Failed to load dashboard data. Please try logging in again.');
                    setLoading(false);
                    return;
                }
            }

            // If user doesn't have client data but has a clientId, create minimal client data
            if (effectiveClients.length === 0 && effectiveCurrentUser?.client_id) {
                console.log('Creating minimal client data from user info');
                const minimalClient = {
                    id: effectiveCurrentUser.client_id,
                    company: 'User Client', // This will be overridden by slug matching
                };
                effectiveClients = [minimalClient];
            }

            if (effectiveClients.length === 0 || effectiveProjects.length === 0) {
                console.log('⏳ Still waiting for data...', { 
                    clientsCount: effectiveClients.length, 
                    projectsCount: effectiveProjects.length,
                    currentUser: !!effectiveCurrentUser 
                });
                // Don't return here, let it continue to prevent infinite loops
            }

            setDataLoaded(true);
            await validateAccess(effectiveClients, effectiveProjects, effectiveCurrentUser);
        };

        loadDataAndValidate();
    }, [clientName, projectName, projects, clients, currentUser, userRole, dataLoaded, validateAccess]);



    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-bg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-lime mx-auto mb-4"></div>
                    <p className="text-white">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-bg">
                <div className="text-center">
                    <div className="text-red-400 text-xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-white mb-2">Dashboard Access Error</h2>
                    <p className="text-secondary-text mb-4">{error}</p>
                    <button 
                        onClick={() => window.history.back()}
                        className="bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Load the actual dashboard in an iframe with auth token
    const authToken = localStorage.getItem('auth_token');
    // Use the actual dashboard URL from the project instead of constructing from slugs
    const dashboardPath = dashboardUrl || `/dashboard/${clientName}/${projectName}`;
    const dashboardSrc = `http://localhost:8000/api/admin/deploy${dashboardPath}?token=${encodeURIComponent(authToken || '')}`;
    
    console.log('🎯 Loading dashboard from:', dashboardSrc);
    
    return (
        <div className="min-h-screen bg-dark-bg">
            <div className="bg-card-bg border-b border-border-color p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">
                            {projectName.replace(/-/g, ' ')} Dashboard
                        </h1>
                        <p className="text-secondary-text">
                            Client: {clientName.replace(/-/g, ' ')}
                        </p>
                    </div>
                    <button 
                        onClick={() => {
                            // Check if user is admin or regular user
                            const userRole = localStorage.getItem('user_role');
                            if (userRole === 'user') {
                                // Close the tab for users
                                window.close();
                            } else {
                                // Navigate back for admin
                                window.history.back();
                            }
                        }}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                        {localStorage.getItem('user_role') === 'user' ? 'Back to User Dashboard' : 'Back to Projects'}
                    </button>
                </div>
            </div>
            
            <div className="h-full">
                <iframe
                    src={dashboardSrc}
                    className="w-full h-screen border-0"
                    title={`${projectName} Dashboard`}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    onError={() => setError('Failed to load dashboard')}
                />
            </div>
        </div>
    );
};

export default DashboardViewer;