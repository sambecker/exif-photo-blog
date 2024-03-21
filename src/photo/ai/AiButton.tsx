import Spinner from '@/components/Spinner';
import { AiContent } from './useAiImageQueries';
import { HiSparkles } from 'react-icons/hi';

export default function AiButton({
  aiContent: { request, isReady, isLoading },
  shouldConfirm,
}: {
  aiContent: AiContent
  shouldConfirm?: boolean
}) {
  return (
    <button
      className="min-w-[3.25rem] flex justify-center"
      onClick={() => {
        if (
          !shouldConfirm ||
          confirm('Are you sure you want to overwrite existing content?')
        ) {
          request();
        }
      }}
      disabled={!isReady || isLoading}
    >
      {isLoading ? <Spinner /> : <HiSparkles size={16} />}
    </button>
  );
}
