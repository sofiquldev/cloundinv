'use client';

import { useInvoiceStore } from '@/store/invoiceStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function InvoiceList() {
    const { invoices, deleteInvoice, fetchInvoices } = useInvoiceStore();
    const { settings } = useSettingsStore();

    useEffect(() => {
        const loadInvoices = async () => {
            try {
                await fetchInvoices();
            } catch {
                toast.error('Failed to load invoices');
            }
        };
        loadInvoices();
    }, [fetchInvoices]);

    const handleDelete = async (id: string) => {
        try {
            await deleteInvoice(id);
            toast.success('Invoice deleted successfully');
        } catch {
            toast.error('Failed to delete invoice');
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Invoices</h1>
                <Link href="/invoice/new" className="bg-black text-white px-4 py-2 rounded-md">
                    Create New Invoice
                </Link>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6">
                                    ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6">
                                    Customer
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                    Total
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                    Paid
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Due
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 md:px-6">
                                        #{invoice.id}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 md:px-6">
                                        {invoice.customer.name}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell md:px-6">
                                        {settings.currency} {invoice.total.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell md:px-6">
                                        {settings.currency} {invoice.paid.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 md:px-6">
                                        {settings.currency} {invoice.due.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right space-x-2 md:px-6">
                                        <Link
                                            href={`/invoice/${invoice.id}`}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            View
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(invoice.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}