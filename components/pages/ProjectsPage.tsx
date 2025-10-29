import React, { useState, useMemo, useRef } from 'react';
// FIX: Added file extension to import to resolve module error.
import { Project, PaymentPlan } from '../../types.ts';
// FIX: Added file extension to import to resolve module error.
import ProjectCard from '../ProjectCard.tsx';
// FIX: Added file extension to import to resolve module error.
import Modal from '../Modal.tsx';
// FIX: Added file extension to import to resolve module error.
import { PlusIcon, MagnifyingGlassIcon } from '../icons.tsx';
import { useData } from '../DataContext.tsx';
// FIX: Added file extension to import to resolve module error.
import ProjectDetails from '../ProjectDetails.tsx';

const ProjectsPage: React.FC = () => {
    const { projects, clients, departments, paymentPlans, groups, handleSaveProject, handleDeleteProject } = useData();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClientId, setFilterClientId] = useState('All');

    if (!projects || !clients || !departments || !paymentPlans || !groups || !handleSaveProject || !handleDeleteProject) {
        return <div>Loading...</div>
    }

    const handleOpenEditModal = (project?: Project) => {
        setSelectedProject(project || null);
        setIsEditModalOpen(true);
    };

    const handleOpenDetailsModal = (project: Project) => {
        setSelectedProject(project);
        setIsDetailsModalOpen(true);
    };

    const handleCloseModals = () => {
        setSelectedProject(null);
        setIsEditModalOpen(false);
        setIsDetailsModalOpen(false);
    };

    const onSave = (projectData: Project) => {
        handleSaveProject(projectData);
        handleCloseModals();
    };

    const onDelete = (projectId: string) => {
        handleDeleteProject(projectId);
    };

    const filteredProjects = useMemo(() => {
        return projects
            .filter(project => {
                const clientMatch = filterClientId === 'All' || project.clientId === filterClientId;
                const searchMatch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
                return clientMatch && searchMatch;
            });
    }, [projects, searchTerm, filterClientId]);


    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white">Projects</h2>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                     <div className="relative w-full sm:w-auto">
                        <input
                            type="search"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-card-bg text-white placeholder-secondary-text rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-accent-blue w-full sm:w-64"
                        />
                        <MagnifyingGlassIcon className="w-5 h-5 text-secondary-text absolute top-1/2 left-3 transform -translate-y-1/2" />
                    </div>
                    <select
                        value={filterClientId}
                        onChange={(e) => setFilterClientId(e.target.value)}
                        className="bg-card-bg text-white placeholder-secondary-text rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent-blue w-full sm:w-auto"
                        aria-label="Filter by client"
                    >
                        <option value="All">All Clients</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.company}</option>
                        ))}
                    </select>
                    <button 
                        onClick={() => handleOpenEditModal()}
                        className="flex items-center space-x-2 bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto justify-center flex-shrink-0"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>New Project</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                    const client = clients.find(c => c.id === project.clientId);
                    const plan = paymentPlans.find(p => p.id === project.planId);
                    const clientCompany = client ? client.company : 'Unknown Client';
                    return (
                        <ProjectCard 
                            key={project.id} 
                            project={project}
                            clientCompany={clientCompany}
                            plan={plan}
                            onEdit={() => handleOpenEditModal(project)}
                            onDelete={() => onDelete(project.id)}
                            onViewDetails={() => handleOpenDetailsModal(project)}
                        />
                    );
                })}
            </div>

            {isEditModalOpen && (
                <Modal title={selectedProject ? 'Edit Project' : 'Add New Project'} onClose={handleCloseModals}>
                    <ProjectForm 
                        project={selectedProject} 
                        onSave={onSave} 
                        onCancel={handleCloseModals}
                        clients={clients}
                        departments={departments}
                        paymentPlans={paymentPlans}
                    />
                </Modal>
            )}

            {isDetailsModalOpen && selectedProject && (
                <Modal title="Project Details" onClose={handleCloseModals} size="4xl">
                    <ProjectDetails 
                        project={selectedProject}
                        client={clients.find(c => c.id === selectedProject.clientId)}
                        department={departments.find(d => d.id === selectedProject.departmentId)}
                        plan={paymentPlans.find(p => p.id === selectedProject.planId)}
                        groups={groups}
                    />
                </Modal>
            )}
        </div>
    );
};

// A simple form component for the modal
const ProjectForm: React.FC<{
    project: Project | null;
    onSave: (project: Project) => void;
    onCancel: () => void;
    clients: any[];
    departments: any[];
    paymentPlans: any[];
}> = ({ project, onSave, onCancel, clients, departments, paymentPlans }) => {
    const [formData, setFormData] = useState({
        name: project?.name || '',
        clientId: project?.clientId || '',
        planId: project?.planId || '',
        departmentId: project?.departmentId || '',
        status: project?.status || 'In Progress',
        startDate: project?.startDate || new Date().toISOString().slice(0, 10),
        dashboardUrl: project?.dashboardUrl || '',
        imageUrl: project?.imageUrl || '',
        projectType: project?.projectType || 'Dashboard',
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await toBase64(file);
            setFormData(prev => ({ ...prev, imageUrl: base64 }));
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            // The currency will be set in the DataContext based on the planId
            ...project, // Pass existing project data like id, budget, progress
            ...formData,
            id: project?.id || '',
            status: formData.status as Project['status'],
            projectType: formData.projectType as Project['projectType'],
            currency: project?.currency || 'USD', // Placeholder, will be overwritten
        } as Project);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-2">Project Image</label>
                <div className="flex items-center gap-x-4">
                    <img 
                        src={formData.imageUrl || 'https://storage.googleapis.com/aistudio-hosting/generative-ai-studio/assets/app-placeholder.png'} 
                        alt="Project Preview" 
                        className="h-24 w-24 object-cover rounded-lg bg-dark-bg border border-border-color" 
                    />
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                    >
                        Change Image
                    </button>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Project Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Website / Dashboard URL</label>
                <input type="url" name="dashboardUrl" value={formData.dashboardUrl} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" placeholder="https://example.com" />
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Project Type</label>
                <select name="projectType" value={formData.projectType} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required>
                    <option value="Dashboard">Dashboard</option>
                    <option value="Add-ins">Add-ins</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Client</label>
                <select name="clientId" value={formData.clientId} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required>
                    <option value="">Select a client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Department</label>
                <select name="departmentId" value={formData.departmentId} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required>
                    <option value="">Select a department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Payment Plan</label>
                <select name="planId" value={formData.planId} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required>
                    <option value="">Select a plan</option>
                    {paymentPlans.map(p => {
                        const formattedPrice = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: p.currency,
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }).format(p.price);
                        return <option key={p.id} value={p.id}>{p.name} - {formattedPrice}/yr</option>
                    })}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700">Cancel</button>
                <button type="submit" className="bg-accent-blue px-4 py-2 rounded-lg hover:bg-blue-600">Save</button>
            </div>
        </form>
    );
};

export default ProjectsPage;