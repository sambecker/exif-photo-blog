# 📷 `EXIF` Photo Blog

https://github.com/sambecker/exif-photo-blog/assets/169298/4253ea54-558a-4358-8834-89943cfbafb4

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-title=Photo+Blog&demo-description=Store+photos+with+original+camera+data&demo-url=https%3A%2F%2Fphotos.sambecker.com&demo-image=https%3A%2F%2Fphotos.sambecker.com%2Ftemplate-image-tight&project-name=Photo+Blog&repository-name=exif-photo-blog&repository-url=https%3A%2F%2Fgithub.com%2Fsambecker%2Fexif-photo-blog&from=templates&skippable-integrations=1&teamCreateStatus=hidden&stores=%5B%7B%22type%22%3A%22postgres%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)

Example App
-
https://photos.sambecker.com

Features
-
- Photo upload with EXIF extraction
- Photo tagging
- Infinite scroll
- Built-in auth
- Light/dark mode
- Automatic OG image generation

<img src="/readme/og-image-share.png" alt="OG Image Preview" width=600 />

Installation
-
### 1. Deploy to Vercel

1. Click Deploy
2. Add required storage ([Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) + [Vercel Blob](https://vercel.com/docs/storage/vercel-blob))
3. Add environment variables
- `NEXT_PUBLIC_SITE_TITLE` (e.g., My Photos)
- `NEXT_PUBLIC_SITE_DOMAIN` (e.g., photos.domain.com)
- `NEXT_PUBLIC_SITE_DESCRIPTION` (optional—mainly used for OG meta)

### 2. Setup Auth

1. [Generate auth secret](https://generate-secret.vercel.app/32)
2. Add to environment variables:
- `AUTH_SECRET`
3. Add admin user to environment variables:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`


### 3. Upload your first photo
1. Visit `/admin`
2. Click "Choose File"
3. Title your photo
4. Click "Create"

### 4. Develop locally

1. Clone code
2. Install dependencies `pnpm i`
3. Run `vc dev` to utilize Vercel-stored environment variables

### 5. Add Analytics (optional)

1. Open project on Vercel
2. Click "Analytics" tab
3. Follow "Enable Web Analytics" instructions (`@vercel/analytics` is already part of your project)

### 6. Optional configuration

1. Set `NEXT_PUBLIC_HIDE_REPO_LINK = 1` to remove footer link to repo
2. Set `NEXT_PUBLIC_PRO_MODE = 1` to enable higher quality image storage
