

import React, { useState, useMemo } from 'react';
import { useData } from '../DataContext.tsx';
import { Invoice, InvoiceItem, Client } from '../../types.ts';
import Modal from '../Modal.tsx';
import InvoiceDetail from '../InvoiceCard.tsx';
import { PlusIcon, EyeIcon, PencilSquareIcon, TrashIcon, ArrowDownTrayIcon, EnvelopeIcon } from '../icons.tsx';

const getStatusClass = (status: Invoice['status']) => {
    switch (status) {
        case 'Paid': return 'bg-green-500/10 text-green-400';
        case 'Pending': return 'bg-yellow-500/10 text-yellow-400';
        case 'Overdue': return 'bg-red-500/10 text-red-400';
        default: return 'bg-gray-500/10 text-gray-400';
    }
};

const InvoicesPage: React.FC = () => {
    const { invoices, clients, projects, handleSaveInvoice, handleDeleteInvoice } = useData();
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isConfirmSendModalOpen, setConfirmSendModalOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
    const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [filterCompany, setFilterCompany] = useState<string>('All');
    const [filterProject, setFilterProject] = useState<string>('All');
    const [notification, setNotification] = useState<string | null>(null);


    if (!invoices || !clients || !projects || !handleSaveInvoice || !handleDeleteInvoice) {
        return <div>Loading...</div>;
    }

    const handleOpenFormModal = (invoice?: Invoice) => {
        setEditingInvoice(invoice || null);
        setFormModalOpen(true);
    };

    const handleOpenViewModal = (invoice: Invoice) => {
        setViewingInvoice(invoice);
        setViewModalOpen(true);
    };

    const handleCloseModals = () => {
        setEditingInvoice(null);
        setViewingInvoice(null);
        setFormModalOpen(false);
        setViewModalOpen(false);
        setConfirmSendModalOpen(false);
    };

    const onSave = (invoiceData: Invoice) => {
        handleSaveInvoice(invoiceData);
        handleCloseModals();
    };

    const onDelete = (invoiceId: string) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            handleDeleteInvoice(invoiceId);
        }
    };
    
    const availableProjects = useMemo(() => {
        if (filterCompany === 'All') return projects;
        return projects.filter(p => p.clientId === filterCompany);
    }, [projects, filterCompany]);

    const filteredInvoices = useMemo(() => {
        return invoices
            .filter(inv => filterStatus === 'All' || inv.status === filterStatus)
            .filter(inv => filterCompany === 'All' || inv.clientId === filterCompany)
            .filter(inv => filterProject === 'All' || inv.projectId === filterProject)
            .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
    }, [invoices, filterStatus, filterCompany, filterProject]);

    const handlePrint = () => {
        window.print();
    };

    const handleSendInvoice = (invoice: Invoice, client: Client | undefined) => {
        if (!client || !client.email) {
            setNotification('Error: Client email not found.');
        } else {
            const message = `Invoice ${invoice.invoiceNumber} sent to ${client.email}.`;
            setNotification(message);
        }
        
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    return (
        <div>
             {notification && (
                <div className="fixed top-20 right-6 bg-accent-green text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
                    {notification}
                </div>
            )}
            <style>{`
              @keyframes fadeInOut {
                0%, 100% { opacity: 0; transform: translateY(-20px); }
                10%, 90% { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in-out {
                animation: fadeInOut 3s ease-in-out forwards;
              }
            `}</style>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Invoices</h2>
                    <p className="text-secondary-text text-sm">Manage all your invoices in one place.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="flex w-full sm:w-auto gap-2">
                        <select
                            value={filterCompany}
                            onChange={(e) => {
                                setFilterCompany(e.target.value);
                                setFilterProject('All'); // Reset project filter when company changes
                            }}
                            className="bg-card-bg text-white placeholder-secondary-text rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent-blue w-full sm:w-auto"
                            aria-label="Filter by company"
                        >
                            <option value="All">All Companies</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.company}</option>
                            ))}
                        </select>
                         <select
                            value={filterProject}
                            onChange={(e) => setFilterProject(e.target.value)}
                            className="bg-card-bg text-white placeholder-secondary-text rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent-blue w-full sm:w-auto"
                            aria-label="Filter by project"
                            disabled={filterCompany === 'All'}
                        >
                            <option value="All">All Projects</option>
                            {availableProjects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>
                    <button 
                        onClick={() => handleOpenFormModal()}
                        className="flex items-center space-x-2 bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto justify-center flex-shrink-0"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>New Invoice</span>
                    </button>
                </div>
            </div>

            <div className="flex space-x-2 mb-4 border-b border-border-color">
                {['All', 'Paid', 'Pending', 'Overdue'].map(status => (
                    <button 
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-2 text-sm font-medium ${filterStatus === status ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-secondary-text hover:text-white'}`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="bg-card-bg rounded-2xl overflow-x-auto">
                <table className="w-full text-sm text-left text-primary-text">
                    <thead className="text-xs text-secondary-text uppercase bg-dark-bg">
                        <tr>
                            <th scope="col" className="px-6 py-3">Invoice #</th>
                            <th scope="col" className="px-6 py-3">Client</th>
                            <th scope="col" className="px-6 py-3">Project</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Due Date</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.map(invoice => {
                            const client = clients.find(c => c.id === invoice.clientId);
                            const project = projects.find(p => p.id === invoice.projectId);
                            const total = invoice.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                            const formattedTotal = new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: invoice.currency,
                            }).format(total);
                            return (
                                <tr key={invoice.id} className="border-b border-border-color hover:bg-white/5">
                                    <td className="px-6 py-4 font-medium">{invoice.invoiceNumber}</td>
                                    <td className="px-6 py-4">{client?.company || 'N/A'}</td>
                                    <td className="px-6 py-4 truncate max-w-xs">{project?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                            invoice.type === 'subscription' 
                                                ? 'bg-teal-500/10 text-teal-400' 
                                                : 'bg-gray-500/10 text-gray-400'
                                        }`}>
                                            {invoice.type}
                                        </span>
                                    </td>
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
                                            {invoice.type === 'manual' && (
                                                <>
                                                    <button onClick={() => handleOpenFormModal(invoice)} className="p-1.5 text-secondary-text hover:text-accent-green"><PencilSquareIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => onDelete(invoice.id)} className="p-1.5 text-secondary-text hover:text-accent-red"><TrashIcon className="w-5 h-5" /></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {isFormModalOpen && (
                <Modal title={editingInvoice ? 'Edit Invoice' : 'Create New Invoice'} onClose={handleCloseModals}>
                    <InvoiceForm 
                        invoice={editingInvoice} 
                        onSave={onSave} 
                        onCancel={handleCloseModals}
                        clients={clients}
                    />
                </Modal>
            )}

            {isViewModalOpen && viewingInvoice && (
                <Modal title="Invoice Details" onClose={handleCloseModals} size="4xl">
                     <div className="bg-sidebar-bg text-white">
                         <div className="p-4 flex justify-end space-x-2 no-print">
                              <button 
                                onClick={() => setConfirmSendModalOpen(true)}
                                className="flex items-center space-x-2 bg-accent-teal text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                             >
                                 <EnvelopeIcon className="w-5 h-5" />
                                 <span>Send Invoice</span>
                             </button>
                             <button onClick={handlePrint} className="flex items-center space-x-2 bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                 <ArrowDownTrayIcon className="w-5 h-5" />
                                 <span>Download / Print</span>
                             </button>
                         </div>
                        <InvoiceDetail 
                            invoice={viewingInvoice} 
                            client={clients.find(c => c.id === viewingInvoice.clientId)}
                        />
                    </div>
                    <style>{`
                      @media print {
                        body * {
                          visibility: hidden;
                        }
                        .printable-content, .printable-content * {
                          visibility: visible;
                        }
                        .printable-content {
                          position: absolute;
                          left: 0;
                          top: 0;
                          width: 100%;
                          height: 100%;
                          overflow: visible;
                        }
                        .no-print {
                          display: none;
                        }
                        .fixed {
                            display: none;
                        }
                      }
                    `}</style>
                </Modal>
            )}
            
            {isConfirmSendModalOpen && viewingInvoice && (() => {
                const client = clients.find(c => c.id === viewingInvoice.clientId);
                return (
                    <Modal title="Confirm Send Invoice" onClose={() => setConfirmSendModalOpen(false)}>
                        <div className="p-2 text-white">
                            <h3 className="text-lg font-semibold mb-2">Send Invoice to Client</h3>
                            <p className="text-secondary-text mb-4">
                                You are about to send invoice <strong>{viewingInvoice.invoiceNumber}</strong> to <strong>{client?.company || 'N/A'}</strong>.
                            </p>
                            <div className="bg-dark-bg p-4 rounded-lg border border-border-color mb-6">
                                <p className="text-sm text-secondary-text">The invoice will be sent to the registered email address:</p>
                                <p className="font-semibold text-white mt-1">{client?.email || 'No email address on file'}</p>
                            </div>

                            {!client?.email && (
                                <p className="text-red-400 text-sm mb-6 -mt-4">
                                    Warning: This client does not have a registered email address. The invoice cannot be sent.
                                </p>
                            )}
                            
                            <div className="flex justify-end space-x-4">
                                <button 
                                    onClick={() => setConfirmSendModalOpen(false)} 
                                    className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700">
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => {
                                        handleSendInvoice(viewingInvoice, client);
                                        setConfirmSendModalOpen(false);
                                    }}
                                    disabled={!client?.email}
                                    className="bg-accent-blue px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
                                >
                                    Send Invoice
                                </button>
                            </div>
                        </div>
                    </Modal>
                );
            })()}
        </div>
    );
};

const InvoiceForm: React.FC<{
    invoice: Invoice | null;
    onSave: (invoice: Invoice) => void;
    onCancel: () => void;
    clients: Client[];
}> = ({ invoice, onSave, onCancel, clients }) => {
    const [formData, setFormData] = useState({
        clientId: invoice?.clientId || '',
        issueDate: invoice?.issueDate || new Date().toISOString().slice(0, 10),
        dueDate: invoice?.dueDate || '',
        status: invoice?.status || 'Pending',
        currency: invoice?.currency || 'USD',
    });
    const [items, setItems] = useState<InvoiceItem[]>(invoice?.items || [{ description: '', quantity: 1, price: 0 }]);

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;
        setItems(newItems);
    };
    
    const addItem = () => setItems([...items, { description: '', quantity: 1, price: 0 }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const invoiceNumber = invoice?.invoiceNumber || `INV-${String(Date.now()).slice(-5)}`;
        onSave({ 
            ...formData, 
            id: invoice?.id || '', 
            invoiceNumber, 
            items,
            status: formData.status as Invoice['status'],
            type: 'manual',
            projectId: invoice?.projectId,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-secondary-text mb-1">Client</label>
                    <select name="clientId" value={formData.clientId} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required>
                        <option value="">Select a client</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                    </select>
                </div>
                <div>
                     <label className="block text-sm font-medium text-secondary-text mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                    </select>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-secondary-text mb-1">Currency</label>
                    <select name="currency" value={formData.currency} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="AED">AED (د.إ)</option>
                    </select>
                </div>
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-secondary-text mb-1">Issue Date</label>
                    <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required />
                </div>
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-secondary-text mb-1">Due Date</label>
                    <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required />
                </div>
            </div>

            <div>
                <h4 className="text-lg font-semibold mt-4 mb-2">Invoice Items</h4>
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <input type="text" placeholder="Description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="w-full bg-dark-bg border border-border-color rounded-md p-2" required />
                        <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} className="w-20 bg-dark-bg border border-border-color rounded-md p-2" required />
                        <input type="number" placeholder="Price" value={item.price} onChange={e => handleItemChange(index, 'price', Number(e.target.value))} className="w-24 bg-dark-bg border border-border-color rounded-md p-2" required />
                        <button type="button" onClick={() => removeItem(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-full"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                ))}
                <button type="button" onClick={addItem} className="text-sm text-accent-blue hover:underline">+ Add Item</button>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700">Cancel</button>
                <button type="submit" className="bg-accent-blue px-4 py-2 rounded-lg hover:bg-blue-600">Save Invoice</button>
            </div>
        </form>
    );
};

export default InvoicesPage;
