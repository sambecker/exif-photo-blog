# 📷 `EXIF` Photo Blog

https://github.com/sambecker/exif-photo-blog/assets/169298/4253ea54-558a-4358-8834-89943cfbafb4

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/sambecker-pro/clone?demo-description=Store%20photos%20with%20original%20camera%20data&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F39rys245Px3FVBGRJNYEON%2Fbf68d5c052bda9e9e5bec21878764bc3%2Fimage.png&demo-title=Photo%20Blog&demo-url=https%3A%2F%2Fphotos.sambecker.com&from=templates&project-name=Photo%20Blog&repository-name=exif-photo-blog&repository-url=https%3A%2F%2Fgithub.com%2Fsambecker%2Fexif-photo-blog&skippable-integrations=1&stores=%5B%7B%22type%22%3A%22postgres%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D&teamCreateStatus=hidden)

🎬&nbsp;&nbsp;Demo
-
https://photos.sambecker.com

✨&nbsp;&nbsp;Features
-
- Built-in auth
- Photo upload with EXIF extraction
- Organize photos by tag
- Infinite scroll
- Light/dark mode
- Automatic OG image generation
- CMD-K menu with photo search
- AI-generated text descriptions
- RSS/JSON feeds
- Support for Fujifilm recipes and film simulations

<img src="/readme/og-image-share.png" alt="OG Image Preview" width=600 />

🛠️&nbsp;&nbsp;Installation
-
### 1. Deploy to Vercel

