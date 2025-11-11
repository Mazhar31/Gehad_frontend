import React, { useState } from 'react';
import { Department, Group } from '../../types.ts';
import Modal from '../Modal.tsx';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '../icons.tsx';
import { useData } from '../DataContext.tsx';

// Reusable form component
const ManagementForm: React.FC<{
    item: { id?: string; name: string } | null;
    onSave: (item: { id: string; name: string }) => void;
    onCancel: () => void;
    itemName: string;
}> = ({ item, onSave, onCancel, itemName }) => {
    const [name, setName] = useState(item?.name || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave({ id: item?.id || '', name });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">{itemName} Name</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full bg-dark-bg border border-border-color rounded-md p-2" 
                    required 
                />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700">Cancel</button>
                <button type="submit" className="bg-accent-blue px-4 py-2 rounded-lg hover:bg-blue-600">Save</button>
            </div>
        </form>
    );
};


const OrganizationManagementPage: React.FC = () => {
    const { 
        departments, handleSaveDepartment, handleDeleteDepartment,
        groups, handleSaveGroup, handleDeleteGroup
    } = useData();
    
    const [activeTab, setActiveTab] = useState<'departments' | 'groups'>('departments');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<{ id?: string; name: string; type: 'department' | 'group' } | null>(null);

    if (!departments || !handleSaveDepartment || !handleDeleteDepartment || !groups || !handleSaveGroup || !handleDeleteGroup) {
        return <div>Loading...</div>
    }

    const handleOpenModal = (item?: { id: string; name: string }, type: 'department' | 'group' = 'department') => {
        setEditingItem(item ? { ...item, type } : { name: '', type });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    const onSave = (itemData: { id: string; name: string }) => {
        if (editingItem?.type === 'department') {
            handleSaveDepartment(itemData as Department);
        } else if (editingItem?.type === 'group') {
            handleSaveGroup(itemData as Group);
        }
        handleCloseModal();
    };
    
    const onDelete = (id: string, type: 'department' | 'group') => {
        if(window.confirm(`Are you sure you want to delete this ${type}?`)) {
            if (type === 'department') {
                handleDeleteDepartment(id);
            } else {
                handleDeleteGroup(id);
            }
        }
    };

    const renderList = (type: 'departments' | 'groups') => {
        const data = type === 'departments' ? departments : groups;
        const itemType = type.slice(0, -1) as 'department' | 'group';

        return (
             <div className="bg-card-bg rounded-2xl p-4">
                <div className="space-y-3">
                    {data.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5">
                            <span className="text-white font-medium">{item.name}</span>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => handleOpenModal(item, itemType)} className="text-secondary-text hover:text-white">
                                    <PencilSquareIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => onDelete(item.id, itemType)} className="text-secondary-text hover:text-red-400">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const modalTitle = editingItem 
        ? `${editingItem.id ? 'Edit' : 'Add New'} ${editingItem.type.charAt(0).toUpperCase() + editingItem.type.slice(1)}`
        : '';
        
    const itemName = editingItem?.type.charAt(0).toUpperCase() + editingItem?.type.slice(1) || '';
    
    const getActiveTabName = () => {
        switch(activeTab) {
            case 'departments': return 'Department';
            case 'groups': return 'Group';
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Organization Management</h2>
                <button
                    onClick={() => handleOpenModal(undefined, activeTab.slice(0, -1) as any)}
                    className="flex items-center space-x-2 bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>New {getActiveTabName()}</span>
                </button>
            </div>
            
            <div className="flex space-x-2 mb-6 border-b border-border-color">
                <button 
                    onClick={() => setActiveTab('departments')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'departments' ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-secondary-text hover:text-white'}`}
                >
                    Departments
                </button>
                 <button 
                    onClick={() => setActiveTab('groups')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'groups' ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-secondary-text hover:text-white'}`}
                >
                    Groups
                </button>
            </div>

            {activeTab === 'departments' && renderList('departments')}
            {activeTab === 'groups' && renderList('groups')}


            {isModalOpen && editingItem && (
                <Modal title={modalTitle} onClose={handleCloseModal}>
                    <ManagementForm 
                        item={editingItem}
                        onSave={onSave}
                        onCancel={handleCloseModal}
                        itemName={itemName}
                    />
                </Modal>
            )}
        </div>
    );
};

export default OrganizationManagementPage;