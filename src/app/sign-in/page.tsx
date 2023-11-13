import { auth } from '@/auth';
import SignInForm from '@/auth/SignInForm';
import { PATH_ADMIN } from '@/site/paths';
import { cc } from '@/utility/css';
import { redirect } from 'next/navigation';

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect(PATH_ADMIN);
  }
  
  return (
    <div className={cc(
      'fixed top-0 left-0 right-0 bottom-0',
      'flex items-center justify-center flex-col gap-8',
    )}>
      <SignInForm />
    </div>
  );
}
