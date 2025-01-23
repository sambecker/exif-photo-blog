# 📷 `EXIF` Photo Blog

https://github.com/sambecker/exif-photo-blog/assets/169298/4253ea54-558a-4358-8834-89943cfbafb4

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/sambecker-pro/clone?demo-description=Store%20photos%20with%20original%20camera%20data&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F39rys245Px3FVBGRJNYEON%2Fbf68d5c052bda9e9e5bec21878764bc3%2Fimage.png&demo-title=Photo%20Blog&demo-url=https%3A%2F%2Fphotos.sambecker.com&from=templates&project-name=Photo%20Blog&repository-name=exif-photo-blog&repository-url=https%3A%2F%2Fgithub.com%2Fsambecker%2Fexif-photo-blog&skippable-integrations=1&stores=%5B%7B%22type%22%3A%22postgres%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D&teamCreateStatus=hidden)

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
3. Configure environment variable for production domain in project settings
   - `NEXT_PUBLIC_SITE_DOMAIN` (e.g., photos.domain.com—used in permalinks and seen in top-right nav)

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
3. If necessary, install [Vercel CLI](https://vercel.com/docs/cli#installing-vercel-cli) and authenticate by running `vercel login`
4. Run `vercel link` to connect the CLI to your project
5. Run `vercel dev` to start dev server with Vercel-managed environment variables

Further customization
-
### Experimental AI text generation

_⚠️ READ BEFORE PROCEEDING_

> _Usage of this feature will result in fees from OpenAI. When enabling AI text generation, follow all recommended mitigations in order to avoid unexpected charges and attacks. Make sure your OpenAI secret key environment variable is not prefixed with NEXT_PUBLIC._

1. Setup OpenAI
   - If you don't already have one, create an [OpenAI](https://openai.com) account and fund it (see [this thread](https://github.com/sambecker/exif-photo-blog/issues/110) if you're having issues)
   - Generate an API key and store in environment variable `OPENAI_SECRET_KEY`
   - Setup usage limits to avoid unexpected charges (_recommended_)
