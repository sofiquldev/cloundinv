import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    // Remove auth cookie with all necessary options
    cookies().delete('auth', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
    
    return NextResponse.json({ success: true });
}