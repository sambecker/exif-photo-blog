import { auth } from '@/auth/server';
import SignInForm from '@/auth/SignInForm';
import { PATH_ADMIN, PATH_ROOT } from '@/app/path';
import { clsx } from 'clsx/lite';
import { redirect } from 'next/navigation';
import LinkWithStatus from '@/components/LinkWithStatus';
import { IoArrowBack } from 'react-icons/io5';
import { getAppText } from '@/i18n/state/server';

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect(PATH_ADMIN);
  }

  const appText = await getAppText();
  
  return (
    <div className={clsx(
      'fixed top-0 left-0 right-0 bottom-0',
      'flex items-center justify-center flex-col gap-8',
    )}>
      <SignInForm />
      <LinkWithStatus
        href={PATH_ROOT}
        className={clsx(
          'flex items-center gap-2.5',
          'text-lg',
        )}
      >
        <IoArrowBack className="translate-y-[1px]" />
        {appText.nav.home}
      </LinkWithStatus>
    </div>
  );
}
