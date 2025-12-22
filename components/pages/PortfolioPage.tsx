import React, { useState, useRef } from 'react';
import { PortfolioCase } from '../../types.ts';
import Modal from '../Modal.tsx';
import PortfolioCard from '../PortfolioCard.tsx';
import { PlusIcon } from '../icons.tsx';
import { useData } from '../DataContext.tsx';


const PortfolioPage: React.FC = () => {
    const { portfolioCases, handleSavePortfolioCase, handleDeletePortfolioCase } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCase, setEditingCase] = useState<PortfolioCase | null>(null);

    if (!portfolioCases || !handleSavePortfolioCase || !handleDeletePortfolioCase) {
        return <div>Loading...</div>;
    }

    const handleOpenModal = (caseItem?: PortfolioCase) => {
        setEditingCase(caseItem || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingCase(null);
        setIsModalOpen(false);
    };

    const onSave = (caseData: PortfolioCase) => {
        handleSavePortfolioCase(caseData);
        handleCloseModal();
    };

    const onDelete = (caseId: string) => {
        if (window.confirm('Are you sure you want to delete this portfolio case?')) {
            handleDeletePortfolioCase(caseId);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Portfolio Management</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center space-x-2 bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>New Case</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolioCases.map(caseItem => (
                    <PortfolioCard
                        key={caseItem.id}
                        caseItem={caseItem}
                        onEdit={() => handleOpenModal(caseItem)}
                        onDelete={() => onDelete(caseItem.id)}
                    />
                ))}
            </div>
            {isModalOpen && (
                <Modal title={editingCase ? 'Edit Portfolio Case' : 'Add New Portfolio Case'} onClose={handleCloseModal}>
                    <PortfolioForm
                        caseItem={editingCase}
                        onSave={onSave}
                        onCancel={handleCloseModal}
                    />
                </Modal>
            )}
        </div>
    );
};

const PortfolioForm: React.FC<{
    caseItem: PortfolioCase | null;
    onSave: (caseItem: PortfolioCase) => void;
    onCancel: () => void;
}> = ({ caseItem, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: caseItem?.title || '',
        category: caseItem?.category || '',
        description: caseItem?.description || '',
        imageUrl: caseItem?.imageUrl || '',
        link: caseItem?.link || ''
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...caseItem,
            ...formData,
            id: caseItem?.id || '',
        } as PortfolioCase);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-2">Portfolio Image</label>
                <div className="flex items-center gap-x-4">
                    <img
                        src={formData.imageUrl || 'https://storage.googleapis.com/aistudio-hosting/generative-ai-studio/assets/app-placeholder.png'}
                        alt="Portfolio Preview"
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
                <label className="block text-sm font-medium text-secondary-text mb-1">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Case Study Link (Optional)</label>
                <input type="url" name="link" value={formData.link} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" placeholder="https://example.com/case-study" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700">Cancel</button>
                <button type="submit" className="bg-accent-blue px-4 py-2 rounded-lg hover:bg-blue-600">Save Case</button>
            </div>
        </form>
    );
};

export default PortfolioPage;
