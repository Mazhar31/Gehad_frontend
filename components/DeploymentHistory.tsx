import React, { useState, useEffect } from 'react';
import { deployAPI } from '../services/api';

interface Deployment {
    id: string;
    project_id: string;
    deployment_status: 'pending' | 'success' | 'failed';
    deployed_at: string;
    deployment_url?: string;
    error_message?: string;
    file_count?: number;
}

interface DeploymentHistoryProps {
    projectId: string;
}

const DeploymentHistory: React.FC<DeploymentHistoryProps> = ({ projectId }) => {
    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDeploymentHistory();
    }, [projectId]);

    const loadDeploymentHistory = async () => {
        try {
            // Note: This would require a new API endpoint to get deployment history
            // For now, we'll show a placeholder
            setDeployments([]);
        } catch (error) {
            console.error('Failed to load deployment history:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'text-green-400';
            case 'failed': return 'text-red-400';
            case 'pending': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success': return '✅';
            case 'failed': return '❌';
            case 'pending': return '⏳';
            default: return '❓';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-blue"></div>
                <span className="ml-2 text-secondary-text">Loading deployment history...</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Deployment History</h3>
            
            {deployments.length === 0 ? (
                <div className="text-center py-8 bg-card-bg rounded-lg border border-border-color">
                    <p className="text-secondary-text">No deployment history available</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {deployments.map((deployment) => (
                        <div key={deployment.id} className="bg-card-bg p-4 rounded-lg border border-border-color">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-xl">{getStatusIcon(deployment.deployment_status)}</span>
                                    <div>
                                        <p className={`font-medium ${getStatusColor(deployment.deployment_status)}`}>
                                            {deployment.deployment_status.charAt(0).toUpperCase() + deployment.deployment_status.slice(1)}
                                        </p>
                                        <p className="text-sm text-secondary-text">
                                            {new Date(deployment.deployed_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    {deployment.file_count && (
                                        <p className="text-sm text-secondary-text">
                                            {deployment.file_count} files deployed
                                        </p>
                                    )}
                                    {deployment.deployment_url && (
                                        <p className="text-sm text-accent-blue">
                                            {deployment.deployment_url}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            {deployment.error_message && (
                                <div className="mt-3 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                                    <p className="text-red-400 text-sm">{deployment.error_message}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeploymentHistory;