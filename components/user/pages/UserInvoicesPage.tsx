import React, { useState } from 'react';
import { Invoice, Client } from '../../../types.ts';
import Modal from '../../Modal.tsx';
import InvoiceDetail from '../../InvoiceCard.tsx';
import { EyeIcon, CreditCardIcon } from '../../icons.tsx';

const getStatusClass = (status: Invoice['status']) => {
    switch (status) {
        case 'Paid': return 'bg-green-500/10 text-green-400';
        case 'Pending': return 'bg-yellow-500/10 text-yellow-400';
        case 'Overdue': return 'bg-red-500/10 text-red-400';
        default: return 'bg-gray-500/10 text-gray-400';
    }
};

interface UserInvoicesPageProps {
    invoices: Invoice[];
    client: Client;
    onSaveInvoice: (invoice: Invoice) => void;
}

const UserInvoicesPage: React.FC<UserInvoicesPageProps> = ({ invoices, client, onSaveInvoice }) => {
    const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
    const [isViewModalOpen, setViewModalOpen] = useState(false);

    const handleOpenViewModal = (invoice: Invoice) => {
        setViewingInvoice(invoice);
        setViewModalOpen(true);
    };

    const handleCloseModal = () => {
        setViewingInvoice(null);
        setViewModalOpen(false);
    };

    const handlePayInvoice = (invoice: Invoice) => {
        if (window.confirm(`Are you sure you want to pay invoice ${invoice.invoiceNumber}?`)) {
            onSaveInvoice({ ...invoice, status: 'Paid' });
        }
    };

    const sortedInvoices = [...invoices].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Invoices for {client.company}</h1>
            <p className="text-secondary-text mb-8">Review your billing history and pay pending invoices.</p>
            
            <div className="bg-card-bg rounded-2xl overflow-x-auto">
                <table className="w-full text-sm text-left text-primary-text">
                    <thead className="text-xs text-secondary-text uppercase bg-dark-bg">
                        <tr>
                            <th scope="col" className="px-6 py-3">Invoice #</th>
                            <th scope="col" className="px-6 py-3">Issue Date</th>
                            <th scope="col" className="px-6 py-3">Due Date</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedInvoices.map(invoice => {
                            const total = invoice.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                            const formattedTotal = new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: invoice.currency,
                            }).format(total);
                            return (
                                <tr key={invoice.id} className="border-b border-border-color hover:bg-white/5">
                                    <td className="px-6 py-4 font-medium">{invoice.invoiceNumber}</td>
                                    <td className="px-6 py-4">{invoice.issueDate}</td>
                                    <td className="px-6 py-4">{invoice.dueDate}</td>
                                    <td className="px-6 py-4">{formattedTotal}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end items-center space-x-2">
                                            <button onClick={() => handleOpenViewModal(invoice)} className="p-1.5 text-secondary-text hover:text-accent-blue"><EyeIcon className="w-5 h-5" /></button>
                                            {invoice.status === 'Pending' && (
                                                <button onClick={() => handlePayInvoice(invoice)} className="flex items-center space-x-2 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-md text-xs hover:bg-green-500/20">
                                                    <CreditCardIcon className="w-4 h-4"/>
                                                    <span>Pay Now</span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {isViewModalOpen && viewingInvoice && (
                <Modal title="Invoice Details" onClose={handleCloseModal} size="4xl">
                     <div className="bg-sidebar-bg text-white">
                        <InvoiceDetail 
                            invoice={viewingInvoice} 
                            client={client}
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default UserInvoicesPage;