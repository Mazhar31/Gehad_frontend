import React, { useState, useCallback, useRef } from 'react';
import { ArrowUpTrayIcon, XMarkIcon, CheckCircleIcon } from '../icons.tsx';
import { useData } from '../DataContext.tsx';

const DeployKpiDashboardPage: React.FC = () => {
    const { clients } = useData();
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 4000);
    };

    const handleFileSelect = (selectedFile: File | null) => {
        // FIX: Switched from checking MIME type to file extension for better reliability across browsers.
        if (selectedFile && selectedFile.name.toLowerCase().endsWith('.zip')) {
            setFile(selectedFile);
        } else if (selectedFile) {
            alert('Invalid file type. Please upload a .zip file.');
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    // FIX: Added onDragEnter handler. Browsers require both dragenter and dragover events to be cancelled for drop to work.
    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (selectedClientId) setIsDragging(true);
    }, [selectedClientId]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (selectedClientId) setIsDragging(true);
    }, [selectedClientId]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (selectedClientId) {
            const droppedFile = e.dataTransfer.files[0];
            handleFileSelect(droppedFile);
        }
    }, [selectedClientId]);

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
        if (!file || !selectedClientId) return;
        
        const selectedClient = clients.find(c => c.id === selectedClientId);
        if (!selectedClient) {
            showNotification('Error: Selected client not found.');
            return;
        }

        console.log(`Simulating deployment for: ${file.name} to ${selectedClient.company}'s folder`);

        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showNotification(`Dashboard "${file.name}" deployed to ${selectedClient.company} successfully!`);
        clearFile();
        setSelectedClientId('');
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
                <p className="text-secondary-text mt-1">Select a client and upload a ZIP file containing the dashboard assets.</p>
            </div>

            <div className="mt-8 max-w-2xl">
                <form onSubmit={handleSubmit}>
                    {/* Step 1: Select Client */}
                    <div className="mb-6">
                        <label htmlFor="client-select" className="block text-sm font-medium text-secondary-text mb-2">
                            <span className="bg-accent-blue text-xs font-bold mr-2 px-2 py-1 rounded-full">1</span>
                            Select Client Folder
                        </label>
                        <select
                            id="client-select"
                            value={selectedClientId}
                            onChange={(e) => setSelectedClientId(e.target.value)}
                            className="w-full bg-card-bg border border-border-color rounded-lg p-3 focus:ring-2 focus:ring-accent-blue focus:outline-none"
                            required
                        >
                            <option value="" disabled>-- Choose a client --</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.company}</option>
                            ))}
                        </select>
                    </div>

                    {/* Step 2: Upload ZIP */}
                    <div className={`transition-opacity duration-300 ${!selectedClientId ? 'opacity-50' : 'opacity-100'}`}>
                         <label className="block text-sm font-medium text-secondary-text mb-2">
                             <span className={`bg-accent-blue text-xs font-bold mr-2 px-2 py-1 rounded-full ${!selectedClientId ? 'bg-gray-600' : ''}`}>2</span>
                             Upload Dashboard ZIP
                        </label>
                        <div 
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => selectedClientId && fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors duration-300
                                ${!selectedClientId ? 'cursor-not-allowed' : 'cursor-pointer'}
                                ${isDragging ? 'border-accent-blue bg-accent-blue/10' : 'border-border-color hover:border-accent-blue/50'}`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleInputChange}
                                accept=".zip,application/zip,application/x-zip,application/x-zip-compressed"
                                className="hidden"
                                disabled={!selectedClientId}
                            />
                            <div className="flex flex-col items-center">
                                <ArrowUpTrayIcon className="w-12 h-12 text-secondary-text mb-4" />
                                <p className="font-semibold text-white">
                                    {selectedClientId ? 'Drag & drop your file here' : 'Please select a client first'}
                                </p>
                                <p className="text-sm text-secondary-text">
                                     {selectedClientId ? 'or click to browse' : ''}
                                </p>
                                <p className="text-xs text-secondary-text mt-2">ZIP archive only (.zip)</p>
                            </div>
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
                            disabled={!file || !selectedClientId}
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