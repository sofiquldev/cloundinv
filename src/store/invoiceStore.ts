import { create } from 'zustand';
import { Invoice } from '@/types';

interface InvoiceStore {
    invoices: Invoice[];
    fetchInvoices: () => Promise<void>;
    addInvoice: (invoice: Invoice) => Promise<void>;
    updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
    deleteInvoice: (id: string) => Promise<void>;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
    invoices: [],
    fetchInvoices: async () => {
        try {
            const response = await fetch('/api/invoices');
            const data = await response.json();
            if (data.success) {
                set({ invoices: data.invoices });
            }
        } catch (error) {
            console.error('Failed to fetch invoices:', error);
            throw error;
        }
    },
    addInvoice: async (invoice) => {
        try {
            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoice),
            });
            if (response.ok) {
                set((state) => ({ invoices: [...state.invoices, invoice] }));
            } else {
                throw new Error('Failed to add invoice');
            }
        } catch (error) {
            console.error('Failed to add invoice:', error);
            throw error;
        }
    },
    updateInvoice: async (id, updatedInvoice) => {
        try {
            const response = await fetch('/api/invoices', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, invoice: updatedInvoice }),
            });
            if (response.ok) {
                set((state) => ({
                    invoices: state.invoices.map((invoice) =>
                        invoice.id === id ? { ...invoice, ...updatedInvoice } : invoice
                    ),
                }));
            } else {
                throw new Error('Failed to update invoice');
            }
        } catch (error) {
            console.error('Failed to update invoice:', error);
            throw error;
        }
    },
    deleteInvoice: async (id) => {
        try {
            const response = await fetch('/api/invoices', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (response.ok) {
                set((state) => ({
                    invoices: state.invoices.filter((invoice) => invoice.id !== id),
                }));
            } else {
                throw new Error('Failed to delete invoice');
            }
        } catch (error) {
            console.error('Failed to delete invoice:', error);
            throw error;
        }
    },
}));