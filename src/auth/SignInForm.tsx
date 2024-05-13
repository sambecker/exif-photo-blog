'use client';

import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import InfoBlock from '@/components/InfoBlock';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getAuthAction, signInAction } from './actions';
import { useFormState } from 'react-dom';
import ErrorNote from '@/components/ErrorNote';
import { KEY_CALLBACK_URL, KEY_CREDENTIALS_SIGN_IN_ERROR } from '.';
import { useSearchParams } from 'next/navigation';
import { useAppState } from '@/state/AppState';
import { clsx } from 'clsx/lite';
import { FiLock } from 'react-icons/fi';

export default function SignInForm() {
  const params = useSearchParams();

  const { setUserEmail } = useAppState();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, action] = useFormState(signInAction, undefined);

  const emailRef = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      // Capture user email before unmounting
      getAuthAction().then(auth =>
        setUserEmail?.(auth?.user?.email ?? undefined));
    };
  }, [setUserEmail]);

  const isFormValid =
    email.length > 0 &&
    password.length > 0;

  return (
    <InfoBlock className={clsx(
      'w-[calc(100vw-1.5rem)] sm:w-[min(360px,90vw)]',
      'px-6 py-5',
    )}>
      <h1 className={clsx(
        'flex gap-3 items-center justify-center',
        'self-start text-2xl mb-3.5',
      )}>
        <FiLock className="text-main translate-y-[0.5px]" />
        <span className="text-main">
          Sign in
        </span>
      </h1>
      <form
        action={action}
        className="w-full"
      >
        <div className="space-y-6 w-full -translate-y-0.5">
          {response === KEY_CREDENTIALS_SIGN_IN_ERROR &&
            <ErrorNote>
              Invalid email/password
            </ErrorNote>}
          <div className="space-y-4 w-full">
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
            <input
              type="hidden"
              name={KEY_CALLBACK_URL}
              value={params.get(KEY_CALLBACK_URL) ?? ''}
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
