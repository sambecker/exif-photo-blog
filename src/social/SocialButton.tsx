import { FaFacebookF, FaLinkedin, FaThreads } from 'react-icons/fa6';
import { urlForSocial, SocialKey, tooltipForSocial } from '.';
import { PiXLogo } from 'react-icons/pi';
import Link from 'next/link';
import clsx from 'clsx/lite';
import Tooltip from '@/components/Tooltip';
import { useAppText } from '@/i18n/state/client';
import { TbQrcode } from 'react-icons/tb';

const iconForSocialKey = (key: SocialKey) => {
  switch (key) {
    case 'x': return <PiXLogo size={18} />;
    case 'threads': return <FaThreads size={18} />;
    case 'facebook': return <FaFacebookF size={14} />;
    case 'linkedin': return <FaLinkedin size={16} />;
    case 'qrcode': return <TbQrcode size={16} />;
  }
};

export default function SocialButton({
  socialKey,
  path,
  text,
  className,
}: {
  socialKey: SocialKey
  path: string
  text: string
  className?: string
}) {
  const appText = useAppText();

  return (
    <Tooltip content={tooltipForSocial(socialKey, appText)}>
      <Link
        className={clsx('button', className)}
        href={urlForSocial(socialKey, path, text)}
        target="_blank"
      >
        {iconForSocialKey(socialKey)}
      </Link>
    </Tooltip>
  );
}
