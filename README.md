# 📷 `EXIF` Photo Blog

https://github.com/sambecker/exif-photo-blog/assets/169298/4253ea54-558a-4358-8834-89943cfbafb4

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-title=Photo+Blog&demo-description=Store+photos+with+original+camera+data&demo-url=https%3A%2F%2Fphotos.sambecker.com&demo-image=https%3A%2F%2Fphotos.sambecker.com%2Ftemplate-image-tight&project-name=Photo+Blog&repository-name=exif-photo-blog&repository-url=https%3A%2F%2Fgithub.com%2Fsambecker%2Fexif-photo-blog&from=templates&skippable-integrations=1&teamCreateStatus=hidden&stores=%5B%7B%22type%22%3A%22postgres%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)

Demo App
-
https://photos.sambecker.com

Features
-
- Built-in auth
- Photo upload with EXIF extraction
- Organize photos by tag
- Infinite scroll
- Light/dark mode
- Automatic OG image generation
- CMD-K menu with photo search
- Experimental support for AI-generated descriptions
- Support for Fujifilm simulations

<img src="/readme/og-image-share.png" alt="OG Image Preview" width=600 />

Installation
-
### 1. Deploy to Vercel

1. Click [Deploy](https://vercel.com/new/clone?demo-title=Photo+Blog&demo-description=Store+photos+with+original+camera+data&demo-url=https%3A%2F%2Fphotos.sambecker.com&demo-image=https%3A%2F%2Fphotos.sambecker.com%2Ftemplate-image-tight&project-name=Photo+Blog&repository-name=exif-photo-blog&repository-url=https%3A%2F%2Fgithub.com%2Fsambecker%2Fexif-photo-blog&from=templates&skippable-integrations=1&teamCreateStatus=hidden&stores=%5B%7B%22type%22%3A%22postgres%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)
2. Add required storage ([Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres/quickstart#create-a-postgres-database) + [Vercel Blob](https://vercel.com/docs/storage/vercel-blob/quickstart#create-a-blob-store)) as part of template installation
3. Configure environment variables from project settings:
   - `NEXT_PUBLIC_SITE_TITLE` (e.g., My Photos)
   - `NEXT_PUBLIC_SITE_DOMAIN` (e.g., photos.domain.com)
   - `NEXT_PUBLIC_SITE_DESCRIPTION` (optional—mainly used for OG meta)

### 2. Setup Auth

1. [Generate auth secret](https://generate-secret.vercel.app/32) and add to environment variables:
   - `AUTH_SECRET`
2. Add admin user to environment variables:
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
3. Trigger redeploy
   - Visit project on Vercel, navigate to "Deployments" tab, click ••• button next to most recent deployment, and select "Redeploy"

### 3. Upload your first photo 🎉
1. Visit `/admin`
2. Sign in with credentials supplied in Step 2
2. Click "Upload Photos"
3. Add optional title
4. Click "Create"

Develop locally
-
1. Clone code
2. Run `pnpm i` to install dependencies
3. Set environment variable `AUTH_URL` locally (not in production) to `http://localhost:3000/api/url` (_this is a temporary limitation of `next-auth` v5.0 Beta_)
4. If necessary, install [Vercel CLI](https://vercel.com/docs/cli#installing-vercel-cli) and log in by running `vercel login`
5. Run `vercel link` to connect the CLI to your project
5. Run `vercel dev` to start dev server with Vercel-managed environment variables

Further customization
-
### Experimental AI text generation

_⚠️ READ BEFORE PROCEEDING_

> _Usage of this feature will result in fees from OpenAI. When enabling AI text generation, follow all recommended mitigations in order to avoid unexpected charges and attacks. Make sure your OpenAI secret key environment variable is not prefixed with NEXT_PUBLIC._

1. Setup OpenAI
   - If you don't already have one, create an [OpenAI](https://openai.com) account
   - Generate an API key and store in environment variable `OPENAI_SECRET_KEY`
   - Setup usage limits to avoid unexpected charges (_recommended_)
2. Add rate limiting (_recommended_)
   - As an additional precaution, create a [Vercel KV](https://vercel.com/docs/storage/vercel-kv/quickstart#create-a-kv-database) store and link it to your project in order to enable rate limiting
3. Configure auto-generated fields (optional) 
   - Set which text fields auto-generate when uploading a photo by storing a comma-separated list, e.g., `AI_TEXT_AUTO_GENERATED_FIELDS = title,semantic`
   - Accepted values: title, caption, tags, description, all, or none (default is "all")

### Web Analytics

1. Open project on Vercel
2. Click "Analytics" tab
3. Follow "Enable Web Analytics" instructions (`@vercel/analytics` already included)

### Speed Insights

1. Open project on Vercel
2. Click "Speed Insights" tab
3. Follow "Enable Speed Insights" instructions (`@vercel/speed-insights` already included)

### Optional configuration

Application behavior can be changed by configuring the following environment variables:

- `NEXT_PUBLIC_PRO_MODE = 1` enables higher quality image storage (results in increased storage usage)
- `NEXT_PUBLIC_BLUR_DISABLED = 1` prevents image blur data being stored and displayed (potentially useful for limiting Postgres usage)
- `NEXT_PUBLIC_GEO_PRIVACY = 1` disables collection/display of location-based data
- `NEXT_PUBLIC_IGNORE_PRIORITY_ORDER = 1` prevents `priority_order` field affecting photo order
- `NEXT_PUBLIC_PUBLIC_API = 1` enables public API available at `/api`
- `NEXT_PUBLIC_HIDE_REPO_LINK = 1` removes footer link to repo
- `NEXT_PUBLIC_HIDE_FILM_SIMULATIONS = 1` prevents Fujifilm simulations showing up in `/grid` sidebar
- `NEXT_PUBLIC_HIDE_EXIF_DATA = 1` hides EXIF data in photo details and OG images (potentially useful for portfolios, which don't focus on photography)
- `NEXT_PUBLIC_GRID_ASPECT_RATIO = 1.5` sets aspect ratio for grid tiles (defaults to `1`—setting to `0` removes the constraint)
- `NEXT_PUBLIC_OG_TEXT_ALIGNMENT = BOTTOM` keeps OG image text bottom aligned (default is top)

## Alternate storage providers

Only one storage adapter—Vercel Blob, Cloudflare R2, or AWS S3—can be used at a time. Ideally, this is configured before photos are uploaded (see [Issue #34](https://github.com/sambecker/exif-photo-blog/issues/34) for migration considerations). If you have multiple adapters, you can set one as preferred by storing "aws-s3," "cloudflare-r2," or "vercel-blob" in `NEXT_PUBLIC_STORAGE_PREFERENCE`.

### Cloudflare R2

1. Setup bucket
   - [Create R2 bucket](https://developers.cloudflare.com/r2/) with default settings
   - Setup CORS under bucket settings:
   ```json
   [{
       "AllowedHeaders": ["*"],
       "AllowedMethods": [
         "GET",
         "PUT"
       ],
       "AllowedOrigins": [
          "http://localhost:3000",
          "https://{VERCEL_PROJECT_NAME}*.vercel.app",
          "{PRODUCTION_DOMAIN}"
       ]
   }]
   ```
   - Enable public hosting by doing one of the following:
       - Select "Connect Custom Domain" and choose a Cloudflare domain
       - OR
       - Select "Allow Access" from R2.dev subdomain
   - Store public configuration:
     - `NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET`: bucket name
     - `NEXT_PUBLIC_CLOUDFLARE_R2_ACCOUNT_ID`: account id (found on R2 overview page)
     - `NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN`: either "your-custom-domain.com" or "pub-jf90908...s0d9f8s0s9df.r2.dev" (_do not include "https://" in your domain_)
2. Setup private credentials
   - Create API token by selecting "Manage R2 API Tokens," and clicking "Create API Token"
   - Select "Object Read & Write," choose "Apply to specific buckets only," and select the bucket created in Step 1
   - Store credentials (⚠️ _Ensure access keys are not prefixed with `NEXT_PUBLIC`_):
     - `CLOUDFLARE_R2_ACCESS_KEY`
     - `CLOUDFLARE_R2_SECRET_ACCESS_KEY`

### AWS S3

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
        "https://{VERCEL_PROJECT_NAME}*.vercel.app",
        "{PRODUCTION_DOMAIN}"
      ],
      "ExposeHeaders": []
     }]
     ```
   - Store public configuration
     - `NEXT_PUBLIC_AWS_S3_BUCKET`: bucket name
     - `NEXT_PUBLIC_AWS_S3_REGION`: bucket region, e.g., "us-east-1"
2. Setup private credentials
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
   - [Create IAM user](https://console.aws.amazon.com/iam/home#/users) by choosing "Attach policies directly," and selecting the policy created above. Create "Access key" under "Security credentials," choose "Application running outside AWS," and store credentials (⚠️ _Ensure access keys are not prefixed with `NEXT_PUBLIC`_):
     - `AWS_S3_ACCESS_KEY`
     - `AWS_S3_SECRET_ACCESS_KEY`

## Alternate database providers (experimental)

Vercel Postgres can be switched to another Postgres-compatible, pooling provider by updating `POSTGRES_URL`. Some providers only work when SSL is disabled, which can configured by setting `DISABLE_POSTGRES_SSL = 1`.

### Supabase
1. Ensure connection string is set to "Transaction Mode" via port `6543`
2. Disable SSL by setting `DISABLE_POSTGRES_SSL = 1`

FAQ
-
#### Why are my thumbnails square?
> Absent configuration, the default grid aspect ratio is `1`. It can be set to any number (for instance `1.5` for 3:2 images) via `NEXT_PUBLIC_GRID_ASPECT_RATIO` or ignored entirely by setting to `0`.

#### Why don't my photo changes show up immediately?
> This template statically optimizes core views such as `/` and `/grid` to minimize visitor load times. Consequently, when photos are added, edited, or removed, it might take several minutes for those changes to propagate. If it seems like a change is not taking effect, try navigating to `/admin/configuration` and clicking "Clear Cache."

#### My images/content have fallen out of sync with my database and/or my production site no longer matches local development. What do I do?
> Navigate to `/admin/configuration` and click "Clear Cache."

#### I'm seeing server-side runtime errors when loading a page after updating my fork. What do I do?
> Navigate to `/admin/configuration` and click "Clear Cache." If this doesn't help, [open an issue](https://github.com/sambecker/exif-photo-blog/issues/new).

#### Why aren't my Fujifilm simulations importing alongside EXIF data?
> Fujifilm simulation data is stored in vendor-specific Makernote binaries embedded in EXIF data. Under certain circumstances an intermediary may strip out this data. For instance, there is a known issue on iOS where editing an image, e.g., cropping it, causes Makernote data loss. If your simulation data appears to be missing, try importing the original file as it was stored by the camera. Additionally, if you can confirm the simulation mode on camera, you can then edit the photo record and manually select it.

#### Why do my images appear flipped/rotated incorrectly?
> For a number of reasons, only EXIF orientations: 1, 3, 6, and 8 are supported. Orientations 2, 4, 5, and 7—which make use of mirroring—are not supported.

#### Why does my image placeholder blur look different from photo to photo?
> Earlier versions of this template generated blur data on the client, which varied visually from browser to browser. Data is now generated consistently on the server. If you wish to update blur data for a particular photo, edit the photo in question, make no changes, and choose "Update."
