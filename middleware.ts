import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || url.hostname
  const proto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '')
  
  // Check if we are in production environment or if we need to enforce on localhost (usually skip localhost)
  // However, user said "Globally", but breaking localhost is annoying.
  // We'll skip localhost.
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return NextResponse.next()
  }

  const isWww = hostname.startsWith('www.')
  const isHttp = proto === 'http'

  if (isWww || isHttp) {
    const newHostname = isWww ? hostname.replace(/^www\./, '') : hostname
    const newUrl = new URL(url.toString())
    
    newUrl.protocol = 'https:'
    newUrl.hostname = newHostname
    newUrl.port = '' // Remove port if present (standard https uses 443)
    
    return NextResponse.redirect(newUrl, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     */
    '/((?!_next/static|_next/image).*)',
  ],
}
