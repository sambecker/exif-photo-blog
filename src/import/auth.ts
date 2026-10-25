import { createHash, verify } from 'node:crypto';

export const verifyImportRequest = (
  request: Pick<Request, 'method' | 'url' | 'headers'>,
  rawBody: Uint8Array,
  publicKey: string | undefined,
  now = Date.now(),
): boolean => {
  const timestamp = request.headers.get('x-import-timestamp');
  const signature = request.headers.get('x-import-signature');
  if (
    !publicKey || !timestamp || !signature || !/^\d+$/.test(timestamp) ||
    !Number.isSafeInteger(Number(timestamp)) ||
    Math.abs(now - Number(timestamp)) > 300_000 ||
    !/^[A-Za-z0-9+/]{86}==$/.test(signature)
  ) {
    return false;
  }

  try {
    const pathname = new URL(request.url).pathname;
    const hash = createHash('sha256').update(rawBody).digest('hex');
    const message = `${request.method}\n${pathname}\n${timestamp}\n${hash}`;
    return verify(
      null,
      Buffer.from(message, 'utf8'),
      publicKey.replace(/\\n/g, '\n'),
      Buffer.from(signature, 'base64'),
    );
  } catch {
    return false;
  }
};
