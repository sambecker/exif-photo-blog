# 📷 `EXIF` Photo Blog

https://github.com/sambecker/exif-photo-blog/assets/169298/4253ea54-558a-4358-8834-89943cfbafb4

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-title=Photo+Blog&demo-description=Store+photos+with+original+camera+data&demo-url=https%3A%2F%2Fphotos.sambecker.com&demo-image=https%3A%2F%2Fphotos.sambecker.com%2Ftemplate-image-tight&project-name=Photo+Blog&repository-name=exif-photo-blog&repository-url=https%3A%2F%2Fgithub.com%2Fsambecker%2Fexif-photo-blog&from=templates&skippable-integrations=1&teamCreateStatus=hidden&stores=%5B%7B%22type%22%3A%22postgres%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)

Demo App
-
https://photos.sambecker.com

Features
-
- Photo upload with EXIF extraction
- Organize photos by tag and camera model
- Infinite scroll
- Built-in auth
- Light/dark mode
- Automatic OG image generation
- Support for Fujifilm simulations

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
2. Run `pnpm i` to install dependencies
3. Set environment variable `AUTH_URL` locally (not in production) to `http://localhost:3000/api/url` (_this is a temporary limitation of `next-auth` v5.0_)
4. Run `vc dev` to start dev server, and utilize Vercel-stored environment variables

### 5. Add Analytics (optional)

1. Open project on Vercel
2. Click "Analytics" tab
3. Follow "Enable Web Analytics" instructions (`@vercel/analytics` is already part of your project)

### 6. Optional configuration

- `NEXT_PUBLIC_PRO_MODE = 1` enables higher quality image storage
- `NEXT_PUBLIC_GEO_PRIVACY = 1` disables collection/display of location-based data
- `NEXT_PUBLIC_PUBLIC_API = 1` enables public API available at `/api`
- `NEXT_PUBLIC_HIDE_REPO_LINK = 1` removes footer link to repo
- `NEXT_PUBLIC_HIDE_FILM_SIMULATIONS = 1` prevents Fujifilm simulations showing up in `/grid` sidebar
- `NEXT_PUBLIC_GRID_ASPECT_RATIO = 1.5` sets aspect ratio for grid tiles (defaults to `1`—setting to `0` removes the constraint)
- `NEXT_PUBLIC_OG_TEXT_ALIGNMENT = BOTTOM` keeps OG image text bottom aligned (default is top)

### Setup alternate storage

#### AWS S3

1. Setup bucket
   - [Create S3 bucket](https://s3.console.aws.amazon.com/s3) with "ACLs enabled," and "Block all public access" turned off
   - Setup CORS under bucket permissions:
     ```json
     [{
      "AllowedHeaders": ["*"],
      "AllowedMethods": [
        "GET",
        "PUT"
      ],
      "AllowedOrigins": [
        "http://localhost:*",
        "https://{VERCEL_PROJECT_NAME}*.vercel.app"
        "{PRODUCTION_DOMAIN}",
      ],
      "ExposeHeaders": []
     }]
     ```
   - Store configuration 
     - Bucket name: `NEXT_PUBLIC_AWS_S3_BUCKET`
     - Bucket region: `NEXT_PUBLIC_AWS_S3_REGION`
2. Setup credentials
   - [Create IAM policy](https://console.aws.amazon.com/iam/home#/policies) using JSON editor:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": [
             "s3:PutObject",
             "s3:PutObjectACL",
             "s3:GetObject",
             "s3:ListBucket",
             "s3:DeleteObject"
           ],
           "Resource": [
             "arn:aws:s3:::{BUCKET_NAME}",
             "arn:aws:s3:::{BUCKET_NAME}/*"
           ]
         }
       ]
     }
     ```
   - [Create IAM user](https://console.aws.amazon.com/iam/home#/users) by choosing "Attach policies directly," and selecting the policy created above. Create access key under "Security credentials," choose "Application running outside AWS," and store credentials (⚠️ _Ensure access keys are not prefixed with `NEXT_PUBLIC`_):
     - `AWS_S3_ACCESS_KEY`
     - `AWS_S3_SECRET_ACCESS_KEY`

FAQ
-
#### Why are my thumbnails square?
> Absent configuration, the default grid aspect ratio is `1`. It can be set to any number (for instance `1.5` for 3:2 images) via `NEXT_PUBLIC_GRID_ASPECT_RATIO` or ignored entirely by setting to `0`.

#### My images/content have fallen out of sync with my database and/or my production site no longer matches local development. What do I do?
> Navigate to `/admin/configuration` and click "Clear Cache."

#### I'm seeing server-side runtime errors when loading a page after updating my fork. What do I do?
> Navigate to `/admin/configuration` and click "Clear Cache." If this doesn't help, [open an issue](https://github.com/sambecker/exif-photo-blog/issues/new).

#### Why aren't my Fujifilm simulations importing alongside EXIF data?
> Fujifilm simulation data is stored in vendor-specific Makernote binaries embedded in EXIF data. Under certain circumstances an intermediary may strip out this data for a variety of reasons. For instance, there is a known issue on iOS where editing an image, e.g., cropping it, causes Makernote data loss. If your simulation data appears to be missing, try importing the original file as it was stored by the camera. Additionally, if you can confirm the simulation mode on camera, you can then edit the photo record and manually select it.

#### Why do my images appear flipped/rotated incorrectly?
> For a number of reasons, only EXIF orientations: 1, 3, 6, and 8 are supported. Orientations 2, 4, 5, and 7—which make use of mirroring—are not supported.
