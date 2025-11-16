import React, { useState } from 'react';
// FIX: Added file extension to import to resolve module error.
import { PaymentPlan } from '../../types.ts';
// FIX: Added file extension to import to resolve module error.
import Modal from '../Modal.tsx';
// FIX: Added file extension to import to resolve module error.
import { PlusIcon, PencilSquareIcon, TrashIcon } from '../icons.tsx';
import { useData } from '../DataContext.tsx';

const PaymentPlanCard: React.FC<{
    plan: PaymentPlan;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ plan, onEdit, onDelete }) => {

    const price = typeof plan.price === 'string' ? parseFloat(plan.price) : plan.price;
    
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: plan.currency || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price || 0);


    return (
        <div className={`bg-card-bg p-6 rounded-2xl border-2 ${(plan.isPopular || plan.is_popular) ? 'border-accent-blue' : 'border-transparent'} relative`}>
            {(plan.isPopular || plan.is_popular) && <div className="absolute top-0 right-6 bg-accent-blue text-white text-xs font-bold px-3 py-1 rounded-b-lg">POPULAR</div>}
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            <p className="text-4xl font-extrabold text-white my-4">{formattedPrice}<span className="text-base font-normal text-secondary-text">/yr</span></p>
            <ul className="space-y-2 text-secondary-text mb-6">
                {(plan.features || []).map((feature, index) => (
                    <li key={index} className="flex items-center">
                        <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <div className="flex space-x-2">
                <button onClick={onEdit} className="w-full text-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2">
                    <PencilSquareIcon className="w-4 h-4"/>
                    <span>Edit</span>
                </button>
                <button onClick={onDelete} className="w-full text-center bg-red-600/50 text-red-300 px-4 py-2 rounded-lg hover:bg-red-600/70 flex items-center justify-center space-x-2">
                    <TrashIcon className="w-4 h-4"/>
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
};

const PaymentPlansPage: React.FC = () => {
    const { paymentPlans, handleSavePlan, handleDeletePlan } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<PaymentPlan | null>(null);

    if (!paymentPlans || !handleSavePlan || !handleDeletePlan) {
        return <div>Loading...</div>;
    }

    const handleOpenModal = (plan?: PaymentPlan) => {
        setEditingPlan(plan || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingPlan(null);
        setIsModalOpen(false);
    };

    const onSave = (planData: PaymentPlan) => {
        handleSavePlan(planData);
        handleCloseModal();
    };

    const onDelete = (planId: string) => {
        handleDeletePlan(planId);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Payment Plans</h2>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center space-x-2 bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>New Plan</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Array.isArray(paymentPlans) ? paymentPlans : []).map((plan) => (
                    <PaymentPlanCard
                        key={plan.id}
                        plan={plan}
                        onEdit={() => handleOpenModal(plan)}
                        onDelete={() => onDelete(plan.id)}
                    />
                ))}
            </div>
             {isModalOpen && (
                <Modal title={editingPlan ? 'Edit Plan' : 'Add New Plan'} onClose={handleCloseModal}>
                    <PlanForm
                        plan={editingPlan}
                        onSave={onSave}
                        onCancel={handleCloseModal}
                    />
                </Modal>
            )}
        </div>
    );
};

const PlanForm: React.FC<{
    plan: PaymentPlan | null;
    onSave: (plan: PaymentPlan) => void;
    onCancel: () => void;
}> = ({ plan, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: plan?.name || '',
        price: plan?.price || 0,
        currency: plan?.currency || 'USD',
        features: plan?.features?.join(', ') || '',
        isPopular: plan?.isPopular || plan?.is_popular || false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
             setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const planData: Omit<PaymentPlan, 'id'> = {
            ...formData,
            features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        };
        onSave({ ...planData, id: plan?.id || '' });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
             <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Plan Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required />
            </div>
             <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-secondary-text mb-1">Price (/yr)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-secondary-text mb-1">Currency</label>
                    <select name="currency" value={formData.currency} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="AED">AED (د.إ)</option>
                    </select>
                </div>
             </div>
             <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Features (comma-separated)</label>
                <input type="text" name="features" value={formData.features} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required />
            </div>
            <div className="flex items-center">
                 <input type="checkbox" id="isPopular" name="isPopular" checked={formData.isPopular} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-accent-blue focus:ring-accent-blue" />
                 <label htmlFor="isPopular" className="ml-2 block text-sm text-white">
                    Mark as popular
                </label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700">Cancel</button>
                <button type="submit" className="bg-accent-blue px-4 py-2 rounded-lg hover:bg-blue-600">Save</button>
            </div>
        </form>
    );
};


export default PaymentPlansPage;