import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateUser } from '@/data/utils';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        const isValid = await validateUser(username, password);

        if (isValid) {
            // Set auth cookie
            cookies().set('auth', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });
            
            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
}