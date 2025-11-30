import React, { useState } from 'react';
import { Project, PaymentPlan } from '../types.ts';
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from './icons.tsx';

const getStatusClass = (status: Project['status']) => {
    switch (status) {
        case 'Completed': return 'bg-green-500/10 text-green-400';
        case 'In Progress': return 'bg-blue-500/10 text-blue-400';
        case 'On Hold': return 'bg-yellow-500/10 text-yellow-400';
        default: return 'bg-gray-500/10 text-gray-400';
    }
};

interface ProjectCardProps {
    project: Project;
    clientCompany: string;
    plan?: PaymentPlan;
    onEdit: () => void;
    onDelete: () => void;
    onViewDetails: () => void;
    onDeleteDashboard?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, clientCompany, plan, onEdit, onDelete, onViewDetails, onDeleteDashboard }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    
    const handleDeleteDashboard = async () => {
        if (onDeleteDashboard && window.confirm('Are you sure you want to remove the dashboard deployment for this project?')) {
            onDeleteDashboard();
        }
    };
    
    const progress = project.progress ?? 0;
    
    const formattedPlanPrice = plan
        ? `${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: plan.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(plan.price)}/yr`
        : 'N/A';

    return (
        <div 
            onClick={onViewDetails}
            className="bg-card-bg p-5 rounded-2xl flex flex-col justify-between space-y-4 relative cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-blue/10 border border-transparent hover:border-accent-blue/50"
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-secondary-text">{clientCompany}</p>
                    <h3 className="font-bold text-white text-lg">{project.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(project.status)}`}>
                        {project.status}
                    </div>
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 rounded-full text-secondary-text hover:bg-white/10">
                            <EllipsisVerticalIcon className="w-5 h-5" />
                        </button>
                        {menuOpen && (
                             <div className="absolute right-0 mt-2 w-32 bg-sidebar-bg border border-border-color rounded-md shadow-lg z-10">
                                <a href="#" onClick={(e) => { e.preventDefault(); onEdit(); setMenuOpen(false); }} className="flex items-center px-4 py-2 text-sm text-secondary-text hover:bg-white/10 hover:text-white">
                                    <PencilSquareIcon className="w-4 h-4 mr-2" /> Edit
                                </a>
                                {project.dashboardUrl && (
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteDashboard(); setMenuOpen(false); }} className="flex items-center px-4 py-2 text-sm text-secondary-text hover:bg-white/10 hover:text-white">
                                        <TrashIcon className="w-4 h-4 mr-2" /> Remove Dashboard
                                    </a>
                                )}
                                <a href="#" onClick={(e) => { e.preventDefault(); onDelete(); setMenuOpen(false); }} className="flex items-center px-4 py-2 text-sm text-secondary-text hover:bg-white/10 hover:text-white">
                                    <TrashIcon className="w-4 h-4 mr-2" /> Delete Project
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div>
                <div className="flex justify-between text-xs text-secondary-text mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-2">
                    <div className="bg-accent-blue h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="border-t border-border-color pt-4 flex justify-between items-center text-sm">
                <div>
                    <p className="text-xs text-secondary-text">Plan Price</p>
                    <p className="font-semibold text-white">{formattedPlanPrice}</p>
                </div>
                <div>
                    <p className="text-xs text-secondary-text">Start Date</p>
                    <p className="font-semibold text-white">{project.startDate}</p>
                </div>
                <div className="flex items-center">
                    {project.dashboardUrl ? (
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-green-400">Dashboard</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span className="text-xs text-gray-400">No Dashboard</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;