/** @jest-environment node */
import { createHash, generateKeyPairSync, sign } from 'node:crypto';
import { verifyImportRequest } from '../src/import/auth';

it('authenticates the timestamp, body, path, and signing key', () => {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');
  const pem = publicKey.export({ type: 'spki', format: 'pem' }).toString();
  const now = Date.now();
  const body = Buffer.from('{"extension":"jpg"}');
  const timestamp = String(now);
  const hash = createHash('sha256').update(body).digest('hex');
  const message = `POST\n/api/import/presign\n${timestamp}\n${hash}`;
  const signature = sign(null, Buffer.from(message), privateKey)
    .toString('base64');
  const request = {
    method: 'POST',
    url: 'https://photos.example/api/import/presign',
    headers: new Headers({
      'x-import-timestamp': timestamp,
      'x-import-signature': signature,
    }),
  };

  expect(verifyImportRequest(request, body, pem, now)).toBe(true);
  expect(verifyImportRequest(
    request, body, pem.replace(/\n/g, '\\n'), now,
  )).toBe(true);
  expect(verifyImportRequest(request, body, undefined, now)).toBe(false);
  expect(verifyImportRequest(request, body, 'invalid key', now)).toBe(false);
  expect(verifyImportRequest(request, body, pem, now + 300_000)).toBe(true);
  expect(verifyImportRequest(request, body, pem, now - 300_000)).toBe(true);
  expect(verifyImportRequest(request, body, pem, now - 300_001)).toBe(false);
  expect(verifyImportRequest(request, Buffer.from('{}'), pem, now)).toBe(false);
  expect(verifyImportRequest({
    ...request, method: 'GET',
  }, body, pem, now)).toBe(false);
  expect(verifyImportRequest({
    ...request,
    url: 'https://photos.example/api/import/add',
  }, body, pem, now)).toBe(false);
  expect(verifyImportRequest(request, body, pem, now + 300_001)).toBe(false);
  expect(verifyImportRequest({
    ...request,
    headers: new Headers({ 'x-import-timestamp': timestamp }),
  }, body, pem, now)).toBe(false);
  expect(verifyImportRequest({
    ...request,
    headers: new Headers({ 'x-import-signature': signature }),
  }, body, pem, now)).toBe(false);

  const otherKey = generateKeyPairSync('ed25519').privateKey;
  const otherSignature = sign(null, Buffer.from(message), otherKey)
    .toString('base64');
  expect(verifyImportRequest({
    ...request,
    headers: new Headers({
      'x-import-timestamp': timestamp,
      'x-import-signature': otherSignature,
    }),
  }, body, pem, now)).toBe(false);
});

it.each(['NaN', '-1', '1.5', '9007199254740992'])(
  'rejects malformed timestamp %s', timestamp => {
    const { publicKey, privateKey } = generateKeyPairSync('ed25519');
    const pem = publicKey.export({ type: 'spki', format: 'pem' }).toString();
    const hash = createHash('sha256').update('').digest('hex');
    const message = `POST\n/api/import/presign\n${timestamp}\n${hash}`;
    expect(verifyImportRequest({
      method: 'POST',
      url: 'https://photos.example/api/import/presign',
      headers: new Headers({
        'x-import-timestamp': timestamp,
        'x-import-signature': sign(null, Buffer.from(message), privateKey)
          .toString('base64'),
      }),
    }, Buffer.from(''), pem)).toBe(false);
  },
);

it.each(['not-base64', 'A'.repeat(88), `${'A'.repeat(85)}==`])(
  'rejects malformed signature %s', signature => {
    const { publicKey } = generateKeyPairSync('ed25519');
    const pem = publicKey.export({ type: 'spki', format: 'pem' }).toString();
    expect(verifyImportRequest({
      method: 'GET',
      url: 'https://photos.example/api/import/photos',
      headers: new Headers({
        'x-import-timestamp': String(Date.now()),
        'x-import-signature': signature,
      }),
    }, Buffer.from(''), pem)).toBe(false);
  },
);
