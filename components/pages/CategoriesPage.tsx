import React, { useState } from 'react';
// FIX: Added file extension to import to resolve module error.
import { Category } from '../../types.ts';
// FIX: Added file extension to import to resolve module error.
import Modal from '../Modal.tsx';
// FIX: Added file extension to import to resolve module error.
import { PlusIcon, PencilSquareIcon, TrashIcon } from '../icons.tsx';
import { useData } from '../DataContext.tsx';

const CategoriesPage: React.FC = () => {
    const { categories, handleSaveCategory, handleDeleteCategory } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    if (!categories || !handleSaveCategory || !handleDeleteCategory) {
        return <div>Loading...</div>
    }

    const handleOpenModal = (category?: Category) => {
        setEditingCategory(category || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingCategory(null);
        setIsModalOpen(false);
    };

    const onSave = (categoryData: Category) => {
        handleSaveCategory(categoryData);
        handleCloseModal();
    };
    
    const onDelete = (categoryId: string) => {
        handleDeleteCategory(categoryId);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Categories</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center space-x-2 bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>New Category</span>
                </button>
            </div>
            <div className="bg-card-bg rounded-2xl p-4">
                <div className="space-y-3">
                    {categories.map(category => (
                        <div key={category.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5">
                            <span className="text-white font-medium">{category.name}</span>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => handleOpenModal(category)} className="text-secondary-text hover:text-white">
                                    <PencilSquareIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => onDelete(category.id)} className="text-secondary-text hover:text-red-400">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <Modal title={editingCategory ? 'Edit Category' : 'Add New Category'} onClose={handleCloseModal}>
                    <CategoryForm 
                        category={editingCategory}
                        onSave={onSave}
                        onCancel={handleCloseModal}
                    />
                </Modal>
            )}
        </div>
    );
};

const CategoryForm: React.FC<{
    category: Category | null;
    onSave: (category: Category) => void;
    onCancel: () => void;
}> = ({ category, onSave, onCancel }) => {
    const [name, setName] = useState(category?.name || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave({ id: category?.id || '', name });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Category Name</label>
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

export default CategoriesPage;