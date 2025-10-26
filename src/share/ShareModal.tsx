'use client';

import Modal from '@/components/Modal';
import { TbPhotoShare } from 'react-icons/tb';
import { clsx } from 'clsx/lite';
import { BiCopy } from 'react-icons/bi';
import { ReactNode, useCallback, useEffect } from 'react';
import { shortenUrl } from '@/utility/url';
import { toastSuccess } from '@/toast';
import { SOCIAL_NETWORKS } from '@/app/config';
import { useAppState } from '@/app/AppState';
import useOnPathChange from '@/utility/useOnPathChange';
import { IoArrowUp } from 'react-icons/io5';
import MaskedScroll from '@/components/MaskedScroll';
import { useAppText } from '@/i18n/state/client';
import SocialButton from '@/social/SocialButton';
import LoaderButton from '@/components/primitives/LoaderButton';

const BUTTON_COLOR_CLASSNAMES = clsx(
  'border-gray-200 bg-gray-50 active:bg-gray-100',
  // eslint-disable-next-line max-len
  'dark:border-gray-800 dark:bg-gray-900/75 dark:hover:bg-gray-800/75 dark:active:bg-gray-900',
);

export default function ShareModal({
  title,
  pathShare,
  socialText,
  navigatorTitle,
  navigatorText,
  children,
}: {
  title?: string
  pathShare: string
  socialText: string
  navigatorTitle: string
  navigatorText?: string
  children: ReactNode
}) {
  const {
    setShareModalProps,
    setShouldRespondToKeyboardCommands,
  } = useAppState();

  const appText = useAppText();

  useEffect(() => {
    setShouldRespondToKeyboardCommands?.(false);
    return () => setShouldRespondToKeyboardCommands?.(true);
  }, [setShouldRespondToKeyboardCommands]);

  const renderButton = (
    icon: ReactNode,
    action: () => void,
    embedded?: boolean,
    tooltip?: string,
  ) =>
    <LoaderButton
      className={clsx(
        'flex items-center justify-center h-10',
        'px-3',
        embedded
          ? 'border-t-0 border-b-0 border-r-0 rounded-none'
          : 'border rounded-md',
        BUTTON_COLOR_CLASSNAMES,
        'cursor-pointer',
      )}
      onClick={action}
      tooltip={tooltip}
    >
      {icon}
    </LoaderButton>;

  const clearShareModalProps = useCallback(() =>
    setShareModalProps?.(undefined),
  [setShareModalProps]);

  useOnPathChange(clearShareModalProps);

  return (
    <Modal onClose={clearShareModalProps}>
      <div className="space-y-2 w-full">
        {title &&
          <div className={clsx(
            'flex items-center gap-x-3',
            'text-2xl leading-snug',
          )}>
            <TbPhotoShare size={22} className="hidden xs:block" />
            <div className="grow">
              {title}
            </div>
          </div>}
        {children}
        <div className="flex items-stretch h-10 gap-2">
          <div className={clsx(
            'rounded-md',
            'w-full overflow-hidden',
            'flex items-center justify-stretch',
            'border-medium',
          )}>
            <MaskedScroll
              className="flex grow"
              direction="horizontal"
              fadeSize={50}
              scrollToEndOnMount
            >
              <div className="whitespace-nowrap px-2 sm:px-3">
                {shortenUrl(pathShare)}
              </div>
            </MaskedScroll>
            {renderButton(
              <BiCopy size={18} />,
              () => {
                navigator.clipboard.writeText(pathShare);
                toastSuccess(appText.photo.copied);
              },
              true,
              appText.tooltip.shareCopy,
            )}
          </div>
          {SOCIAL_NETWORKS.map(key =>
            <SocialButton
              key={key}
              socialKey={key}
              path={pathShare}
              text={socialText}
              className={clsx(
                'h-full',
                BUTTON_COLOR_CLASSNAMES,
              )}
            />)}
          {typeof navigator !== 'undefined' && navigator.share &&
            renderButton(
              <IoArrowUp size={18} />,
              () => navigator.share({
                title: navigatorTitle,
                text: navigatorText,
                url: pathShare,
              })
                .catch(() => console.log('Share canceled')),
              false,
              appText.tooltip.shareTo,
            )}
        </div>
      </div>
    </Modal>
  );
};
