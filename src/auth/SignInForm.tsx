'use client';

import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import InfoBlock from '@/components/InfoBlock';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { useLayoutEffect, useRef, useState } from 'react';
import { signInAction } from './action';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailRef = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <InfoBlock>
      <form
        className="space-y-8"
        action={signInAction}
      >
        <div className="space-y-4">
          <FieldSetWithStatus
            id="email"
            inputRef={emailRef}
            label="Admin Email"
            type="email"
            value={email}
            onChange={setEmail}
          />
          <FieldSetWithStatus
            id="password"
            label="Admin Password"
            type="password"
            value={password}
            onChange={setPassword}
          />
        </div>
        <SubmitButtonWithStatus>
          Sign in
        </SubmitButtonWithStatus>
      </form>
    </InfoBlock>
  );
}
