import { NextResponse } from 'next/server';
import { updateUserPassword } from '@/data/utils';

export async function POST(request: Request) {
    try {
        const { newPassword } = await request.json();
        
        // Update password in the users.json file
        const success = await updateUserPassword('admin', newPassword);
        
        if (!success) {
            return NextResponse.json(
                { success: false, message: 'Failed to update password' },
                { status: 500 }
            );
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Password update error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update password' },
            { status: 500 }
        );
    }
}