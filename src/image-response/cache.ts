export const getImageResponseCacheControlHeaders = (
  shouldCache = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production',
) => {
  return {
    'Cache-Control': shouldCache
      ? 's-maxage=3600, stale-while-revalidate=59'
      : 's-maxage=1, stale-while-revalidate=59',
  };
};
