'use client';

import { useAppState } from '@/state/AppState';
import SignInForm from '@/auth/SignInForm';
import clsx from 'clsx/lite';
import PhotoUploadWithStatus from '@/photo/PhotoUploadWithStatus';
import { useAppText } from '@/i18n/state/client';

export default function SignInOrUploadClient({
  shouldResize,
  onLastUpload,
}: {
  shouldResize: boolean
  onLastUpload: () => Promise<void>
}) {
  const { isUserSignedIn, isCheckingAuth } = useAppState();

  const appText = useAppText();

  return (
    <div className={clsx(
      'flex justify-center items-center flex-col gap-4',
      'min-h-[4.5rem]',
    )}>
      <div>
        {isCheckingAuth
          ? appText.misc.loading
          : isUserSignedIn
            ? appText.onboarding.setupFirstPhoto
            : appText.onboarding.setupSignIn}
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
