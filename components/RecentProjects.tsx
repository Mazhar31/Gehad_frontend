import React from 'react';
// FIX: Added file extension to import to resolve module error.
import { Project, Client } from '../types.ts';

const getStatusClass = (status: Project['status']) => {
    switch (status) {
        case 'Completed': return 'bg-green-500/10 text-green-400';
        case 'In Progress': return 'bg-blue-500/10 text-blue-400';
        case 'On Hold': return 'bg-yellow-500/10 text-yellow-400';
        default: return 'bg-gray-500/10 text-gray-400';
    }
};

interface RecentProjectsProps {
    projects: Project[];
    clients: Client[];
    onViewAll: () => void;
}

const RecentProjects: React.FC<RecentProjectsProps> = ({ projects, clients, onViewAll }) => {
  return (
    <div className="bg-card-bg p-4 sm:p-6 rounded-2xl h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Recent Projects</h3>
        <button onClick={onViewAll} className="text-sm text-accent-blue hover:underline">View All</button>
      </div>
      <div className="space-y-4">
        {projects.map((project) => {
          const client = clients.find(c => c.id === project.clientId);
          const clientCompany = client ? client.company : 'Unknown Client';
          return (
            <div key={project.id} className="grid grid-cols-2 gap-4 items-center text-sm transition-colors duration-200 hover:bg-white/5 p-2 rounded-lg">
              <div className="col-span-1">
                <p className="font-semibold text-white truncate">{project.name}</p>
                <p className="text-xs text-secondary-text">{clientCompany}</p>
              </div>
              <div className="col-span-1 flex justify-end">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentProjects;