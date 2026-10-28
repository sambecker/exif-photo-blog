# Photo import

Requires Node >= 22 and S3, Cloudflare R2, or MinIO storage. The script signs
in with the site's admin credentials, read from `ADMIN_EMAIL` and
`ADMIN_PASSWORD` in the environment (the same values set on the server), and
sends the resulting Auth.js session cookie with each `/api/import/*` request.
Without an admin session, import endpoints return 401.

```sh
export ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=...

node scripts/photo-import.mjs \
  --base https://photos.example.com \
  upload /path/to/photo.jpg --title 'Photo title'

node scripts/photo-import.mjs \
  --base https://photos.example.com list --hidden only
```

Uploads are hidden by default; add `--visible` to make a photo visible.
Upload output is one JSON line; `title` is the supplied override, or `null`
when the existing server pipeline selects the title from EXIF/AI.
List output is JSON, up to 10,000 photos; `--hidden` accepts `include` (default),
`only`, or `exclude`. Extensions: jpg, jpeg, png, heic, webp.
Image bytes go directly to storage via presigned PUT, avoiding the serverless
request body limit of 4.5 MB. Existing photo processing limits still apply.
Uploads are not idempotent: use `list` before retrying an uncertain upload.

Sign-in uses the standard Auth.js credentials flow: `GET /api/auth/csrf`, then
`POST /api/auth/callback/credentials` with `csrfToken`, `email`, and `password`.
Wrong credentials produce no session cookie and the script exits with an error.

For proxies, Node 24 supports `HTTPS_PROXY` with `node --use-env-proxy`.
