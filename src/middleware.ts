import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const isLoggedIn = request.cookies.has('auth') && request.cookies.get('auth')?.value === 'true';
    const isLoginPage = request.nextUrl.pathname === '/login';
    const isPublicRoute = 
        request.nextUrl.pathname.startsWith('/api/auth') ||
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/static') ||
        ['/favicon.ico', '/manifest.json', '/sw.js'].includes(request.nextUrl.pathname) ||
        request.nextUrl.pathname.includes('workbox-') ||
        request.nextUrl.pathname.includes('invoice-generator-icon.png');

    // Redirect to login if not authenticated and trying to access protected route
    if (!isLoggedIn && !isPublicRoute && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to home if already logged in and trying to access login page
    if (isLoggedIn && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Block access to API routes if not authenticated (except auth routes)
    if (!isLoggedIn && request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.startsWith('/api/auth')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-|invoice-generator-icon.png).*)',
    ],
};