'use client';

import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import Container from '@/components/Container';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getAuthAction, signInAction } from './actions';
import ErrorNote from '@/components/ErrorNote';
import {
  KEY_CALLBACK_URL,
  KEY_CREDENTIALS_SIGN_IN_ERROR,
  KEY_CREDENTIALS_SUCCESS,
} from '.';
import { useSearchParams } from 'next/navigation';
import { useAppState } from '@/state/AppState';
import { clsx } from 'clsx/lite';
import { PATH_ADMIN_PHOTOS } from '@/app/paths';
import IconLock from '@/components/icons/IconLock';
import { useAppText } from '@/i18n/state/client';

export default function SignInForm({
  includeTitle = true,
  shouldRedirect = true,
  className,
}: {
  includeTitle?: boolean
  shouldRedirect?: boolean
  className?: string
}) {
  const params = useSearchParams();

  const { setUserEmail } = useAppState();

  const appText = useAppText();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, action] = useActionState(signInAction, undefined);

  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const timeout = setTimeout(() => emailRef.current?.focus(), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (response === KEY_CREDENTIALS_SUCCESS) {
      setUserEmail?.(email);
    }
  }, [setUserEmail, response, email]);

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
    <Container
      className={clsx(
        'w-[calc(100vw-1.5rem)] sm:w-[min(360px,90vw)]',
        'px-6 py-5',
        className,
      )}
    >
      {includeTitle &&
        <h1 className={clsx(
          'flex gap-3 items-center justify-center',
          'self-start text-2xl',
          'mb-6',
        )}>
          <IconLock className="text-main translate-y-[0.5px]" />
          <span className="text-main">
            {appText.auth.signIn}
          </span>
        </h1>}
      <form action={action} className="w-full">
        <div className="space-y-5 w-full -translate-y-0.5">
          {response === KEY_CREDENTIALS_SIGN_IN_ERROR &&
            <ErrorNote>
              {appText.auth.invalidEmailPassword}
            </ErrorNote>}
          <div className="space-y-4 w-full">
            <FieldSetWithStatus
              id="email"
              inputRef={emailRef}
              label={appText.auth.email}
              type="email"
              value={email}
              onChange={setEmail}
            />
            <FieldSetWithStatus
              id="password"
              label={appText.auth.password}
              type="password"
              value={password}
              onChange={setPassword}
            />
            {shouldRedirect &&
              <input
                type="hidden"
                name={KEY_CALLBACK_URL}
                value={params.get(KEY_CALLBACK_URL) || PATH_ADMIN_PHOTOS}
              />}
          </div>
          <SubmitButtonWithStatus disabled={!isFormValid}>
            {appText.auth.signIn}
          </SubmitButtonWithStatus>
        </div>
      </form>
    </Container>
  );
}
