'use client';

import { useSettingsStore } from '@/store/settingsStore';
import { useAuthStore } from '@/store/authStore';
import { CompanySettings, Currency, Language, PageSize } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function SettingsForm() {
    const { settings, updateSettings } = useSettingsStore();
    const updatePassword = useAuthStore((state) => state.updatePassword);
    const [companySettings, setCompanySettings] = useState<CompanySettings>(settings.company);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings');
                const data = await response.json();
                if (data.success && data.settings) {
                    updateSettings(data.settings);
                    setCompanySettings(data.settings.company);
                }
            } catch (error) {
                toast.error('Failed to load settings');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchSettings();
    }, [updateSettings]);

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCompanySettings((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            const success = await updatePassword(newPassword);
            if (success) {
                toast.success('Password updated successfully');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error('Failed to update password');
            }
        } catch {
            toast.error('Failed to update password');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const newSettings = { 
                ...settings, 
                company: companySettings 
            };
            
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSettings),
            });

            const data = await response.json();
            
            if (data.success) {
                updateSettings(newSettings);
                toast.success('Settings saved successfully!', {
                    icon: '✨',
                });
            } else {
                throw new Error(data.message || 'Failed to save settings');
            }
        } catch (error) {
            toast.error('Failed to save settings. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const currencies: Currency[] = ['USD', 'EUR', 'BDT'];
    const languages: Language[] = ['en', 'bn'];
    const pageSizes: PageSize[] = ['A4', 'POS50', 'POS70'];

    if (isLoading) {
        return <div className="flex items-center justify-center p-6">Loading settings...</div>;
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Company Information</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Company Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={companySettings.name}
                            onChange={handleCompanyChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={companySettings.address}
                            onChange={handleCompanyChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <input
                            type="text"
                            name="phone"
                            id="phone"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={companySettings.phone}
                            onChange={handleCompanyChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={companySettings.email}
                            onChange={handleCompanyChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                            Website
                        </label>
                        <input
                            type="text"
                            name="website"
                            id="website"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={companySettings.website}
                            onChange={handleCompanyChange}
                        />
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <h2 className="text-lg font-semibold mb-4">Preferences</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                                Currency
                            </label>
                            <select
                                id="currency"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={settings.currency}
                                onChange={(e) => updateSettings({ currency: e.target.value as Currency })}
                            >
                                {currencies.map((currency) => (
                                    <option key={currency} value={currency}>
                                        {currency}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                                Language
                            </label>
                            <select
                                id="language"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={settings.language}
                                onChange={(e) => updateSettings({ language: e.target.value as Language })}
                            >
                                {languages.map((lang) => (
                                    <option key={lang} value={lang}>
                                        {lang === 'en' ? 'English' : 'Bengali'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="pageSize" className="block text-sm font-medium text-gray-700">
                                Page Size
                            </label>
                            <select
                                id="pageSize"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={settings.pageSize}
                                onChange={(e) => updateSettings({ pageSize: e.target.value as PageSize })}
                            >
                                {pageSizes.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>

            <form onSubmit={handlePasswordUpdate} className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Update Password</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            minLength={6}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            minLength={6}
                            required
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    );
}