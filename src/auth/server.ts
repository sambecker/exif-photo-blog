import { getPathAliasTarget, isPathProtected } from '@/app/path';
import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { NextResponse } from 'next/server';

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  // `next build` prerenders /sign-in with no request host, which makes
  // Auth.js log UntrustedHost. Trust the host only for that build.
  // Runtime checks are unchanged, and no session cookie is present.
  ...process.env.NEXT_PHASE === 'phase-production-build' && {
    trustHost: true,
  },
  providers: [
    Credentials({
      async authorize({ email, password }) {
        if (
          process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL === email &&
          process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD === password
        ) {
          const user: User = { email, name: 'Admin User' };
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const aliasTarget = getPathAliasTarget(pathname);

      // Check aliases against their targets since rewrites skip the proxy
      const isUrlProtected = isPathProtected(aliasTarget ?? pathname);
      const isUserLoggedIn = !!auth?.user;
      const isRequestAuthorized = !isUrlProtected || isUserLoggedIn;

      if (isRequestAuthorized && aliasTarget) {
        const url = request.nextUrl.clone();
        url.pathname = aliasTarget;
        return NextResponse.rewrite(url);
      }

      return isRequestAuthorized;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
});

export const runAuthenticatedAdminServerAction = async <T>(
  callback: () => T,
): Promise<T> => {
  const session = await auth();
  if (session?.user) {
    return callback();
  } else {
    throw new Error('Unauthorized server action request');
  }
};
