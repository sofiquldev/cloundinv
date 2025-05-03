export type CompanySettings = {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
};

export type Currency = 'USD' | 'EUR' | 'BDT';
export type Language = 'en' | 'bn';
export type PageSize = 'A4' | 'POS50' | 'POS70';

export type Settings = {
    company: CompanySettings;
    currency: Currency;
    language: Language;
    pageSize: PageSize;
};

export type InvoiceItem = {
    id: string;
    name: string;
    rate: number;
    amount: number;
    total: number;
};

export type Customer = {
    name: string;
    email: string;
    phone: string;
    website: string;
    address: string;
};

export type Invoice = {
    id: string;
    customer: Customer;
    date: string;
    items: InvoiceItem[];
    subtotal: number;
    discount: number;
    vat: number;
    total: number;
    paid: number;
    due: number;
};