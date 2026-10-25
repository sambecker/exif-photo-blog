# Photo import

Requires Node >= 22 and S3, Cloudflare R2, or MinIO storage. Set the server's
`IMPORT_PUBLIC_KEY` to an Ed25519 SPKI PEM public key (real newlines or literal
`\n` escapes). Unset means all import endpoints return 404. Keep the private
key locally; no browser admin session is needed.

Generate a key pair:

```sh
openssl genpkey -algorithm ed25519 -out import.pem && openssl pkey -in import.pem -pubout
```

Or use Node:

```sh
node -e "const {publicKey,privateKey}=require('node:crypto').generateKeyPairSync('ed25519');require('node:fs').writeFileSync('import.pem',privateKey.export({type:'pkcs8',format:'pem'}),{mode:0o600});console.log(publicKey.export({type:'spki',format:'pem'}))"
```

```sh
node scripts/photo-import.mjs \
  --base https://photos.example.com --key import.pem \
  upload /path/to/photo.jpg --title 'Photo title'

node scripts/photo-import.mjs \
  --base https://photos.example.com --key import.pem list --hidden only
```

Uploads are hidden by default; add `--visible` to make a photo visible.
Upload output is one JSON line; `title` is the supplied override, or `null`
when the existing server pipeline selects the title from EXIF/AI.
List output is JSON, up to 10,000 photos; `--hidden` accepts `include` (default),
`only`, or `exclude`. Extensions: jpg, jpeg, png, heic, webp.
Image bytes go directly to storage via presigned PUT, avoiding the serverless
request body limit of 4.5 MB. Existing photo processing limits still apply.

Signed requests use `METHOD`, URL pathname (without query), Unix milliseconds,
and the SHA-256 hex digest of the exact request body, joined with newlines.
The signature is base64 Ed25519 in `x-import-signature`; the timestamp is in
`x-import-timestamp`. Server and client clocks must be within 300 seconds.
Query parameters are unsigned, and requests can be replayed within that window.
Uploads are not idempotent: use `list` before retrying an uncertain upload.

For proxies, Node 24 supports `HTTPS_PROXY` with `node --use-env-proxy`.
