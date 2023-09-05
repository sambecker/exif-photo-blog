import { cc } from '@/utility/css';
import { SignIn } from '@clerk/nextjs';

export const runtime = 'edge';

export default function SignInPage() {
  return (
    <div className={cc(
      'fixed top-0 left-0 right-0 bottom-0',
      'flex items-center justify-center',
      'translate-x-2',
    )}>
      <SignIn />
    </div>
  );
}
