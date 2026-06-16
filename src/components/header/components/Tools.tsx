'use client';

import { FC } from 'react';
import { clsx } from 'clsx/lite';
import Link from 'next/link';
import { useAppState } from '@/app/AppState';
import { useLanguage } from '@/i18n/state/LanguageContext';
import { useAppText } from '@/i18n/state/client';
import Spinner from '@/components/Spinner';

const Tools: FC = () => {
  const {
    isUserSignedIn,
    isUserSignedInEager,
    isCheckingAuth,
    clearAuthStateAndRedirectIfNecessary,
  } = useAppState();

  const { locale, setLocale } = useLanguage();
  const appText = useAppText();

  return (
    <div
      className={clsx(
        'w-1/2 text-right min-w-0 flex items-center justify-end',
        'ml-4 sm:ml-6',
      )}
    >
      {/* Language Toggle */}
      <div className='ml-3 sm:ml-4'>
        <button
          onClick={() => setLocale(locale === 'es-ar' ? 'en-us' : 'es-ar')}
          className={clsx(
            'font-mono link h-4 active:text-medium',
            'disabled:bg-transparent! hover:text-dim',
            'inline-flex items-center gap-1.5 self-start',
            'whitespace-nowrap focus:outline-hidden text-medium',
          )}
          title={appText.nav.language}
        >
          <span className='hidden sm:inline'>
            {locale === 'es-ar'
              ? appText.nav.languageEn
              : appText.nav.languageEs}
          </span>
          <span className='sm:hidden'>{locale === 'es-ar' ? 'EN' : 'ES'}</span>
        </button>
      </div>

      {/* Sign-in/Sign-out Button */}
      {isCheckingAuth && !(isUserSignedIn || isUserSignedInEager) && (
        <div
          className={clsx(
            'ml-3 sm:ml-4 inline-flex items-center self-start h-4',
          )}
        >
          <Spinner size={14} />
        </div>
      )}
      {!isCheckingAuth && (isUserSignedIn || isUserSignedInEager) && (
        <div className='ml-3 sm:ml-4'>
          <button
            onClick={() => clearAuthStateAndRedirectIfNecessary?.()}
            className={clsx(
              'font-mono link h-4 active:text-medium',
              'disabled:bg-transparent! hover:text-dim',
              'inline-flex items-center gap-1.5 self-start',
              'whitespace-nowrap focus:outline-hidden text-medium',
            )}
          >
            <span className='hidden sm:inline'>{appText.auth.signOut}</span>
            <span className='sm:hidden'>-</span>
          </button>
        </div>
      )}
      {!isCheckingAuth && !(isUserSignedIn || isUserSignedInEager) && (
        <div className='ml-3 sm:ml-4'>
          <Link
            href='/sign-in'
            className={clsx(
              'font-mono link h-4 active:text-medium',
              'disabled:bg-transparent! hover:text-dim',
              'inline-flex items-center gap-1.5 self-start',
              'whitespace-nowrap focus:outline-hidden text-medium',
            )}
          >
            <span className='hidden sm:inline'>{appText.auth.signIn}</span>
            <span className='sm:hidden'>-</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Tools;
