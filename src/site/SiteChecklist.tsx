'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { cc } from '@/utility/css';
import SiteChecklistRow from './SiteChecklistRow';
import { FiExternalLink } from 'react-icons/fi';

export default function SiteChecklist({
  hasTitle,
  hasDomain,
  hasPostgres,
  hasBlob,
  hasAuth,
  showRefreshButton,
}: {
  hasTitle: boolean
  hasDomain: boolean
  hasPostgres: boolean
  hasBlob: boolean
  hasAuth: boolean
  showRefreshButton?: boolean
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const refreshSetupStatus = () => {
    startTransition(router.refresh);
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

  const renderEnvVar = (variables: string[]) =>
    <div className="py-1 space-y-1">
      {variables.map(variable =>
        <div key={variable}>
          <span className={cc(
            'rounded-sm',
            'bg-gray-100 text-gray-500',
            'dark:bg-gray-800 dark:text-gray-400',
          )}>
            `{variable}`
          </span>
        </div>)}
    </div>;

  return (
    <div className={cc(
      'text-sm',
      'max-w-xl',
      'bg-white dark:bg-black',
      'dark:text-gray-400',
      'border border-gray-200 dark:border-gray-800 rounded-md',
      'divide-y divide-gray-200 dark:divide-gray-800',
    )}>
      <SiteChecklistRow
        title="Add title"
        status={hasTitle}
        isPending={isPending}
      >
        Store in environment variable:
        {renderEnvVar(['NEXT_PUBLIC_SITE_TITLE'])}
      </SiteChecklistRow>
      <SiteChecklistRow
        title="Add domain"
        status={hasDomain}
        isPending={isPending}
      >
        Store in environment variable:
        {renderEnvVar(['NEXT_PUBLIC_SITE_DOMAIN'])}
      </SiteChecklistRow>
      <SiteChecklistRow
        title="Setup database"
        status={hasPostgres}
        isPending={isPending}
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
        isPending={isPending}
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
        isPending={isPending}
      >
        {renderLink(
          'https://clerk.com/docs/quickstarts/setup-clerk',
          'Create Clerk account',
        )}
        {' '}
        and add environment variables:
        {renderEnvVar([
          'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
          'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
          'CLERK_SECRET_KEY',
          'CLERK_ADMIN_USER_ID',
        ])}
      </SiteChecklistRow>
      <div className="py-4 space-y-4">
        <div className="px-8 text-gray-400">
          Changes to environment variables require a redeploy
          or reboot of local dev server
        </div>
        {showRefreshButton &&
          <button onClick={refreshSetupStatus}>
            Check
          </button>}
      </div>
    </div>
  );
}