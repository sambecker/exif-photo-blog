'use client';

import FieldSet from '@/components/FieldSet';
import InfoBlock from '@/components/InfoBlock';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <InfoBlock
      className="space-y-8"
      padding="normal"
    >
      <div className="space-y-4">
        <FieldSet
          id="email"
          label="Admin Email"
          value={email}
          onChange={setEmail}
        />
        <FieldSet
          id="password"
          label="Admin Password"
          value={password}
          onChange={setPassword}
          type="password"
        />
      </div>
      <button
        onClick={() => signIn(
          'credentials',
          {
            email,
            password,
            callbackUrl: '/admin/photos',
          },
        )}
      >
        Sign in
      </button>
    </InfoBlock>
  );
}
// 