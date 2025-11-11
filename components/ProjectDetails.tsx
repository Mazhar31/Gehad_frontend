import React from 'react';
import { Project, Client, PaymentPlan, Department, Group } from '../types.ts';
import { CreditCardIcon, CalendarDaysIcon, ClockIcon, CheckCircleIcon, ArrowTopRightOnSquareIcon, UsersIcon, UserGroupIcon, FolderIcon, CpuChipIcon } from './icons.tsx';

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
            <p className="font-semibold text-white">{value || 'N/A'}</p>
        </div>
    </div>
);

interface ProjectDetailsProps {
    project: Project;
    client?: Client;
    department?: Department;
    plan?: PaymentPlan;
    groups?: Group[];
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, client, department, plan, groups }) => {
    const statusInfo = getStatusInfo(project.status);
    const StatusIcon = statusInfo.icon;
    const group = client?.groupId ? groups?.find(g => g.id === client.groupId) : undefined;

    const formattedPlanPrice = plan 
        ? `${plan.name} (${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: plan.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(plan.price)}/yr)`
        : 'N/A';
        
    const linkButtonText = project.projectType === 'Add-ins' ? 'Open Add-in Link' : 'View as User (Dashboard)';

    return (
        <div className="p-2 text-white">
            <div className="bg-card-bg rounded-2xl p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div>
                        <p className="text-sm text-secondary-text">{client?.company || 'Unknown Client'}</p>
                        <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <StatusIcon className={`w-6 h-6 ${statusInfo.class}`} />
                        <span className={`text-lg font-semibold ${statusInfo.class}`}>{project.status}</span>
                    </div>
                </div>
                <div className="mt-6">
                    <div className="flex justify-between text-sm text-secondary-text mb-1">
                        <span>Progress</span>
                        <span className="text-white font-semibold">{project.progress ?? 0}%</span>
                    </div>
                    <div className="w-full bg-dark-bg rounded-full h-2.5">
                        <div className="bg-accent-blue h-2.5 rounded-full" style={{ width: `${project.progress ?? 0}%` }}></div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DetailItem icon={UsersIcon} label="Client" value={client?.company} />
                <DetailItem icon={UserGroupIcon} label="Client Group" value={group?.name} />
                <DetailItem icon={CalendarDaysIcon} label="Start Date" value={project.startDate} />
                <DetailItem icon={FolderIcon} label="Department" value={department?.name} />
                <DetailItem icon={CpuChipIcon} label="Project Type" value={project.projectType} />
                <DetailItem 
                    icon={CreditCardIcon} 
                    label="Payment Plan" 
                    value={formattedPlanPrice} 
                />
            </div>

            {project.dashboardUrl && (
                <div className="mt-8 pt-6 border-t border-border-color text-center">
                    <a
                        href={project.dashboardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-pro-bg-start to-pro-bg-end text-white font-bold py-3 px-8 rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/30"
                    >
                        <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                        <span>{linkButtonText}</span>
                    </a>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;