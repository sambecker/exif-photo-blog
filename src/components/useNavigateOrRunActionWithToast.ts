import { toastWaiting } from '@/toast';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useTransition } from 'react';
import { toast } from 'sonner';

export default function useNavigateOrRunActionWithToast({
  pathOrAction,
  toastMessage = 'Loading...',
  dismissDelay = 500,
}: {
  pathOrAction?: string | (() => Promise<any> | undefined)
  toastMessage?: string
  dismissDelay?: number
}) {
  const router = useRouter();

  const toastId = useRef<string | number>(undefined);
  
  const [isPending, startTransition] = useTransition();
  
  useEffect(() => {
    const dismissToast = () => {
      if (toastId.current) {
        return setTimeout(() => {
          toast.dismiss(toastId.current);
        }, dismissDelay);
      }
    };
    if (!isPending) {
      const timeout = dismissToast();
      return () => clearTimeout(timeout);
    }
    return () => {
      dismissToast();
    };
  }, [isPending, dismissDelay]);

  const navigateOrRunAction = useCallback(() => {
    if (typeof pathOrAction === 'string') {
      startTransition(() => {
        router.push(pathOrAction);
        toastId.current = toastWaiting(toastMessage);
      });
    } else if (typeof pathOrAction === 'function') {
      const result = pathOrAction();
      if (result instanceof Promise) {
        const toastId = toastWaiting(toastMessage);
        result.finally(() => {
          setTimeout(() => {
            toast.dismiss(toastId);
          }, 1000);
        });
      }
    }
  }, [pathOrAction, router, toastMessage]);

  return navigateOrRunAction;
}
