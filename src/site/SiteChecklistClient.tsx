'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { cc } from '@/utility/css';
import SiteChecklistRow from './SiteChecklistRow';
import { FiCheckSquare, FiExternalLink } from 'react-icons/fi';
import { BiCopy, BiRefresh } from 'react-icons/bi';
import IconButton from '@/components/IconButton';
import { toast } from 'sonner';
import InfoBlock from '@/components/InfoBlock';

export default function SiteChecklistClient({
  hasTitle,
  hasDomain,
  hasPostgres,
  hasBlob,
  hasAuth,
  hasAdminUser,
  showRefreshButton,
  secret,
}: {
  hasTitle: boolean
  hasDomain: boolean
  hasPostgres: boolean
  hasBlob: boolean
  hasAuth: boolean
  hasAdminUser: boolean
  showRefreshButton?: boolean
  secret: string
}) {
  const router = useRouter();

  const [isPendingPage, startTransitionPage] = useTransition();
  const [isPendingSecret, startTransitionSecret] = useTransition();

  const refreshPage = () => {
    startTransitionPage(router.refresh);
  };
  const refreshSecret = () => {
    startTransitionSecret(router.refresh);
  };

  const renderLink = (href: string, text: string, external = true) =>
    <>
      <a {...{
        href,
        ...external && { target: '_blank', rel: 'noopener noreferrer' },
        className: cc(
          'underline hover:no-underline',
        ),
      }}>
        {text}
      </a>
      {external &&
        <>
          &nbsp;
          <FiExternalLink
            size={14}
            className='inline translate-y-[-1.5px]'
          />
        </>}
    </>;

  const renderEnvVar = (variable: string) =>
    <div key={variable}>
      <span className={cc(
        'rounded-sm',
        'bg-gray-100 text-gray-500',
        'dark:bg-gray-800 dark:text-gray-400',
      )}>
        `{variable}`
      </span>
    </div>;

  const renderEnvVars = (variables: string[]) =>
    <div className="py-1 space-y-1">
      {variables.map(renderEnvVar)}
    </div>;

  return (
    <div className="text-sm max-w-xl space-y-4">
      <div className={cc(
        'bg-white dark:bg-black',
        'dark:text-gray-400',
        'border border-gray-200 dark:border-gray-800 rounded-md',
        'divide-y divide-gray-200 dark:divide-gray-800',
      )}>
        <SiteChecklistRow
          title="Add title"
          status={hasTitle}
          isPending={isPendingPage}
        >
          Store in environment variable:
          {renderEnvVars(['NEXT_PUBLIC_SITE_TITLE'])}
        </SiteChecklistRow>
        <SiteChecklistRow
          title="Add custom domain"
          status={hasDomain}
          isPending={isPendingPage}
          optional
        >
          Store in environment variable:
          {renderEnvVars(['NEXT_PUBLIC_SITE_DOMAIN'])}
        </SiteChecklistRow>
        <SiteChecklistRow
          title="Setup database"
          status={hasPostgres}
          isPending={isPendingPage}
        >
          {renderLink(
            'https://vercel.com/docs/storage/vercel-postgres/quickstart',
            'Create Vercel Postgres store',
          )}
          {' '}
          and connect to project
        </SiteChecklistRow>
        <SiteChecklistRow
          title="Setup blob store"
          status={hasBlob}
          isPending={isPendingPage}
        >
          {renderLink(
            'https://vercel.com/docs/storage/vercel-blob/quickstart',
            'Create Vercel Blob store',
          )}
          {' '}
          and connect to project
        </SiteChecklistRow>
        <SiteChecklistRow
          title="Setup auth"
          status={hasAuth}
          isPending={isPendingPage}
        >
          Store auth secret in environment variable:
          <InfoBlock className="my-1.5" padding="tight">
            <div className="flex items-center gap-4">
              <span>{secret}</span>
              <div className="flex items-center gap-0.5">
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(secret);
                    toast(
                      'Secret copied to clipboard', {
                        icon: <FiCheckSquare size={16} />,
                        duration: 4000,
                      },
                    );
                  }}
                >
                  <BiCopy size={16} />
                </IconButton>
                <IconButton
                  onClick={refreshSecret}
                  isLoading={isPendingSecret}
                  spinnerColor="text"
                >
                  <BiRefresh size={18} />
                </IconButton>
              </div>
            </div>
          </InfoBlock>
          {renderEnvVars(['AUTH_SECRET'])}
        </SiteChecklistRow>
        <SiteChecklistRow
          title="Setup admin user"
          status={hasAdminUser}
          isPending={isPendingPage}
        >
          Store admin email/password
          {' '}
          in environment variables:
          {renderEnvVars([
            'ADMIN_EMAIL',
            'ADMIN_PASSWORD',
          ])}
        </SiteChecklistRow>
        {showRefreshButton &&
          <div className="py-4 space-y-4">
            <button onClick={refreshPage}>
              Check
            </button>
          </div>}
      </div>
      <div className="px-10 text-gray-500">
        Changes to environment variables require a redeploy
        or reboot of local dev server
      </div>
    </div>
  );
}