'use client';

import { signIn } from 'next-auth/react';

export default function LoginButton() {
  return (
    <div
      className="button"
      onClick={() => signIn('github', { callbackUrl: '/' })}
    >
      Sign in
    </div>
  );
}