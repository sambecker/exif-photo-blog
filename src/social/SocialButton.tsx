import { FaFacebookF, FaLinkedin, FaThreads } from 'react-icons/fa6';
import { generateSocialUrl, SocialKey, tooltipForSocialKey } from '.';
import { PiXLogo } from 'react-icons/pi';
import Link from 'next/link';
import clsx from 'clsx';
import Tooltip from '@/components/Tooltip';

const iconForSocialKey = (key: SocialKey) => {
  switch (key) {
    case 'x': return <PiXLogo size={18} />;
    case 'threads': return <FaThreads size={18} />;
    case 'facebook': return <FaFacebookF size={14} />;
    case 'linkedin': return <FaLinkedin size={16} />;
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
  return <Tooltip content={tooltipForSocialKey(socialKey)}>
    <Link
      className={clsx(
        'button',
        className,
      )}
      href={generateSocialUrl(socialKey, path, text)}
      target="_blank"
      // tooltip={tooltipForSocialKey(socialKey)}
    >
      {iconForSocialKey(socialKey)}
    </Link>
  </Tooltip>;
}