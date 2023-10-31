'use client';

import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import InfoBlock from '@/components/InfoBlock';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { useLayoutEffect, useRef, useState } from 'react';
import { signInAction } from './action';
import { useFormState } from 'react-dom';
import ErrorNote from '@/components/ErrorNote';
import { CREDENTIALS_SIGN_IN_ERROR } from '.';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, action] = useFormState(signInAction, undefined);

  const emailRef = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    emailRef.current?.focus();
  }, []);

  const isFormValid =
    email.length > 0 &&
    password.length > 0;

  return (
    <InfoBlock>
      <form action={action}>
        <div className="space-y-8">
          {response === CREDENTIALS_SIGN_IN_ERROR &&
            <ErrorNote>
              Invalid email/password
            </ErrorNote>}
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
          <SubmitButtonWithStatus disabled={!isFormValid}>
            Sign in
          </SubmitButtonWithStatus>
        </div>
      </form>
    </InfoBlock>
  );
}
