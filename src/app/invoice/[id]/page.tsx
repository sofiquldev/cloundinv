'use client';

import { useInvoiceStore } from '@/store/invoiceStore';
import InvoicePDF from '@/components/invoice/InvoicePDF';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function InvoiceViewPage() {
    const params = useParams();
    const router = useRouter();
    const { invoices, removeInvoice } = useInvoiceStore();
    const invoice = invoices.find((inv) => inv.id === params.id);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
            removeInvoice(params.id as string);
            toast.success('Invoice deleted successfully');
            router.push('/');
        }
    };

    if (!invoice) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Invoice not found</h1>
                    <p className="mt-2 text-gray-600">The invoice you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
                        Return to invoices
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-2 inline-block">
                            ← Back to invoices
                        </Link>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Invoice for {invoice.customer.name}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                const content = `Invoice for ${invoice.customer.name}\nTotal: ${invoice.total}\nDue: ${invoice.due}`;
                                if (navigator.clipboard) {
                                    navigator.clipboard.writeText(content)
                                        .then(() => toast.success('Invoice details copied to clipboard'))
                                        .catch(() => copyToClipboardFallback(content));
                                } else {
                                    copyToClipboardFallback(content);
                                }
                            }}
                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                        >
                            Copy Details
                        </button>
                        <PDFDownloadLink
                            document={<InvoicePDF invoice={invoice} />}
                            fileName={`invoice-${invoice.id}.pdf`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            {({ loading }) =>
                                loading ? 'Preparing download...' : 'Download PDF'
                            }
                        </PDFDownloadLink>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                            Delete Invoice
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow-sm rounded-lg p-4" style={{ height: 'calc(100vh - 200px)' }}>
                    <PDFViewer width="100%" height="100%" className="rounded-md">
                        <InvoicePDF invoice={invoice} />
                    </PDFViewer>
                </div>
            </div>
        </div>
    );
}

function copyToClipboardFallback(content: string) {
    const textArea = document.createElement('textarea');
    textArea.value = content;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        toast.success('Invoice details copied to clipboard');
    } catch (err) {
        toast.error('Failed to copy invoice details');
        console.error('Fallback clipboard copy failed:', err);
    }
    document.body.removeChild(textArea);
}