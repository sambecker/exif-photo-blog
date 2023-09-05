import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  afterAuth: (auth, req) => {
    if (!(
      auth.isPublicRoute ||
      auth.userId === process.env.CLERK_ADMIN_USER_ID
    )) {
      return redirectToSignIn({ returnBackUrl: req.url });
    } else {
      if (req.nextUrl.pathname === '/admin') {
        return NextResponse.redirect(new URL('/admin/photos', req.url));
      }
    }
  },
  publicRoutes: [
    '/',
    '/grid',
    '/photos/:photoId',
    '/photos/:photoId/share',
    '/photos/:photoId/image',
    '/deploy-image',
  ],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)'],
};
