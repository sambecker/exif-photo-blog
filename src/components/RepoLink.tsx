import { TEMPLATE_REPO_NAME, TEMPLATE_REPO_URL } from '@/app/config';
import { useAppText } from '@/i18n/state/client';
import { clsx } from 'clsx/lite';
import Link from 'next/link';
import { BiLogoGithub } from 'react-icons/bi';

export default function RepoLink() {
  const { footer } = useAppText();

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span className="hidden sm:inline-block">
        {footer.madeWith}
      </span>
      <Link
        href={TEMPLATE_REPO_URL}
        target="_blank"
        className={clsx(
          'flex items-center gap-0.5',
          'text-main hover:text-main',
          'hover:text-medium active:text-dim',
        )}
      >
        <BiLogoGithub
          size={16}
          className="translate-y-[0.5px] hidden xs:inline-block"
        />
        {TEMPLATE_REPO_NAME}
      </Link>
    </span>
  );
}
