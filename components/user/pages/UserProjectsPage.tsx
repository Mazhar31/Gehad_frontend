import React, { useState } from 'react';
import { Project, Client } from '../../../types.ts';
import UserProjectDetailsPage from './UserProjectDetailsPage.tsx';
import Modal from '../../Modal.tsx';
import UserProjectCard from '../UserProjectCard.tsx';

const UserProjectsPage: React.FC<{ projects: Project[], client: Client }> = ({ projects, client }) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
    };

    const handleCloseModal = () => {
        setSelectedProject(null);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Projects for {client.company}</h1>
            <p className="text-secondary-text mb-8">Here are all the projects assigned to your company.</p>
            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <UserProjectCard key={project.id} project={project} onClick={() => handleProjectClick(project)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-card-bg rounded-2xl">
                    <h3 className="text-xl font-semibold text-white">No Projects Found</h3>
                    <p className="text-secondary-text mt-2">There are no projects currently assigned to your company.</p>
                </div>
            )}
            {selectedProject && (
                <Modal title="Project Details" onClose={handleCloseModal} size="4xl">
                    <UserProjectDetailsPage project={selectedProject} client={client}/>
                </Modal>
            )}
        </div>
    );
};

export default UserProjectsPage;
