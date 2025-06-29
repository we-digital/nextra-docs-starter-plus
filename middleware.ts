import { NextRequest, NextResponse } from 'next/server'
import { getSession, deleteSession } from './lib/session'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Add pathname to headers for use in components
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  
  // Skip auth check for API routes
  if (pathname.startsWith('/api/')) {
    return response
  }
  
  // Check if authentication is enabled
  const authEnabled = process.env.AUTH_ENABLED !== 'false'
  
  // If auth is disabled, handle special cases
  if (!authEnabled) {
    // Check if there's an existing session and clear it
    const session = await getSession()
    if (session) {
      await deleteSession()
    }
    
    // Redirect /login to / when auth is disabled
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    return response
  }
  
  // Check for session
  const session = await getSession()
  
  // If accessing login page while authenticated, redirect to home
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // If accessing login page without session, allow access
  if (pathname === '/login') {
    return response
  }
  
  // If no session for protected routes, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp|.*\\.ico|.*\\.css|.*\\.js).*)'
  ],
} 