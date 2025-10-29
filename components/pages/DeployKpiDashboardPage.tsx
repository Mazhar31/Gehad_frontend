import React, { useState, useCallback, useRef, useMemo } from 'react';
import { ArrowUpTrayIcon, XMarkIcon, CheckCircleIcon } from '../icons.tsx';
import { useData } from '../DataContext.tsx';

const DeployKpiDashboardPage: React.FC = () => {
    const { clients, projects } = useData();
    const [deployMode, setDeployMode] = useState<'project' | 'subdomain'>('project');
    
    // Project mode state
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    
    // Subdomain mode state
    const [subdomain, setSubdomain] = useState<string>('');

    // Common state
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const availableProjects = useMemo(() => {
        if (!selectedClientId) return [];
        return projects.filter(p => p.clientId === selectedClientId);
    }, [projects, selectedClientId]);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 4000);
    };

    const handleFileSelect = (selectedFile: File | null) => {
        if (selectedFile && selectedFile.name.toLowerCase().endsWith('.zip')) {
            setFile(selectedFile);
        } else if (selectedFile) {
            alert('Invalid file type. Please upload a .zip file.');
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };
    
    const canUpload = useMemo(() => {
        if (deployMode === 'project') return !!selectedClientId && !!selectedProjectId;
        if (deployMode === 'subdomain') return !!subdomain;
        return false;
    }, [deployMode, selectedClientId, selectedProjectId, subdomain]);


    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (canUpload) setIsDragging(true);
    }, [canUpload]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (canUpload) setIsDragging(true);
    }, [canUpload]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (canUpload) {
            const droppedFile = e.dataTransfer.files[0];
            handleFileSelect(droppedFile);
        }
    }, [canUpload]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        handleFileSelect(selectedFile);
    };

    const clearFile = () => {
        setFile(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        if (deployMode === 'project') {
            if (!selectedClientId || !selectedProjectId) return;
            const selectedClient = clients.find(c => c.id === selectedClientId);
            const selectedProject = projects.find(p => p.id === selectedProjectId);

            if (!selectedClient || !selectedProject) {
                showNotification('Error: Selected client or project not found.');
                return;
            }

            console.log(`Simulating deployment for: ${file.name} to ${selectedClient.company}'s project folder: ${selectedProject.name}`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            showNotification(`Dashboard "${file.name}" deployed to project "${selectedProject.name}" successfully!`);
            
            clearFile();
            setSelectedClientId('');
            setSelectedProjectId('');
        } else { // Subdomain mode
            if (!subdomain) return;
            
            console.log(`Simulating deployment of ${file.name} to subdomain: ${subdomain}.oneqlek.com`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            showNotification(`Dashboard "${file.name}" deployed to ${subdomain}.oneqlek.com successfully!`);
            
            clearFile();
            setSubdomain('');
        }
    };
    
    const getUploadPrompt = () => {
        if (deployMode === 'project') {
            if (!selectedClientId) return 'Please select a client first';
            if (!selectedProjectId) return 'Please select a project';
            return 'Drag & drop your file here';
        }
        if (deployMode === 'subdomain') {
            if (!subdomain) return 'Please enter a subdomain first';
            return 'Drag & drop your file here';
        }
        return '';
    };


    return (
        <div className="text-white">
             {notification && (
                <div className="fixed top-20 right-6 bg-accent-green text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-3">
                    <CheckCircleIcon className="w-6 h-6" />
                    <span>{notification}</span>
                </div>
            )}
            <div>
                <h2 className="text-2xl font-bold">Deploy New KPI Dashboard</h2>
                <p className="text-secondary-text mt-1">Select a deployment method, then upload a ZIP file containing the dashboard assets.</p>
            </div>
            
            <div className="flex space-x-2 my-8 border-b border-border-color">
                <button 
                    onClick={() => setDeployMode('project')}
                    className={`px-4 py-2 text-sm font-medium ${deployMode === 'project' ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-secondary-text hover:text-white'}`}
                >
                    Deploy to Project
                </button>
                <button 
                    onClick={() => setDeployMode('subdomain')}
                    className={`px-4 py-2 text-sm font-medium ${deployMode === 'subdomain' ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-secondary-text hover:text-white'}`}
                >
                    Deploy to Subdomain
                </button>
            </div>

            <div className="mt-8 max-w-2xl">
                <form onSubmit={handleSubmit}>
                    {deployMode === 'project' ? (
                        <>
                            {/* Step 1: Select Client */}
                            <div className="mb-6">
                                <label htmlFor="client-select" className="block text-sm font-medium text-secondary-text mb-2">
                                    <span className="bg-accent-blue text-xs font-bold mr-2 px-2 py-1 rounded-full">1</span>
                                    Select Client
                                </label>
                                <select
                                    id="client-select"
                                    value={selectedClientId}
                                    onChange={(e) => {
                                        setSelectedClientId(e.target.value);
                                        setSelectedProjectId(''); // Reset project on client change
                                    }}
                                    className="w-full bg-card-bg border border-border-color rounded-lg p-3 focus:ring-2 focus:ring-accent-blue focus:outline-none"
                                    required
                                >
                                    <option value="" disabled>-- Choose a client --</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>{client.company}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Step 2: Select Project */}
                            <div className={`transition-opacity duration-300 mb-6 ${!selectedClientId ? 'opacity-50' : 'opacity-100'}`}>
                                <label htmlFor="project-select" className="block text-sm font-medium text-secondary-text mb-2">
                                    <span className={`bg-accent-blue text-xs font-bold mr-2 px-2 py-1 rounded-full ${!selectedClientId ? 'bg-gray-600' : ''}`}>2</span>
                                    Select Project Folder
                                </label>
                                <select
                                    id="project-select"
                                    value={selectedProjectId}
                                    onChange={(e) => setSelectedProjectId(e.target.value)}
                                    className="w-full bg-card-bg border border-border-color rounded-lg p-3 focus:ring-2 focus:ring-accent-blue focus:outline-none disabled:cursor-not-allowed disabled:bg-dark-bg"
                                    required
                                    disabled={!selectedClientId}
                                >
                                    <option value="" disabled>-- Choose a project --</option>
                                    {availableProjects.map(project => (
                                        <option key={project.id} value={project.id}>{project.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Step 3: Upload ZIP */}
                            <div className={`transition-opacity duration-300 ${!canUpload ? 'opacity-50' : 'opacity-100'}`}>
                                <label className="block text-sm font-medium text-secondary-text mb-2">
                                    <span className={`bg-accent-blue text-xs font-bold mr-2 px-2 py-1 rounded-full ${!canUpload ? 'bg-gray-600' : ''}`}>3</span>
                                    Upload Dashboard ZIP
                                </label>
                                {/* Uploader will be rendered below */}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Step 1: Subdomain */}
                            <div className="mb-6">
                                <label htmlFor="subdomain-input" className="block text-sm font-medium text-secondary-text mb-2">
                                    <span className="bg-accent-blue text-xs font-bold mr-2 px-2 py-1 rounded-full">1</span>
                                    Enter Subdomain Address
                                </label>
                                <div className="flex items-center">
                                    <input
                                        id="subdomain-input"
                                        type="text"
                                        value={subdomain}
                                        onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                        className="w-full bg-card-bg border border-border-color rounded-l-lg p-3 focus:ring-2 focus:ring-accent-blue focus:outline-none"
                                        placeholder="my-dashboard"
                                        required
                                    />
                                    <span className="bg-dark-bg border-t border-b border-r border-border-color text-secondary-text px-4 py-3 rounded-r-lg">.oneqlek.com</span>
                                </div>
                            </div>
                            {/* Step 2: Upload */}
                            <div className={`transition-opacity duration-300 ${!canUpload ? 'opacity-50' : 'opacity-100'}`}>
                                 <label className="block text-sm font-medium text-secondary-text mb-2">
                                     <span className={`bg-accent-blue text-xs font-bold mr-2 px-2 py-1 rounded-full ${!canUpload ? 'bg-gray-600' : ''}`}>2</span>
                                     Upload Dashboard ZIP
                                </label>
                                {/* Uploader will be rendered below */}
                            </div>
                        </>
                    )}

                    {/* Common File Uploader */}
                    <div 
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => canUpload && fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors duration-300
                            ${!canUpload ? 'cursor-not-allowed' : 'cursor-pointer'}
                            ${isDragging ? 'border-accent-blue bg-accent-blue/10' : 'border-border-color hover:border-accent-blue/50'}`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleInputChange}
                            accept=".zip,application/zip,application/x-zip,application/x-zip-compressed"
                            className="hidden"
                            disabled={!canUpload}
                        />
                        <div className="flex flex-col items-center">
                            <ArrowUpTrayIcon className="w-12 h-12 text-secondary-text mb-4" />
                            <p className="font-semibold text-white">
                                {getUploadPrompt()}
                            </p>
                            <p className="text-sm text-secondary-text">
                                {canUpload ? 'or click to browse' : ''}
                            </p>
                            <p className="text-xs text-secondary-text mt-2">ZIP archive only (.zip)</p>
                        </div>
                    </div>
                    
                    {file && (
                        <div className="mt-6 bg-card-bg p-4 rounded-lg flex items-center justify-between border border-border-color">
                            <div>
                                <p className="font-semibold text-white">{file.name}</p>
                                <p className="text-sm text-secondary-text">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                            <button 
                                type="button"
                                onClick={clearFile}
                                className="p-2 text-secondary-text hover:text-white hover:bg-white/10 rounded-full"
                                aria-label="Remove file"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button 
                            type="submit"
                            disabled={!file || !canUpload}
                            className="bg-accent-blue text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300
                                       disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-600"
                        >
                            Deploy Dashboard
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeployKpiDashboardPage;