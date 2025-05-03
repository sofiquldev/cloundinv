import { NextResponse } from 'next/server';
import { resetUserPassword } from '@/data/utils';

export async function POST(request: Request) {
    try {
        const { username } = await request.json();
        
        // Reset password to the one in .env file
        const tempPassword = await resetUserPassword(username);
        
        if (!tempPassword) {
            return NextResponse.json(
                { success: false, message: 'Invalid username or configuration error' },
                { status: 401 }
            );
        }

        return NextResponse.json({ 
            success: true,
            message: 'Password has been reset',
            tempPassword
        });

    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to reset password' },
            { status: 500 }
        );
    }
}