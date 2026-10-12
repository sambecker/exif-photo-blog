import { clsx } from 'clsx/lite';
import MentionHtml from '@/mention/MentionHtml';
import { MentionContent } from '@/mention';

export default function LibraryDescription({
  content,
  className,
}: {
  content: MentionContent
  className?: string
}) {
  return (
    <div className={clsx(
      'text-medium',
      '[&_a]:underline [&_a]:underline-offset-[3px]',
      '[&_a:hover]:text-main [&_a:active]:text-medium',
      className,
    )}>
      <MentionHtml content={content} />
    </div>
  );
}
