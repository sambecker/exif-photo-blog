import useKeydownHandler from '@/utility/useKeydownHandler';

export default function useEscapeHandler(
  args: Omit<Parameters<typeof useKeydownHandler>[0], 'keys'>,
) {
  useKeydownHandler({
    ...args,
    keys: ['ESCAPE'],
  });
}