2. Add rate limiting (_recommended_)
   - As an additional precaution, create a [Vercel KV](https://vercel.com/docs/storage/vercel-kv/quickstart#create-a-kv-database) store and link it to your project in order to enable rate limiting—no further configuration necessary
3. Configure auto-generated fields (optional) 
   - Set which text fields auto-generate when uploading a photo by storing a comma-separated list, e.g., `AI_TEXT_AUTO_GENERATED_FIELDS = title, semantic`
   - Accepted values:
     - `all` (default)
     - `title`
     - `caption`
     - `tags`
     - `semantic`
     - `none`

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

#### Content
- `NEXT_PUBLIC_SITE_TITLE` (seen in browser tab)
- `NEXT_PUBLIC_SITE_DESCRIPTION` (seen in nav, beneath title)
- `NEXT_PUBLIC_SITE_ABOUT` (seen in grid sidebar—accepts rich formatting tags: `<b>`, `<strong>`, `<i>`, `<em>`, `<u>`, `<br>`)

#### Performance
> ⚠️ Enabling may result in increased project usage
- `NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTOS = 1` enables static optimization for photo pages (`p/[photoId]`), i.e., renders pages at build time
- `NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTO_OG_IMAGES = 1` enables static optimization for OG images, i.e., renders images at build time
- `NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTO_CATEGORIES = 1` enables static optimization for photo categories (`tag/[tag]`, `shot-on/[make]/[model]`, etc.), i.e., renders pages at build time
- `NEXT_PUBLIC_PRESERVE_ORIGINAL_UPLOADS = 1` prevents photo uploads being compressed before storing

#### Display
- `NEXT_PUBLIC_HIDE_EXIF_DATA = 1` hides EXIF data in photo details and OG images (potentially useful for portfolios, which don't focus on photography)
- `NEXT_PUBLIC_HIDE_TAKEN_AT_TIME = 1` hides taken at time from photo meta
- `NEXT_PUBLIC_HIDE_SOCIAL = 1` removes X button from share modal
- `NEXT_PUBLIC_HIDE_FILM_SIMULATIONS = 1` prevents Fujifilm simulations showing up in `/grid` sidebar and CMD-K search results
- `NEXT_PUBLIC_HIDE_REPO_LINK = 1` removes footer link to repo

#### Settings
- `NEXT_PUBLIC_GRID_HOMEPAGE = 1` shows grid layout on homepage
- `NEXT_PUBLIC_DEFAULT_THEME = light | dark` sets preferred initial theme (defaults to `system` when not configured)
- `NEXT_PUBLIC_MATTE_PHOTOS = 1` constrains the size of each photo, and enables a surrounding border (potentially useful for photos with tall aspect ratios)
- `NEXT_PUBLIC_BLUR_DISABLED = 1` prevents image blur data being stored and displayed (potentially useful for limiting Postgres usage)
- `NEXT_PUBLIC_GEO_PRIVACY = 1` disables collection/display of location-based data (⚠️ re-compresses uploaded images in order to remove GPS information)
- `NEXT_PUBLIC_ALLOW_PUBLIC_DOWNLOADS = 1` enables public photo downloads for all visitors (⚠️ may result in increased bandwidth usage)
- `NEXT_PUBLIC_PUBLIC_API = 1` enables public API available at `/api`
- `NEXT_PUBLIC_IGNORE_PRIORITY_ORDER = 1` prevents `priority_order` field affecting photo order
- `NEXT_PUBLIC_GRID_ASPECT_RATIO = 1.5` sets aspect ratio for grid tiles (defaults to `1`—setting to `0` removes the constraint)
- `NEXT_PUBLIC_SHOW_LARGE_THUMBNAILS = 1` ensures large thumbnails on photo grid views
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
#### How do I receive template updates?
> For forked repos, click "Code," then "Update branch" from the main repo page. If you originally cloned the code, you can [create a fork](https://github.com/sambecker/exif-photo-blog/fork) from GitHub, then update your Git connection from your Vercel project settings. Once you've done this, you may need to go to your project deployments page, click •••, select "Create deployment," and choose `main`.

#### How do I edit multiple photos?
> On desktop, select ••• menu in the top right next to site title and choose, "Select Multiple." On mobile, "Select Multiple Photos" can be accessed from the search menu. From there, you can perform bulk tag, favorite, and delete actions.

#### Why don't my photo changes show up immediately?
> This template statically optimizes core views such as `/` and `/grid` to minimize visitor load times. Consequently, when photos are added, edited, or removed, it might take several minutes for those changes to propagate. If it seems like a change is not taking effect, try navigating to `/admin/configuration` and clicking "Clear Cache."

#### Why don't my older photos look right?
> As the template has evolved, EXIF fields (such as lenses) have been added, blur data is generated through a different method, and AI/privacy features have been added. In order to bring older photos up to date, either click the 'sync' button next to a photo or use the outdated photo page (`/admin/outdated`) to make batch updates.

#### Why don’t my OG images load when I share a link?
> Many services such as iMessage, Slack, and X, require near-instant responses when unfurling link-based content. In order to guarantee sufficient responsiveness, consider rendering pages and image assets ahead of time by enabling static optimization by setting `NEXT_PUBLIC_STATICALLY_OPTIMIZE_PAGES = 1` and `NEXT_PUBLIC_STATICALLY_OPTIMIZE_OG_IMAGES = 1`. Keep in mind that this will increase platform usage.

#### Why do vertical images take up so much space?
> By default, all photos are shown full-width, regardless of orientation. Enable matting to showcase horizontal and vertical photos at similar scales by setting `NEXT_PUBLIC_MATTE_PHOTOS = 1`.

#### Why are my grid thumbnails so small?
> Thumbnail grid density (seen on `/grid`, tag overviews, and other photo sets) is dependent on aspect ratio configuration (ratios of 1 or less have more photos per row). This can be overridden by setting `NEXT_PUBLIC_SHOW_LARGE_THUMBNAILS = 1`.

#### How secure are photos marked “hidden?”
> While all hidden paths (`/tag/hidden/*`) require authentication, raw links to individual photo assets remain publicly accessible. Randomly generated urls from storage providers are only secure via obscurity. Use with caution.

#### My images/content have fallen out of sync with my database and/or my production site no longer matches local development. What do I do?
> Navigate to `/admin/configuration` and click "Clear Cache."

#### I'm seeing server-side runtime errors when loading a page after updating my fork. What do I do?
> Navigate to `/admin/configuration` and click "Clear Cache." If this doesn't help, [open an issue](https://github.com/sambecker/exif-photo-blog/issues/new).

#### Why are my thumbnails square?
> Absent configuration, the default grid aspect ratio is `1`. `NEXT_PUBLIC_GRID_ASPECT_RATIO` can be set to any number (for instance, `1.5` for 3:2 images) or ignored by setting to `0`.

#### Why aren't Fujifilm simulations importing alongside EXIF data?
> Fujifilm simulation data is stored in vendor-specific Makernote binaries embedded in EXIF data. Under certain circumstances an intermediary may strip out this data. For instance, there is a known issue on iOS where editing an image, e.g., cropping it, causes Makernote data loss. If simulation data appears to be missing, try importing the original file as it was stored by the camera. Additionally, if you can confirm the simulation mode, you can edit the photo and manually select it.

#### Why do my images appear flipped/rotated incorrectly?
> For a number of reasons, only EXIF orientations: 1, 3, 6, and 8 are supported. Orientations 2, 4, 5, and 7—which make use of mirroring—are not supported.

#### Why does my image placeholder blur look different from photo to photo?
> Earlier versions of this template generated blur data on the client, which varied visually from browser to browser. Data is now generated consistently on the server. If you wish to update blur data for a particular photo, edit the photo in question, make no changes, and choose "Update."

#### Why are large, multi-photo uploads not finishing?
> The default timeout for processing multiple uploads is 60 seconds (the limit for Hobby accounts). This can be extended to 5 minutes on Pro accounts by setting `maxDuration = 300` in `src/app/admin/uploads/page.tsx`.

#### I've added my OpenAI key but can't seem to make it work. Why am I seeing connection errors?
> You may need to pre-purchase credits before accessing the OpenAI API. See [Issue #110](https://github.com/sambecker/exif-photo-blog/issues/110) for discussion.

#### Can this template run in a docker image?
> Possibly. See [Issue #116](https://github.com/sambecker/exif-photo-blog/issues/116) for discussion.
