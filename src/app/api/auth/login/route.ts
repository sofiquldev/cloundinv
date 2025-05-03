import { NextResponse } from 'next/server';
import { validateUser } from '@/data/utils';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        const isValid = await validateUser(username, password);

        if (isValid) {
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict' as const,
                path: '/',
            };
            
            const response = NextResponse.json({ success: true });
            response.cookies.set('auth', 'true', cookieOptions);
            
            return response;
        }

        return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
        );
    } catch (e) {
        console.error('Login error:', e);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
}