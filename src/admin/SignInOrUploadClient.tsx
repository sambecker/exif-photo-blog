'use client';

import { useAppState } from '@/state/AppState';
import SignInForm from '@/auth/SignInForm';
import clsx from 'clsx/lite';
import PhotoUploadWithStatus from '@/photo/PhotoUploadWithStatus';
import { APP_TEXT } from '@/app/config';

export default function SignInOrUploadClient({
  shouldResize,
  onLastUpload,
}: {
  shouldResize: boolean
  onLastUpload: () => Promise<void>
}) {
  const { isUserSignedIn, isCheckingAuth } = useAppState();

  return (
    <div className={clsx(
      'flex justify-center items-center flex-col gap-4',
      'min-h-[4.5rem]',
    )}>
      <div>
        {isCheckingAuth
          ? APP_TEXT.misc.loading
          : isUserSignedIn
            ? APP_TEXT.onboarding.setupFirstPhoto
            : APP_TEXT.onboarding.setupSignIn}
      </div>
      {!isCheckingAuth && isUserSignedIn === false &&
        <div className="flex justify-center my-2 sm:my-4">
          <SignInForm
            className="max-w-[90%] sm:max-w-none"
            includeTitle={false}
            shouldRedirect={false}
          />
        </div>}
      {isUserSignedIn === true &&
        <PhotoUploadWithStatus
          inputId="admin-cta"
          shouldResize={shouldResize}
          onLastUpload={onLastUpload}
          showStatusText={false}
        />}
    </div>
  );
}
