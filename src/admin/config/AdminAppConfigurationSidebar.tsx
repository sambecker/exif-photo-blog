'use client';

import clsx from 'clsx/lite';
import { getAdminConfigSections } from '.';
import { parameterize } from '@/utility/string';
import useHash from '@/utility/useHash';

export default function AdminAppConfigurationSidebar({
  simplifiedView,
  areInternalToolsEnabled,
}: {
  simplifiedView?: boolean
  areInternalToolsEnabled: boolean
}) {
  const hash = useHash();
  return (
    <div className={clsx(
      'sticky top-0 pt-2.5 -mt-2.5',
      'space-y-1 text-sm',
    )}>
      {getAdminConfigSections(areInternalToolsEnabled, simplifiedView)
        .map(({ title }) => (
          <a
            key={title}
            href={`#${parameterize(title)}`}
            className={clsx(
              'block',
              parameterize(title) === hash
                ? 'text-main hover:text-main font-medium'
                : 'text-dim hover:text-main',
            )}
          >
            {title}
          </a>
        ))}
    </div>
  );
}
