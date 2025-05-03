import { NextResponse } from 'next/server';
import { readInvoices, addInvoice, updateInvoice, deleteInvoice } from '@/data/utils';
import { Invoice } from '@/types';

export async function GET() {
    try {
        const data = await readInvoices();
        return NextResponse.json({ success: true, invoices: data.invoices });
    } catch {
        return NextResponse.json(
            { success: false, message: 'Failed to fetch invoices' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const invoice: Invoice = await request.json();
        await addInvoice(invoice);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { success: false, message: 'Failed to save invoice' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { id, invoice } = await request.json();
        await updateInvoice(id, invoice);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { success: false, message: 'Failed to update invoice' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        await deleteInvoice(id);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { success: false, message: 'Failed to delete invoice' },
            { status: 500 }
        );
    }
}