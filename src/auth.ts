import NextAuth, { type DefaultSession } from 'next-auth';
import GitHub from 'next-auth/providers/github';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [GitHub({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  })],
  callbacks: {
    jwt({ token, profile }) {
      if (profile) {
        token.id = profile.id;
        token.image = profile.avatar_url || profile.picture;
      }
      return token;
    },
    authorized({ auth }) {
      // this ensures there is a logged in user for -every- request
      return (
        process.env.GITHUB_ADMIN_EMAIL !== undefined &&
        process.env.GITHUB_ADMIN_EMAIL === auth?.user?.email
      );
    },
  },
  pages: {
    // overrides the next-auth default sign-in page
    signIn: '/sign-in',
  },
});
