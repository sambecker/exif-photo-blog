import { useAppText } from '@/i18n/state/client';
import { toastWaiting } from '@/toast';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useTransition } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { toast } from 'sonner';

export default function useNavigateOrRunActionWithToast({
  pathOrAction,
  toastMessage: _toastMessage,
  dismissDelay = 1500,
}: {
  pathOrAction?: string | (() => Promise<any> | undefined)
  toastMessage?: string
  dismissDelay?: number
}) {
  const router = useRouter();

  const appText = useAppText();

  const toastMessage = _toastMessage ?? appText.utility.loading;

  const toastId = useRef<string | number>(undefined);
  
  const [isPending, startTransition] = useTransition();

  const dismissToast = useCallback(() => {
    if (toastId.current) {
      toast(toastMessage, {
        id: toastId.current,
        icon: <FiCheckSquare size={16} />,
      });
      return setTimeout(() => {
        toast.dismiss(toastId.current);
      }, dismissDelay);
    }
  }, [dismissDelay, toastMessage]);
  
  useEffect(() => {
    if (!isPending) {
      const timeout = dismissToast();
      return () => clearTimeout(timeout);
    }
    return () => {
      dismissToast();
    };
  }, [isPending, dismissDelay, dismissToast]);

  const navigateOrRunAction = useCallback(() => {
    if (typeof pathOrAction === 'string') {
      startTransition(() => {
        router.push(pathOrAction);
        toastId.current = toastWaiting(toastMessage);
      });
    } else if (typeof pathOrAction === 'function') {
      const result = pathOrAction();
      if (result instanceof Promise) {
        toastId.current = toastWaiting(toastMessage);
        result.finally(() => {
          dismissToast();
        });
      }
    }
  }, [dismissToast, pathOrAction, router, toastMessage]);

  return navigateOrRunAction;
}
