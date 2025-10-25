import React, { useState, useMemo, useRef } from 'react';
// FIX: Added file extension to import to resolve module error.
import { Client } from '../../types.ts';
// FIX: Added file extension to import to resolve module error.
import ClientCard from '../ClientCard.tsx';
// FIX: Added file extension to import to resolve module error.
import Modal from '../Modal.tsx';
// FIX: Added file extension to import to resolve module error.
import { PlusIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, MagnifyingGlassIcon } from '../icons.tsx';
import { useData } from '../DataContext.tsx';

const ClientsPage: React.FC = () => {
    const { clients, projects, paymentPlans, handleSaveClient, handleDeleteClient } = useData();
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    if (!clients || !projects || !paymentPlans || !handleSaveClient || !handleDeleteClient) {
        return <div>Loading...</div>
    }

    const handleOpenEditModal = (client?: Client) => {
        setSelectedClient(client || null);
        setEditModalOpen(true);
    };
    
    const handleOpenDetailsModal = (client: Client) => {
        setSelectedClient(client);
        setDetailsModalOpen(true);
    };

    const handleCloseModals = () => {
        setSelectedClient(null);
        setEditModalOpen(false);
        setDetailsModalOpen(false);
    };

    const onSave = (clientData: Client) => {
        handleSaveClient(clientData);
        handleCloseModals();
    };

    const onDelete = (clientId: string) => {
        handleDeleteClient(clientId);
    };

    const filteredClients = useMemo(() => {
        return clients.filter(client => 
            client.company.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [clients, searchTerm]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full sm:w-auto">
                     <input
                        type="search"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-card-bg text-white placeholder-secondary-text rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-accent-blue w-full sm:w-64"
                    />
                    <MagnifyingGlassIcon className="w-5 h-5 text-secondary-text absolute top-1/2 left-3 transform -translate-y-1/2" />
                </div>
                <button 
                    onClick={() => handleOpenEditModal()}
                    className="flex items-center space-x-2 bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto justify-center"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>New Client</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredClients.map((client) => (
                    <ClientCard 
                        key={client.id} 
                        client={client}
                        onViewDetails={() => handleOpenDetailsModal(client)}
                        onEdit={() => handleOpenEditModal(client)}
                        onDelete={() => onDelete(client.id)}
                    />
                ))}
            </div>

            {isEditModalOpen && (
                <Modal title={selectedClient ? 'Edit Client' : 'Add New Client'} onClose={handleCloseModals}>
                    <ClientForm 
                        client={selectedClient} 
                        onSave={onSave} 
                        onCancel={handleCloseModals}
                    />
                </Modal>
            )}

            {isDetailsModalOpen && selectedClient && (
                <Modal title="Client Details" onClose={handleCloseModals}>
                    <ClientDetails 
                        client={selectedClient} 
                        projects={projects.filter(p => p.clientId === selectedClient.id)}
                        plans={paymentPlans}
                    />
                </Modal>
            )}
        </div>
    );
};

// Details view component
const ClientDetails: React.FC<{ client: Client, projects: any[], plans: any[] }> = ({ client, projects, plans }) => (
    <div className="text-white">
        <div className="flex flex-col items-center text-center">
            <img src={client.avatarUrl} alt={client.company} className="w-24 h-24 rounded-full mb-4 ring-4 ring-dark-bg object-cover" />
            <h3 className="font-bold text-white text-2xl">{client.company}</h3>
        </div>
        <div className="border-t border-border-color my-6"></div>
        <div className="space-y-4 text-sm">
            <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-secondary-text" />
                <a href={`mailto:${client.email}`} className="hover:text-accent-blue">{client.email}</a>
            </div>
            {client.mobile && <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-secondary-text" />
                <span>{client.mobile}</span>
            </div>}
            {client.address && <div className="flex items-center space-x-3">
                <MapPinIcon className="w-5 h-5 text-secondary-text" />
                <span>{client.address}</span>
            </div>}
        </div>
        <div className="border-t border-border-color my-6"></div>
        <div>
            <h4 className="font-bold text-lg mb-4">Assigned Projects</h4>
            <div className="space-y-3">
                {projects.length > 0 ? projects.map(p => {
                    const plan = plans.find(pl => pl.id === p.planId);
                    return (
                        <div key={p.id} className="bg-dark-bg p-3 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{p.name}</p>
                                <p className="text-xs text-secondary-text">{plan ? `${plan.name} - ${plan.price}` : 'No Plan'}</p>
                            </div>
                            <span className="text-xs font-medium bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">{p.status}</span>
                        </div>
                    );
                }) : <p className="text-secondary-text text-sm">No projects assigned.</p>}
            </div>
        </div>
    </div>
);


// Form component
const ClientForm: React.FC<{
    client: Client | null;
    onSave: (client: Client) => void;
    onCancel: () => void;
}> = ({ client, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        company: client?.company || '',
        email: client?.email || '',
        mobile: client?.mobile || '',
        address: client?.address || '',
    });
    const [avatarPreview, setAvatarPreview] = useState<string>(client?.avatarUrl || 'https://i.pravatar.cc/150');
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
            setAvatarPreview(base64);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: client?.id || '', avatarUrl: avatarPreview });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <div className="flex items-center space-x-4">
                <img src={avatarPreview} alt="Company Logo Preview" className="w-20 h-20 rounded-full object-cover" />
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
                        className="bg-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-700"
                    >
                        Change Logo
                    </button>
                    <p className="text-xs text-secondary-text mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Company</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Mobile (Optional)</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" />
            </div>
             <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Address (Optional)</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700">Cancel</button>
                <button type="submit" className="bg-accent-blue px-4 py-2 rounded-lg hover:bg-blue-600">Save</button>
            </div>
        </form>
    );
};


export default ClientsPage;