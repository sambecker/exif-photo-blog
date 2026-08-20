import useMediaQuery from './useMediaQuery';

const MEDIA_QUERY_SELECTOR = '(hover: hover)';

export default function useSupportsHover() {
  return useMediaQuery(MEDIA_QUERY_SELECTOR);
}
