'use client';

import { useInvoiceStore } from '@/store/invoiceStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Customer, Invoice, InvoiceItem } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Props {
    invoice?: Invoice;
}

export default function InvoiceForm({ invoice }: Props) {
    const router = useRouter();
    const { settings } = useSettingsStore();
    const { addInvoice, updateInvoice } = useInvoiceStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const generateInvoiceId = () => {
        // Generate a random 5-digit number between 10000 and 99999
        return Math.floor(10000 + Math.random() * 90000).toString();
    };

    const [formData, setFormData] = useState<{
        customer: Customer;
        items: InvoiceItem[];
        subtotal: number;
        total: number;
        paid: number;
        due: number;
        discount: number;
        vat: number;
        date: string;
    }>(
        invoice || {
            customer: {
                name: '',
                email: '',
                address: '',
                phone: '',
                website: '',
            },
            items: [
                {
                    id: Date.now().toString(),
                    name: '',
                    rate: 0,
                    amount: 0,
                    total: 0,
                },
            ],
            subtotal: 0,
            total: 0,
            paid: 0,
            due: 0,
            discount: 0,
            vat: 0,
            date: new Date().toISOString().split('T')[0],
        }
    );

    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            customer: {
                ...prev.customer,
                [name]: value,
            },
        }));
    };

    const addItem = () => {
        const newItem: InvoiceItem = {
            id: Date.now().toString(),
            name: '',
            rate: 0,
            amount: 0,
            total: 0,
        };
        setFormData((prev) => ({
            ...prev,
            items: [...prev.items, newItem],
        }));
    };

    const updateItem = (index: number, field: string, value: string | number) => {
        setFormData((prev) => {
            const updatedItems = [...prev.items];
            const item = updatedItems[index];
            const updatedItem = {
                ...item,
                [field]: value,
            };
            if (field === 'rate' || field === 'amount') {
                const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
                updatedItem[field] = numValue;
                updatedItem.total = updatedItem.rate * updatedItem.amount;
            }
            updatedItems[index] = updatedItem;
            return {
                ...prev,
                items: updatedItems,
            };
        });
    };

    const removeItem = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const calculateTotals = useCallback(() => {
        const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
        const vatAmount = (subtotal * formData.vat) / 100;
        const discountAmount = (subtotal * formData.discount) / 100;
        const total = subtotal + vatAmount - discountAmount;
        const due = total - formData.paid;
        
        if (subtotal !== formData.subtotal || 
            total !== formData.total || 
            due !== formData.due) {
            setFormData(prev => ({
                ...prev,
                subtotal,
                total,
                due,
            }));
        }
    }, [formData.items, formData.vat, formData.discount, formData.paid, formData.subtotal, formData.total, formData.due]);

    useEffect(() => {
        calculateTotals();
    }, [calculateTotals]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const invoiceData: Invoice = {
                id: invoice?.id || generateInvoiceId(),
                ...formData,
            };

            if (invoice) {
                await updateInvoice(invoice.id, invoiceData);
                toast.success('Invoice updated successfully');
            } else {
                await addInvoice(invoiceData);
                toast.success('Invoice created successfully');
            }
            
            router.push('/');
        } catch {
            toast.error('Failed to save invoice');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
            <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.customer.name}
                            onChange={handleCustomerChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.customer.email}
                            onChange={handleCustomerChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.customer.phone}
                            onChange={handleCustomerChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Website</label>
                        <input
                            type="text"
                            name="website"
                            value={formData.customer.website}
                            onChange={handleCustomerChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.customer.address}
                            onChange={handleCustomerChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Items</h2>
                    <button
                        type="button"
                        onClick={addItem}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Add Item
                    </button>
                </div>
                <div className="space-y-4">
                    {formData.items.map((item, index) => (
                        <div key={item.id} className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-lg">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-black mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                                    placeholder="Item name"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                                    required
                                />
                            </div>
                            <div className="w-full md:w-24">
                                <label className="block text-sm font-medium text-black mb-1">
                                    Rate
                                </label>
                                <input
                                    type="number"
                                    value={item.rate}
                                    onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value))}
                                    placeholder="Rate"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                                    required
                                />
                            </div>
                            <div className="w-full md:w-24">
                                <label className="block text-sm font-medium text-black mb-1">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    value={item.amount}
                                    onChange={(e) => updateItem(index, 'amount', parseFloat(e.target.value))}
                                    placeholder="Amount"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                                    required
                                />
                            </div>
                            <div className="w-full md:w-24">
                                <label className="block text-sm font-medium text-black mb-1">
                                    Total
                                </label>
                                <input
                                    type="number"
                                    value={item.total}
                                    readOnly
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-black"
                                />
                            </div>
                            <div className="flex items-center justify-end md:items-end">
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="text-red-600 hover:text-red-800 p-2"
                                    title="Remove item"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Totals</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span>Subtotal:</span>
                        <span>{settings.currency} {formData.subtotal.toFixed(2)}</span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            VAT (%)
                        </label>
                        <input
                            type="number"
                            value={formData.vat}
                            onChange={(e) => setFormData((prev) => ({ ...prev, vat: parseFloat(e.target.value) || 0 }))}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Discount (%)
                        </label>
                        <input
                            type="number"
                            value={formData.discount}
                            onChange={(e) => setFormData((prev) => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div className="flex justify-between items-center font-semibold">
                        <span>Total:</span>
                        <span>{settings.currency} {formData.total.toFixed(2)}</span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Amount Paid
                        </label>
                        <input
                            type="number"
                            value={formData.paid}
                            onChange={(e) => setFormData((prev) => ({ ...prev, paid: parseFloat(e.target.value) || 0 }))}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div className="flex justify-between items-center font-semibold text-lg">
                        <span>Due:</span>
                        <span>{settings.currency} {formData.due.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : invoice ? 'Update Invoice' : 'Create Invoice'}
                </button>
            </div>
        </form>
    );
}