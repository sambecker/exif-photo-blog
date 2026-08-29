'use client';

import { clsx } from 'clsx/lite';
import { pathForQuery } from '@/app/path';
import EntityLink, { EntityLinkExternalProps } from
  '@/components/entity/EntityLink';
import IconQuery from '@/components/icons/IconQuery';
import IconEdit from '@/components/icons/IconEdit';
import { useAppState } from '@/app/AppState';
import { useAppText } from '@/i18n/state/client';

export default function PhotoQuery({
  query,
  editable,
  className,
  ...props
}: {
  query: string
  // Reopen the search that produced this set instead of linking to it
  editable?: boolean
} & EntityLinkExternalProps) {
  const { setIsCommandKOpen, setNextCommandKQuery } = useAppState();

  const appText = useAppText();

  const editQuery = () => {
    setNextCommandKQuery?.(query);
    setIsCommandKOpen?.(true);
  };

  return (
    <EntityLink
      {...props}
      className={clsx(editable && 'group', className)}
      label={`“${query}”`}
      path={pathForQuery(query)}
      title={editable ? appText.nav.search : undefined}
      onClick={editable
        ? e => {
          // Leave modified clicks to the browser so the results page
          // can still be opened in a new tab or window
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
          e.preventDefault();
          editQuery();
        }
        : undefined}
      action={editable &&
        <button
          type="button"
          onClick={editQuery}
          aria-label={appText.nav.search}
          className={clsx(
            'link',
            'text-dim hover:text-main shrink-0',
            'opacity-0 transition-opacity',
            'group-hover:opacity-100 focus-visible:opacity-100',
            'translate-y-[2px]',
          )}
        >
          <IconEdit size={17}/>
        </button>}
      hoverQueryOptions={{ query }}
      icon={<IconQuery
        size={12}
        className="translate-x-[2px] translate-y-[-0.5px]"
      />}
    />
  );
}
