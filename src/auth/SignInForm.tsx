'use client';

import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import InfoBlock from '@/components/InfoBlock';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { signIn } from 'next-auth/react';
import { useLayoutEffect, useRef, useState } from 'react';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <InfoBlock>
      <form
        className="space-y-8"
        onSubmitCapture={e => {
          e.preventDefault();
          setIsSigningIn(true);
          signIn(
            'credentials',
            {
              email,
              password,
              callbackUrl: '/admin/photos',
            },
          )
            .catch(() => setIsSigningIn(false));
        }}
      >
        <div className="space-y-4">
          <FieldSetWithStatus
            id="email"
            inputRef={emailRef}
            label="Admin Email"
            value={email}
            onChange={setEmail}
            readOnly={isSigningIn}
          />
          <FieldSetWithStatus
            id="password"
            label="Admin Password"
            type="password"
            value={password}
            onChange={setPassword}
            readOnly={isSigningIn}
          />
        </div>
        <SubmitButtonWithStatus disabled={isSigningIn}>
          Sign in
        </SubmitButtonWithStatus>
      </form>
    </InfoBlock>
  );
}
