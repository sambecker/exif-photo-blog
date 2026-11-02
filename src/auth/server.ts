import { getPathAliasTarget, isPathProtected } from '@/app/path';
import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { NextResponse } from 'next/server';
import { checkRateLimitAndThrow } from '@/platforms/rate-limit';
import { createHash, timingSafeEqual } from 'node:crypto';

const SIGN_IN_ATTEMPTS_PER_MINUTE = 5;

// Hash to equal lengths since `timingSafeEqual` requires matching sizes
const hashForComparison = (value: string) =>
  createHash('sha256').update(value).digest();

const isSecretEqual = (input: unknown, secret?: string) =>
  typeof input === 'string' &&
  Boolean(secret) &&
  timingSafeEqual(hashForComparison(input), hashForComparison(secret!));

const getRequestIp = (request: Request) =>
  request.headers.get('x-real-ip') ||
  request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
  'unknown';

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
      async authorize({ email, password }, request) {
        // No-op when no rate limiting provider is configured
        await checkRateLimitAndThrow({
          identifier: `sign-in-${getRequestIp(request)}`,
          tokens: SIGN_IN_ATTEMPTS_PER_MINUTE,
          duration: '1m',
        });
        // Compare both fields so timing doesn't reveal which one matched
        const isEmailValid =
          isSecretEqual(email, process.env.ADMIN_EMAIL);
        const isPasswordValid =
          isSecretEqual(password, process.env.ADMIN_PASSWORD);
        if (isEmailValid && isPasswordValid) {
          const user: User = { email: email as string, name: 'Admin User' };
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
