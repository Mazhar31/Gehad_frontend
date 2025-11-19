import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, Client, Project } from '../../types.ts';
import Modal from '../Modal.tsx';
import UserCard from '../UserCard.tsx';
import { PlusIcon, MagnifyingGlassIcon, ArrowDownTrayIcon } from '../icons.tsx';
import { useData } from '../DataContext.tsx';

const UserManagementPage: React.FC = () => {
    const { users, clients, projects, handleSaveUser, handleDeleteUser } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClientId, setFilterClientId] = useState('All');

    if (!users || !clients || !projects || !handleSaveUser || !handleDeleteUser) {
        return <div>Loading...</div>;
    }

    const handleOpenModal = (user?: User) => {
        setEditingUser(user || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingUser(null);
        setIsModalOpen(false);
    };

    const onSave = async (userData: User & { accountType?: 'admin' | 'user' }) => {
        try {
            await handleSaveUser(userData);
            if (userData.accountType === 'admin' && !userData.id) {
                // Show success message for admin account creation
                alert('Admin account created successfully! The admin can now log in using the admin login.');
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const onDelete = (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            handleDeleteUser(userId);
        }
    };
    
    const getClientCompany = (clientId: string) => {
        const client = clients.find(c => c.id === clientId);
        return client?.company || 'No Client Assigned';
    };

    const handleExportEmails = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "email\n" // CSV header
            + users.map(u => u.email).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "user_emails.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const clientMatch = filterClientId === 'All' || user.clientId === filterClientId;
            const searchMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            return clientMatch && searchMatch;
        });
    }, [users, searchTerm, filterClientId]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                 <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="search"
                            placeholder="Search by name or email..."
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
                        onClick={handleExportEmails}
                        className="flex items-center space-x-2 bg-accent-teal text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors w-full sm:w-auto justify-center flex-shrink-0"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        <span>Export Emails</span>
                    </button>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="flex items-center space-x-2 bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto justify-center flex-shrink-0"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>New User</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredUsers.map((user) => (
                    <UserCard 
                        key={user.id} 
                        user={user}
                        clientCompany={getClientCompany(user.clientId)}
                        projectsCount={user.projectIds?.length || 0}
                        onEdit={() => handleOpenModal(user)}
                        onDelete={() => onDelete(user.id)}
                    />
                ))}
            </div>

            {isModalOpen && (
                <Modal title={editingUser ? 'Edit User' : 'Add New User'} onClose={handleCloseModal}>
                    <UserForm 
                        user={editingUser} 
                        onSave={onSave} 
                        onCancel={handleCloseModal}
                        clients={clients}
                        projects={projects}
                    />
                </Modal>
            )}
        </div>
    );
};