1. Click [Deploy](https://vercel.com/new/clone?demo-title=Photo+Blog&demo-description=Store+photos+with+original+camera+data&demo-url=https%3A%2F%2Fphotos.sambecker.com&demo-image=https%3A%2F%2Fphotos.sambecker.com%2Ftemplate-image-tight&project-name=Photo+Blog&repository-name=exif-photo-blog&repository-url=https%3A%2F%2Fgithub.com%2Fsambecker%2Fexif-photo-blog&from=templates&skippable-integrations=1&teamCreateStatus=hidden&stores=%5B%7B%22type%22%3A%22postgres%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)
2. Add required storage ([Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres/quickstart#create-a-postgres-database) + [Vercel Blob](https://vercel.com/docs/storage/vercel-blob/quickstart#create-a-blob-store)) as part of template installation
3. Configure environment variable for production domain in project settings
   - `NEXT_PUBLIC_DOMAIN` (e.g., photos.domain.com—used in absolute urls and seen in navigation if no explicit nav title is set)

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

🔄&nbsp;&nbsp;Receiving updates
-
If you don't plan to change the code, or don't mind making your updates public, consider [forking](https://github.com/sambecker/exif-photo-blog/fork) this repo to easily receive future updates. If you've already set up your project on Vercel see these [migration instructions](#how-do-i-receive-template-updates).

💻&nbsp;&nbsp;Local development
-
1. Clone code
2. Run `pnpm i` to install dependencies
3. If necessary, install [Vercel CLI](https://vercel.com/docs/cli#installing-vercel-cli) and authenticate by running `vercel login`
4. Run `vercel link` to connect CLI to your project
5. Run `vercel dev` to start dev server with Vercel-managed environment variables

See FAQ for [limitations of local development](#can-i-work-locally-without-access-to-an-image-storage-provider)

🎨&nbsp;&nbsp;Further customization
-
### AI text generation

_⚠️ READ BEFORE PROCEEDING_

> _Usage of this feature will result in fees from OpenAI. When enabling AI text generation, follow all recommended mitigations in order to avoid unexpected charges and attacks. Make sure your OpenAI secret key environment variable is not prefixed with NEXT_PUBLIC._

1. Setup OpenAI
   - If you don't already have one, create an [OpenAI](https://openai.com) account and fund it (see [this thread](https://github.com/sambecker/exif-photo-blog/issues/110) if you're having issues)
   - Generate an API key and store in environment variable `OPENAI_SECRET_KEY` (make sure to enable Responses API write access if customizing permissions)
   - Setup usage limits to avoid unexpected charges (_recommended_)
2. Add rate limiting (_recommended_)
   - As an additional precaution, create an Upstash Redis store from the storage tab of the Vercel dashboard and link it to your project (if you are required to add an environment variable prefix, use `EXIF`) in order to enable rate limiting—no further configuration necessary
3. Configure auto-generated fields (optional)
   - Set which text fields auto-generate when uploading a photo by storing a comma-separated list, e.g., `AI_TEXT_AUTO_GENERATED_FIELDS = title,semantic`
   - Accepted values:
     - `all`
     - `title` (default)
     - `caption`
     - `tags` (default)
     - `semantic` (default)
     - `none`

#### Alternate AI providers (experimental)

Set `OPENAI_BASE_URL` in order to use an alternate OpenAI-compatible provider

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
- `NEXT_PUBLIC_META_TITLE` (seen in search results and browser tab)
- `NEXT_PUBLIC_META_DESCRIPTION` (seen in search results)
- `NEXT_PUBLIC_NAV_TITLE` (seen in top-right navigation, defaults to domain when not configured)
- `NEXT_PUBLIC_NAV_CAPTION` (seen in top-right navigation, beneath title)
- `NEXT_PUBLIC_PAGE_ABOUT` (seen in grid sidebar—accepts rich formatting tags: `<b>`, `<strong>`, `<i>`, `<em>`, `<u>`, `<br>`)
- `NEXT_PUBLIC_DOMAIN_SHARE` (seen in share modals where a shorter url may be desirable)

#### Performance
> ⚠️ Enabling may result in increased project usage. Static optimization [troubleshooting hints](#why-do-production-deployments-fail-when-static-optimization-is-enabled) in FAQ.

- `NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTOS = 1` enables static optimization for photo pages (`p/[photoId]`), i.e., renders pages at build time
- `NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTO_OG_IMAGES = 1` enables static optimization for OG images, i.e., renders images at build time
- `NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTO_CATEGORIES = 1` enables static optimization for photo categories (`tag/[tag]`, `shot-on/[make]/[model]`, etc.), i.e., renders pages at build time
- `NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTO_CATEGORY_OG_IMAGES = 1` enables static optimization for photo category (`tag/[tag]`, `shot-on/[make]/[model]`, etc.) OG images, i.e., renders images at build time
- `NEXT_PUBLIC_PRESERVE_ORIGINAL_UPLOADS = 1` prevents photo uploads being compressed before storing
- `NEXT_PUBLIC_IMAGE_QUALITY = 1-100` controls the quality of large photos
- `NEXT_PUBLIC_BLUR_DISABLED = 1` prevents image blur data being stored and displayed (potentially useful for limiting Postgres usage)

#### Categories
- `NEXT_PUBLIC_CATEGORY_VISIBILITY`
  - Comma-separated value controlling which photo sets appear in grid sidebar and CMD-K menu, and in what order. For example, you could move cameras above tags, and hide film simulations, by updating to `cameras,tags,lenses,recipes`.
  - Accepted values:
     - `recents` (default)
     - `years`
     - `tags` (default)
     - `cameras` (default)
     - `lenses` (default)
     - `recipes` (default)
     - `films` (default)
     - `focal-lengths`
- `NEXT_PUBLIC_HIDE_CATEGORIES_ON_MOBILE = 1` prevents categories displaying on mobile grid view
- `NEXT_PUBLIC_HIDE_CATEGORY_IMAGE_HOVERS = 1` prevents images displaying when hovering over category links
- `NEXT_PUBLIC_EXHAUSTIVE_SIDEBAR_CATEGORIES = 1` always shows expanded sidebar content
- `NEXT_PUBLIC_HIDE_TAGS_WITH_ONE_PHOTO = 1` to only show tags with 2 or more photos

#### Sorting
- `NEXT_PUBLIC_DEFAULT_SORT`
  - Sets default sort on grid/full homepages
  - Accepted values:
    - `taken-at` (default)
    - `taken-at-oldest-first`
    - `uploaded-at`
    - `uploaded-at-oldest-first`
- `NEXT_PUBLIC_NAV_SORT_CONTROL`
  - Controls sort UI on grid/full homepages
  - Accepted values:
    - `none`
    - `toggle` (default)
    - `menu`
- Color-based sorting (experimental)
  - `NEXT_PUBLIC_SORT_BY_COLOR = 1` enables color-based sorting (forces nav sort control to "menu," flags photos missing color data in admin dashboard)—color identification benefits greatly from AI being enabled
  - `NEXT_PUBLIC_COLOR_SORT_STARTING_HUE` controls which colors start first (accepts a hue of 0 to 360, default: 80)
  - `NEXT_PUBLIC_COLOR_SORT_CHROMA_CUTOFF` controls which colors are considered sufficiently vibrant (accepts a chroma of 0 to 0.37, default: 0.05):
- `NEXT_PUBLIC_PRIORITY_BASED_SORTING = 1` takes priority field into account when sorting photos (⚠️ enabling may have performance consequences)


#### Display
- `NEXT_PUBLIC_HIDE_KEYBOARD_SHORTCUT_TOOLTIPS = 1` hides keyboard shortcut hints in areas like the main nav, and previous/next photo links
- `NEXT_PUBLIC_HIDE_EXIF_DATA = 1` hides EXIF data in photo details and OG images (potentially useful for portfolios, which don't focus on photography)
- `NEXT_PUBLIC_HIDE_ZOOM_CONTROLS = 1` hides fullscreen photo zoom controls
- `NEXT_PUBLIC_HIDE_TAKEN_AT_TIME = 1` hides taken at time from photo meta
- `NEXT_PUBLIC_HIDE_REPO_LINK = 1` removes footer link to repo

#### Grid
- `NEXT_PUBLIC_GRID_HOMEPAGE = 1` shows grid layout on homepage
- `NEXT_PUBLIC_GRID_ASPECT_RATIO = 1.5` sets aspect ratio for grid tiles (defaults to `1`—setting to `0` removes the constraint)
- `NEXT_PUBLIC_SHOW_LARGE_THUMBNAILS = 1` ensures large thumbnails on photo grid views (if not configured, density is based on aspect ratio)

#### Design
- `NEXT_PUBLIC_DEFAULT_THEME = light | dark` sets preferred initial theme (defaults to `system` when not configured)
- `NEXT_PUBLIC_MATTE_PHOTOS = 1` constrains the size of each photo, and displays a surrounding border, potentially useful for photos with tall aspect ratios (colors can be customized via `NEXT_PUBLIC_MATTE_COLOR` + `NEXT_PUBLIC_MATTE_COLOR_DARK`)

#### Settings
- `NEXT_PUBLIC_GEO_PRIVACY = 1` disables collection/display of location-based data (⚠️ re-compresses uploaded images in order to remove GPS information)
- `NEXT_PUBLIC_ALLOW_PUBLIC_DOWNLOADS = 1` enables public photo downloads for all visitors (⚠️ may result in increased bandwidth usage)
- `NEXT_PUBLIC_SOCIAL_NETWORKS`
  - Comma-separated list of social networks to show in share modal
  - Accepted values:
    - `x` (default)
    - `threads`
    - `facebook`
    - `linkedin`
    - `all`
    - `none`
- `NEXT_PUBLIC_SITE_FEEDS = 1` enables feeds at `/feed.json` and `/rss.xml`
- `NEXT_PUBLIC_OG_TEXT_ALIGNMENT = BOTTOM` keeps OG image text bottom aligned (default is top)

#### Scripts & Analytics
- `PAGE_SCRIPT_URLS`
  - comma-separated list of URLs to be added to the bottom of the body tag via "next/script"
  - urls must begin with 'https'
  - ⚠️ this will invoke arbitrary script execution on every page—use with caution

## Alternate storage providers

Only one storage adapter—Vercel Blob, Cloudflare R2, AWS S3, or MinIO—can be used at a time. Ideally, this is configured before photos are uploaded (see [Issue #34](https://github.com/sambecker/exif-photo-blog/issues/34) for migration considerations). If you have multiple adapters, you can set one as preferred by storing `aws-s3`, `cloudflare-r2`, `minio`, or `vercel-blob` in `NEXT_PUBLIC_STORAGE_PREFERENCE`. See [FAQ](#will-there-be-support-for-image-storage-providers-beyond-vercel-aws-and-cloudflare) regarding unsupported providers.

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
     - `NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN`: either "your-custom-domain.com" or "pub-jf90908...s0d9f8s0s9df.r2.dev"
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

### MinIO

MinIO is a self-hosted S3-compatible object storage server.

### 1. Server/bucket setup

First, install and deploy the MinIO server, then create a bucket with public read access.

- **Install MinIO:** [Follow official documentation](https://min.io/docs/minio/linux/operations/install-deploy-manage/deploy-minio-single-node-single-drive.html) to install and deploy MinIO.
- **Create bucket:**
  ```bash
  mc mb myminio/{BUCKET_NAME}
  ```
- **Set public read policy:** Create file named `bucket-policy.json` with the following content to allow read-only access:
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "AWS": [
            "*"
          ]
        },
        "Action": [
          "s3:GetObject"
        ],
        "Resource": [
          "arn:aws:s3:::{BUCKET_NAME}/*"
        ]
      }
    ]
  }
  ```
  Next, apply this policy to your bucket:
  ```bash
  mc policy set myminio/photos bucket-policy.json
  ```
  
- **Store public configuration:** Set the following public environment variables for your application:
    - `NEXT_PUBLIC_MINIO_BUCKET`: Bucket name
    - `NEXT_PUBLIC_MINIO_DOMAIN`: MinIO server endpoint, e.g., "minio.yourdomain.com"
    - `NEXT_PUBLIC_MINIO_PORT`: (optional)
    - `NEXT_PUBLIC_MINIO_DISABLE_SSL`: Set to `1` to disable SSL (defaults to HTTPS)

### 2. Create user with restricted permissions

Create a dedicated user and a policy that grants permission to manage objects within your `BUCKET_NAME`.

- **Define user policy:** Create file named `user-policy.json`. This policy will allow the user to list the bucket contents and to get, put, and delete objects within it.
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "s3:DeleteObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:PutObject"
        ],
        "Resource": [
          "arn:aws:s3:::{BUCKET_NAME}/*",
          "arn:aws:s3:::{BUCKET_NAME}"
        ]
      }
    ]
  }
  ```
- **Create policy:** Add named policy to MinIO.
  ```bash
  mc admin policy add myminio photos-manager-policy user-policy.json
  ```
- **Create user:** Create new user with access key and secret key.
  ```bash
  mc admin user add myminio {MINIO_ACCESS_KEY} {MINIO_SECRET_ACCESS_KEY}
  ```
- **Attach policy to user:** Assign `photos-manager-policy` to the user.
  ```bash
  mc admin policy set myminio photos-manager-policy user=MINIO_ACCESS_KEY
  ```
- **Store private credentials:** Set the following private environment variables for your application. ⚠️ **Ensure these access keys are not prefixed with `NEXT_PUBLIC`**.
  - `MINIO_ACCESS_KEY`: Your MINIO_ACCESS_KEY
  - `MINIO_SECRET_ACCESS_KEY`: Your MINIO_SECRET_ACCESS_KEY

## Alternate database providers (experimental)

Vercel Postgres can be switched to another Postgres-compatible, pooling provider by updating `POSTGRES_URL`. Some providers only work when SSL is disabled, which can configured by setting `DISABLE_POSTGRES_SSL = 1`.

### Supabase
1. Ensure connection string is set to "Transaction Mode" via port `6543`
2. Disable SSL by setting `DISABLE_POSTGRES_SSL = 1`

💬 &nbsp;&nbsp;I18N
-

Partial internationalization (for non-admin, user-facing text) provided for a handful of languages. Configure locale by setting environment variable `NEXT_PUBLIC_LOCALE`.

### Supported Languages
- `bd-bn`
- `en-gb`
- `en-us`
- `id-id`
- `pt-br`
- `pt-pt`
- `tr-tr`
- `zh-cn`

To add support for a new language, open a PR following instructions in [/src/i18n/index.ts](https://github.com/sambecker/exif-photo-blog/blob/main/src/i18n/index.ts), using [en-us.ts](https://github.com/sambecker/exif-photo-blog/blob/main/src/i18n/locales/en-us.ts) as reference.

Thank you ❤️ translators: [@sconetto](https://github.com/sconetto) (`pt-br`, `pt-pt`), [@brandnholl](https://github.com/brandnholl) (`id-id`), [@TongEc](https://github.com/TongEc) (`zh-cn`), [@xahidex](https://github.com/xahidex) (`bd-bn`, `hi-in`), [@mehmetabak](https://github.com/mehmetabak) (`tr-tr`), [@simondeeley](https://github.com/simondeeley) (`en-gb`)

📖&nbsp;&nbsp;FAQ
-
#### How do I receive template updates?
> For forked repos, click "Code," then "Update branch" from the main repo page. If you originally cloned the code, you can [create a fork](https://github.com/sambecker/exif-photo-blog/fork) from GitHub, then update your Git connection from your Vercel project settings. Once you've done this, you may need to go to your project deployments page, click •••, select "Create deployment," and choose `main`.

#### How do I edit multiple photos?
> In the admin menu, select "Batch edit ..." From there, you can perform bulk tag, favorite, and delete actions.

#### Why don't my photo changes show up immediately?
> This template statically optimizes core views such as `/` and `/grid` to minimize visitor load times. Consequently, when photos are added, edited, or removed, it might take several minutes for those changes to propagate. If it seems like a change is not taking effect, try navigating to `/admin/configuration` and clicking "Clear Cache."

#### Why do production deployments fail when static optimization is enabled?
> There have been reports ([#184](https://github.com/sambecker/exif-photo-blog/issues/184#issuecomment-2629474045) + [#185](https://github.com/sambecker/exif-photo-blog/issues/185#issuecomment-2629478570)) that having large photos (over 30MB), or a CDN, e.g., Cloudflare in front of Vercel, may destabilize static optimization.

#### Why don't my older photos look right?
> As the template has evolved, EXIF fields (such as lenses) have been added, blur data is generated through a different method, and AI/privacy features have been added. In order to bring older photos up to date, either click the 'sync' button next to a photo or go to photo updates (`/admin/photos/updates`) to sync all photos that need updates.

#### Why don't my OG images load when I share a link?
> Many services such as iMessage, Slack, and X, require near-instant responses when unfurling link-based content. In order to guarantee sufficient responsiveness, consider rendering pages and image assets ahead of time by enabling static optimization by setting `NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTOS = 1` and `NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTO_OG_IMAGES = 1`. Keep in mind that this will increase platform usage.

#### Why do vertical images take up so much space?
> By default, all photos are shown full-width, regardless of orientation. Enable matting to showcase horizontal and vertical photos at similar scales by setting `NEXT_PUBLIC_MATTE_PHOTOS = 1`.

#### Why are my grid thumbnails so small?
> Thumbnail grid density (seen on `/grid`, tag overviews, and other photo sets) is dependent on aspect ratio configuration (ratios of 1 or less have more photos per row). This can be overridden by setting `NEXT_PUBLIC_SHOW_LARGE_THUMBNAILS = 1`.

#### How secure are photos marked “private?”
> While all private paths (`/tag/private/*`) require authentication, raw links to individual photo assets remain publicly accessible. Randomly generated urls from storage providers are only secure via obscurity. Use with caution.

#### My images/content have fallen out of sync with my database and/or my production site no longer matches local development. What do I do?
> Navigate to `/admin/configuration` and click "Clear Cache."

#### I'm seeing server-side runtime errors when loading a page after updating my fork. What do I do?
> Navigate to `/admin/configuration` and click "Clear Cache." If this doesn't help, [open an issue](https://github.com/sambecker/exif-photo-blog/issues/new).

#### Why can’t I upload HEIC files?
> This template relies on `sharp` to manipulate images and `next/image` to serve them, neither of which currently support HEIC (https://github.com/vercel/next.js/discussions/30043 + https://github.com/lovell/sharp/issues/3981). Fortunately, you can still upload HEIC files directly from native share controls on Apple platforms and they will automatically be converted to JPG upon upload. If you think you have a viable HEIC strategy, feel free to open a PR. See https://github.com/sambecker/exif-photo-blog/issues/229 for discussion.

#### Why are my thumbnails square?
> Absent configuration, the default grid aspect ratio is `1`. `NEXT_PUBLIC_GRID_ASPECT_RATIO` can be set to any number (for instance, `1.5` for 3:2 images) or ignored by setting to `0`.

#### Why aren't Fujifilm simulations importing alongside EXIF data?
> Fujifilm simulation data is stored in vendor-specific Makernote binaries embedded in EXIF data. Under certain circumstances an intermediary may strip out this data. For instance, there is a known issue on iOS where editing an image, e.g., cropping it, causes Makernote data loss. If simulation data appears to be missing, try importing the original file as it was stored by the camera. Additionally, if you can confirm the simulation mode, you can edit the photo and manually select it.

#### My Fujifilm recipes are missing/displaying incorrect data. What should I do?
> If you don't see a recipe, first try syncing your photo from the ••• menu, or from `/admin/photos`. If the data looks incorrect, open an issue with the file in question attached in order for it to be investigated. Fujifilm file specifications have evolved over time and recipe parsing may need to be adjusted based on camera model/vintage.

#### How do I hide Fujifilm content such as a recipes and film simulations?
> This can be accomplished by setting `NEXT_PUBLIC_CATEGORY_VISIBILITY` (which has a default value of `tags,cameras,lenses,recipes,films`) to `tags,cameras,lenses`.

#### Why do my images appear flipped/rotated incorrectly?
> For a number of reasons, only EXIF orientations: 1, 3, 6, and 8 are supported. Orientations 2, 4, 5, and 7—which make use of mirroring—are not supported.

#### Why does my image placeholder blur look different from photo to photo?
> Earlier versions of this template generated blur data on the client, which varied visually from browser to browser. Data is now generated consistently on the server. If you wish to update blur data for a particular photo, edit the photo in question, make no changes, and choose "Update."

#### Why are large, multi-photo uploads not finishing?
> The default timeout for processing multiple uploads is 60 seconds (the limit for Hobby accounts). This can be extended to 5 minutes on Pro accounts by setting `maxDuration = 300` in `src/app/admin/uploads/page.tsx`.

#### I've added my OpenAI key but can't seem to make it work. Why am I seeing connection errors?
> You may need to pre-purchase credits before accessing the OpenAI API. See [#110](https://github.com/sambecker/exif-photo-blog/issues/110) for discussion. If you've customized key permissions, make sure write access to the Responses API is enabled.

#### How do I generate AI text for preexisting photos?
> Once AI text generation is configured, photos missing text will show up in photo updates (`/admin/photos/updates`).

#### Will there be support for image storage providers beyond Vercel, AWS, Cloudflare, and MinIO?
> At this time, there are no plans to introduce support for new storage providers. The template now supports Vercel Blob, AWS S3, Cloudflare R2, and MinIO (self-hosted S3-compatible storage). While configuring other AWS-compatible providers should not be too difficult, there's nuance to consider surrounding details like IAM, CORS, and domain configuration, which can differ slightly from platform to platform. If you'd like to contribute an implementation for a new storage provider, please open a PR.

#### Can I work locally without access to an image storage provider?
> At this time, an external storage provider is necessary in order to develop locally. If you have a strategy to propose which allows files to be locally uploaded and served to `next/image` in away that mirrors an external storage provider for debugging purposes, please open a PR.

#### Can this template be self-hosted?
> Possibly. See [#116](https://github.com/sambecker/exif-photo-blog/issues/116) and [#132](https://github.com/sambecker/exif-photo-blog/issues/132) for discussion around image hosting and docker usage.

#### Why am I seeing many merge conflicts when syncing my fork?
> Previous versions of this template stored Next.js "App Router" files in `/src`, and app-level functionality in `/src/site`. If you've made customizations and are having difficulty merging updates, consider moving `/src/app` files to `/`, and renaming `src/site` to `/src/app`. Other structural changes include moving `tailwind.css` and `middleware.ts` to `/`. Additionally, it may be helpful to review [PR #195](https://github.com/sambecker/exif-photo-blog/pull/195) for an overview of the most significant changes.
