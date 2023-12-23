import { NextRequest, NextResponse } from 'next/server';

export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/settings/:path*','/api/settings'],
};

const PUBLIC_FILE = /\.(.*)$/
 
export async function middleware(req: NextRequest) {
	console.log("middleware",req)
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }
 
  if (req.nextUrl.locale === 'default') {
    const locale = req.cookies.get('NEXT_LOCALE')?.value || 'ca'
 
    return NextResponse.redirect(
      new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    )
  }
}