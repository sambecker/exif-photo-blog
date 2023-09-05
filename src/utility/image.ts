export const getNextImageUrlForRequest = (
  imageUrl: string,
  request: Request,
  width: number,
  quality = 75,
) => {
  const protocol = (request.headers.get('x-forwarded-proto') || 'https')
    .split(',')[0];
  
  const host = (
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host')
  );

  const url = new URL(`${protocol}://${host}/_next/image`);
  url.searchParams.append('url', imageUrl);
  url.searchParams.append('w', width.toString());
  url.searchParams.append('q', quality.toString());

  return url.toString();
};
