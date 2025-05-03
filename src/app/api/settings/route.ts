import { NextResponse } from 'next/server';
import { readSettings, writeSettings } from '@/data/utils';

export async function GET() {
    try {
        const settings = await readSettings();
        return NextResponse.json({ success: true, settings });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const settings = await request.json();
        await writeSettings(settings);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to save settings' },
            { status: 500 }
        );
    }
}