import fs from 'fs/promises';
import path from 'path';
import { Settings, Invoice } from '@/types';

export interface User {
    username: string;
    password: string;
}

export interface UserData {
    users: User[];
}

export interface Settings {
    company: {
        name: string;
        address: string;
        phone: string;
        email: string;
        website: string;
    };
    currency: string;
    language: string;
    pageSize: string;
}

export interface InvoiceData {
    invoices: Invoice[];
}

const USER_DATA_PATH = path.join(process.cwd(), 'src/data/users.json');
const SETTINGS_DATA_PATH = path.join(process.cwd(), 'src/data/settings.json');
const INVOICES_DATA_PATH = path.join(process.cwd(), 'src/data/invoices.json');

export async function readUserData(): Promise<UserData> {
    try {
        const data = await fs.readFile(USER_DATA_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.log(error)
        // If file doesn't exist, return default structure
        return { users: [] };
    }
}

export async function writeUserData(data: UserData): Promise<void> {
    await fs.writeFile(USER_DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function readSettings(): Promise<Settings | null> {
    try {
        const data = await fs.readFile(SETTINGS_DATA_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading settings:', error);
        return null;
    }
}

export async function writeSettings(settings: Settings): Promise<void> {
    try {
        await fs.writeFile(SETTINGS_DATA_PATH, JSON.stringify(settings, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing settings:', error);
        throw new Error('Failed to save settings');
    }
}

export async function updateUserPassword(username: string, newPassword: string): Promise<boolean> {
    try {
        const data = await readUserData();
        const userIndex = data.users.findIndex((user) => user.username === username);
        if (userIndex === -1) {
            return false;
        }
        data.users[userIndex].password = newPassword;
        await writeUserData(data);
        return true;
    } catch (error) {
        console.error('Error updating password:', error);
        return false;
    }
}

export async function validateUser(username: string, password: string): Promise<boolean> {
    try {
        const data = await readUserData();
        const user = data.users.find((user) => user.username === username);
        return user?.password === password;
    } catch (error) {
        console.error('Error validating user:', error);
        return false;
    }
}

export async function resetUserPassword(username: string): Promise<string | null> {
    try {
        const data = await readUserData();
        const userIndex = data.users.findIndex((user) => user.username === username);
        if (userIndex === -1) {
            return null;
        }
        const newPassword = Math.random().toString(36).slice(-8);
        data.users[userIndex].password = newPassword;
        await writeUserData(data);
        return newPassword;
    } catch (error) {
        console.error('Error resetting password:', error);
        return null;
    }
}

export async function readInvoices(): Promise<InvoiceData> {
    try {
        const data = await fs.readFile(INVOICES_DATA_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading invoices:', error);
        return { invoices: [] };
    }
}

export async function writeInvoices(data: InvoiceData): Promise<void> {
    try {
        await fs.writeFile(INVOICES_DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing invoices:', error);
        throw new Error('Failed to save invoices');
    }
}

export async function addInvoice(invoice: Invoice): Promise<void> {
    const data = await readInvoices();
    data.invoices.push(invoice);
    await writeInvoices(data);
}

export async function updateInvoice(id: string, updatedInvoice: Partial<Invoice>): Promise<void> {
    const data = await readInvoices();
    const index = data.invoices.findIndex(invoice => invoice.id === id);
    if (index !== -1) {
        data.invoices[index] = { ...data.invoices[index], ...updatedInvoice };
        await writeInvoices(data);
    }
}

export async function deleteInvoice(id: string): Promise<void> {
    const data = await readInvoices();
    data.invoices = data.invoices.filter(invoice => invoice.id !== id);
    await writeInvoices(data);
}