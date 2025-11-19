



import React from 'react';
// FIX: Added file extension to import to resolve module error.
import { Invoice, Client } from '../types.ts';

const getStatusClass = (status: Invoice['status']) => {
    switch (status) {
        case 'Paid': return 'bg-green-100 text-green-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Overdue': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const InvoiceDetail: React.FC<{ invoice: Invoice; client: Client | undefined }> = ({ invoice, client }) => {
    const total = invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: invoice.currency,
    });
    
    return (
        <div className="bg-white text-gray-800 p-4 sm:p-10 printable-content">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                    <p className="text-gray-500">{invoice.invoiceNumber}</p>
                </div>
                <div className="text-left sm:text-right mt-4 sm:mt-0">
                     <h2 className="text-2xl font-semibold text-gray-800">OneQlek Inc.</h2>
                    <p className="text-gray-500">123 Dev Lane, Tech City</p>
                </div>
            </div>

            {/* Client Info & Dates */}
            <div className="flex flex-col sm:flex-row justify-between mb-10">
                <div className="mb-6 sm:mb-0">
                    <h3 className="font-semibold text-gray-500 mb-1">BILLED TO</h3>
                    <p className="font-bold text-gray-900">{client?.company}</p>
                    <p className="text-gray-500">{client?.address}</p>
                    <p className="text-gray-500">{client?.email}</p>
                </div>
                <div className="text-left sm:text-right">
                    <div className="mb-2">
                        <p className="font-semibold text-gray-500">Issue Date</p>
                        <p className="font-medium text-gray-900">{invoice.issueDate}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-500">Due Date</p>
                        <p className="font-medium text-gray-900">{invoice.dueDate}</p>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
                <table className="w-full mb-10">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left font-semibold text-gray-600 p-3">Description</th>
                            <th className="text-center font-semibold text-gray-600 p-3">Qty</th>
                            <th className="text-right font-semibold text-gray-600 p-3">Unit Price</th>
                            <th className="text-right font-semibold text-gray-600 p-3">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-3">{item.description}</td>
                                <td className="text-center p-3">{item.quantity}</td>
                                <td className="text-right p-3">{currencyFormatter.format(item.price)}</td>
                                <td className="text-right p-3">{currencyFormatter.format(item.quantity * item.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
                <div className="w-full max-w-xs">
                    <div className="border-t my-2"></div>
                    <div className="flex justify-between font-bold text-gray-900 text-xl">
                        <p>Total Amount</p>
                        <p>{currencyFormatter.format(total)}</p>
                    </div>
                     <div className="text-center mt-6">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusClass(invoice.status)}`}>
                            {invoice.status}
                        </span>
                    </div>
                </div>
            </div>

             <div className="text-center mt-12 text-gray-500 text-sm">
                <p>Thank you for your business!</p>
            </div>
        </div>
    );
};

export default InvoiceDetail;