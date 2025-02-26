import { PATH_ADMIN_CONFIGURATION, PATH_ADMIN_INSIGHTS } from '@/app/paths';
import Container from '@/components/Container';
import LinkWithStatus from '@/components/LinkWithStatus';
import ResponsiveText from '@/components/primitives/ResponsiveText';
import SiteGrid from '@/components/SiteGrid';
import clsx from 'clsx/lite';
import { ReactNode } from 'react';
import ClearCacheButton from '@/admin/ClearCacheButton';

const ADMIN_INFO_PAGES = [{
  titleShort: 'Insights',
  path: PATH_ADMIN_INSIGHTS,
},
{
  title: 'Configuration',
  titleShort: 'Config',
  path: PATH_ADMIN_CONFIGURATION,
}];

export default function AdminInfoPage({
  page,
  children,
}: {
  page: (typeof ADMIN_INFO_PAGES)[number]['titleShort']
  children: ReactNode
}) {
  return (
    <SiteGrid
      contentMain={
        <div className="space-y-4">
          <div className="flex items-center gap-4 min-h-9">
            <div className={clsx(
              'grow -translate-x-1 -translate-y-1',
              'flex items-center gap-3',
            )}>
              {ADMIN_INFO_PAGES.map(({ title, titleShort, path }) =>
                <LinkWithStatus
                  key={path}
                  href={path}
                  className={clsx(
                    page === titleShort
                      ? 'underline underline-offset-10 decoration-2'
                      : 'text-dim',
                    'px-1 py-0.5 rounded-md',
                  )}
                  loadingClassName="bg-dim"
                >
                  <ResponsiveText shortText={titleShort}>
                    {title ?? titleShort}
                  </ResponsiveText>
                </LinkWithStatus>)}
            </div>
            <ClearCacheButton />
          </div>
          <Container spaceChildren={false}>
            {children}
          </Container>
        </div>}
    />
  );
}
