import { create } from 'zustand';
import { Settings } from '@/types';

interface SettingsStore {
    settings: Settings;
    updateSettings: (settings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
    company: {
        name: '',
        address: '',
        phone: '',
        email: '',
        website: '',
    },
    currency: 'USD',
    language: 'en',
    pageSize: 'A4',
};

export const useSettingsStore = create<SettingsStore>((set) => ({
    settings: defaultSettings,
    updateSettings: (newSettings) =>
        set((state) => ({
            settings: { ...state.settings, ...newSettings },
        })),
}));