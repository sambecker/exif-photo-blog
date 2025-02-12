'use client';

import { clsx } from 'clsx/lite';
import Container from '@/components/Container';
import Spinner from '@/components/Spinner';
import CopyButton from '@/components/CopyButton';
import { useCallback, useEffect, useState } from 'react';
import { generateAuthSecretAction } from '@/auth/actions';
import { BiRefresh } from 'react-icons/bi';

export default function SecretGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [secret, setSecret] = useState('');

  const getSecret = useCallback(async () => {
    setIsLoading(true);
    await generateAuthSecretAction()
      .then(setSecret)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    getSecret();
  }, [getSecret]);

  return (
    <div className="flex items-center gap-2">
      <Container className="my-1.5 inline-flex" padding="tight">
        <div className={clsx(
          'flex flex-nowrap items-center gap-2 leading-none -mx-1',
        )}>
          {secret ? <span>{secret}</span> : <Spinner />}
          <div
            className="flex items-center gap-0.5 translate-y-[-2px]"
          >
            <CopyButton label="Secret" text={secret} />
          </div>
        </div>
      </Container>
      {secret && <div className="flex items-center justify-center w-6">
        {isLoading
          ? <Spinner />
          : <BiRefresh
            className="cursor-pointer active:translate-y-[1px] shrink-0"
            onClick={getSecret}
            size={18}
          />}
      </div>}
    </div>
  );
}