// Form component for adding/editing users
const UserForm: React.FC<{
    user: User | null;
    onSave: (user: User) => void;
    onCancel: () => void;
    clients: Client[];
    projects: Project[];
}> = ({ user, onSave, onCancel, clients, projects }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        position: user?.position || '',
        clientId: user?.clientId || '',
        password: '',
        role: user?.role || 'normal',
        dashboardAccess: user?.dashboardAccess || 'view-only',
        projectIds: user?.projectIds || [] as string[],
        accountType: 'user' as 'admin' | 'user',
    });
    const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatarUrl || 'https://i.pravatar.cc/150');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isProjectDropdownOpen, setProjectDropdownOpen] = useState(false);
    const projectDropdownRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const availableProjects = useMemo(() => {
        if (!formData.clientId) return [];
        return projects.filter(p => p.clientId === formData.clientId);
    }, [formData.clientId, projects]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node)) {
                setProjectDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'clientId') {
            setFormData(prev => ({ ...prev, [name]: value, projectIds: [] }));
        } else if (name === 'accountType') {
            // When switching to admin, clear client-related fields
            if (value === 'admin') {
                setFormData(prev => ({ ...prev, [name]: value, clientId: '', projectIds: [], role: 'superuser' }));
            } else {
                setFormData(prev => ({ ...prev, [name]: value, role: 'normal' }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleProjectSelect = (projectId: string) => {
        setFormData(prev => {
            const newProjectIds = prev.projectIds.includes(projectId)
                ? prev.projectIds.filter(id => id !== projectId)
                : [...prev.projectIds, projectId];
            return { ...prev, projectIds: newProjectIds };
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        
        try {
            let avatarUrl = avatarPreview;
            
            // Upload avatar if a new file was selected
            if (avatarFile) {
                const formData = new FormData();
                formData.append('file', avatarFile);
                formData.append('type', 'avatar');
                formData.append('entity_id', user?.id || `user-${Date.now()}`);
                
                const token = localStorage.getItem('auth_token');
                const response = await fetch('https://oneqlek-backend-334489433469.us-central1.run.app/api/upload/image', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });
                
                if (!response.ok) {
                    throw new Error('Upload failed');
                }
                
                const uploadResponse = await response.json();
                avatarUrl = uploadResponse.data.public_url;
            }
            
            const userData = { 
                ...user, // Spread existing user data first to preserve fields not in the form (like id)
                ...formData, // Spread form data to apply updates
                avatarUrl, // Include the avatar URL
                // Ensure types are correct
                role: formData.role as 'superuser' | 'normal',
                dashboardAccess: formData.dashboardAccess as 'view-only' | 'view-and-edit',
                accountType: formData.accountType,
            } as User & { accountType: 'admin' | 'user' };
            
            onSave(userData);
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Failed to upload avatar. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
            {!user && (
                <div>
                    <label className="block text-sm font-medium text-secondary-text mb-1">Account Type</label>
                    <select name="accountType" value={formData.accountType} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required>
                        <option value="user">User Account (Client Dashboard)</option>
                        <option value="admin">Admin Account (Admin Panel)</option>
                    </select>
                </div>
            )}
            <div className="flex items-center space-x-4">
                <img src={avatarPreview} alt="User Avatar Preview" className="w-20 h-20 rounded-full object-cover" />
                <div>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                    />
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="bg-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50"
                    >
                        {isUploading ? 'Uploading...' : 'Change Avatar'}
                    </button>
                    <p className="text-xs text-secondary-text mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-secondary-text mb-1">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary-text mb-1">Position</label>
                    <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required />
            </div>
            {(formData.accountType === 'user' || user) && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-secondary-text mb-1">Assign to Client</label>
                        <select name="clientId" value={formData.clientId} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required={formData.accountType === 'user'}>
                            <option value="">Select a client</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-text mb-1">Assign Projects</label>
                         <div className="relative" ref={projectDropdownRef}>
                            <button 
                                type="button"
                                onClick={() => setProjectDropdownOpen(!isProjectDropdownOpen)}
                                disabled={!formData.clientId}
                                className="w-full bg-dark-bg border border-border-color rounded-md p-2 text-left flex justify-between items-center disabled:bg-gray-700 disabled:cursor-not-allowed"
                            >
                                <span className={formData.projectIds.length === 0 ? 'text-secondary-text' : ''}>
                                    {formData.projectIds.length > 0 ? `${formData.projectIds.length} project(s) selected` : 'Select projects'}
                                </span>
                                <svg className={`w-4 h-4 text-secondary-text transition-transform ${isProjectDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            {isProjectDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-sidebar-bg border border-border-color rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {availableProjects.length > 0 ? availableProjects.map(project => (
                                        <label key={project.id} className="flex items-center px-3 py-2 text-sm hover:bg-white/10 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.projectIds.includes(project.id)}
                                                onChange={() => handleProjectSelect(project.id)}
                                                className="h-4 w-4 rounded border-gray-300 text-accent-blue focus:ring-accent-blue bg-dark-bg"
                                            />
                                            <span className="ml-3">{project.name}</span>
                                        </label>
                                    )) : (
                                        <div className="px-3 py-2 text-sm text-secondary-text">No projects for this client.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">{user ? 'Set New Password' : 'Password'}</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" placeholder={user ? 'Leave blank to keep current' : '••••••••'} />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700">Cancel</button>
                <button type="submit" disabled={isUploading} className="bg-accent-blue px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50">
                    {isUploading ? 'Saving...' : 'Save User'}
                </button>
            </div>
        </form>
    );
};

export default UserManagementPage;