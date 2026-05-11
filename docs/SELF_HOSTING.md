# Self-Hosting Guide

A comprehensive guide for self-hosting exif-photo-blog using Docker Compose.

## Overview

Self-hosting exif-photo-blog allows you to run the application on your own infrastructure with:

- PostgreSQL for image metadata storage
- MinIO for S3-compatible object storage
- imgproxy for image optimization and processing
- Redis for rate limiting (optional)
- Docker Compose for orchestration

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- A domain name (for production)
- Basic understanding of Docker and command line

## Quick Start

### 1. Clone and Configure

```bash
git clone https://github.com/sambecker/exif-photo-blog.git
cd exif-photo-blog
cp .env.example.production .env.production
```

### 2. Configure Environment Variables

Edit `.env.production` with your settings:

```bash
# Application - Authentication
# Generate with: openssl rand -base64 32
AUTH_SECRET=
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=
POSTGRES_DB=exif_photo_blog
POSTGRES_URL=postgresql://postgres:@postgres:5432/exif_photo_blog?sslmode=disable
DISABLE_POSTGRES_SSL=1
AUTH_TRUST_HOST=true

# Storage - MinIO
MINIO_ROOT_USER=
MINIO_ROOT_PASSWORD=
MINIO_ACCESS_KEY=
MINIO_SECRET_ACCESS_KEY=
NEXT_PUBLIC_MINIO_BUCKET=photos
NEXT_PUBLIC_MINIO_DOMAIN=
NEXT_PUBLIC_MINIO_PORT=9000

# Domain & URLs (UPDATE THESE FOR PRODUCTION)
NEXT_PUBLIC_DOMAIN=
NEXTAUTH_URL=

# Image Optimization
# Set to 'imgproxy' to use imgproxy for image optimization (recommended for self-hosting)
NEXT_PUBLIC_IMAGE_LOADER=imgproxy
NEXT_PUBLIC_IMGPROXY_URL=http://localhost:8080

# Redis (optional - for rate limiting)
KV_URL=redis://redis:6379
```

**Important:** Update `NEXT_PUBLIC_DOMAIN` and `NEXTAUTH_URL` with your actual domain.

### 3. Start the Stack

```bash
docker compose up -d
```

### 4. Configure MinIO

1. Access MinIO Console at `http://localhost:9001` (or your domain:9001)
2. Log in with `MINIO_ROOT_USER` and `MINIO_ROOT_PASSWORD`
3. Verify the `photos` bucket exists (created automatically)
4. Check that the bucket has public read access

```bash
# Using mc CLI
docker compose exec minio mc alias set local http://localhost:9000 <MINIO_ROOT_USER> <MINIO_ROOT_PASSWORD>
docker compose exec minio mc ls local/photos
docker compose exec minio mc anonymous get local/photos
```

### 5. Access the Application

- Application: `http://localhost:3000` (or your domain)
- Admin: `http://localhost:3000/admin`
- imgproxy: `http://localhost:8080` (image optimization service)

## Services

| Service   | Port  | Purpose                          |
|-----------|-------|----------------------------------|
| app       | 3000  | Next.js application              |
| postgres  | 5432  | PostgreSQL database              |
| redis     | 6379  | Redis (rate limiting)            |
| minio     | 9000  | S3 API (object storage)          |
| minio     | 9001  | MinIO Console (web UI)           |
| imgproxy  | 8080  | Image optimization & processing  |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Network                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐     ┌──────────────┐                     │
│   │   Next.js    │────▶│  PostgreSQL  │                     │
│   │    App       │     │    :5432     │                     │
│   │    :3000     │     └──────────────┘                     │
│   └──────┬───────┘                                          │
│          │                                                   │
│          ├──────────────────┬──────────────────┐            │
│          │                  │                  │            │
│          ▼                  ▼                  ▼            │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │
│   │    MinIO     │   │   imgproxy   │   │    Redis     │   │
│   │   :9000      │   │   :8080      │   │   :6379      │   │
│   └──────────────┘   └──────────────┘   └──────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Image Flow

1. **Upload**: Browser → App → MinIO (via presigned URLs)
2. **Display**: Browser → imgproxy → MinIO (optimized images)
3. **Processing**: imgproxy handles resizing, format conversion, quality optimization

## Configuration

### Database

The database is automatically initialized on first run. Data persists in the `postgres-data` Docker volume.

### Storage (MinIO)

MinIO is configured for S3-compatible storage:
- Bucket `photos` is created automatically
- Public read access is configured automatically
- The app uses `forcePathStyle: true` for proper MinIO compatibility
- Internal endpoint: `http://minio:9000` (for container communication)
- External endpoint: Configured via `NEXT_PUBLIC_MINIO_DOMAIN`

### Image Optimization (imgproxy)

imgproxy provides on-the-fly image optimization:
- Automatically resizes images based on device requirements
- Supports WebP/AVIF format conversion
- Quality control via `NEXT_PUBLIC_IMAGE_QUALITY` (default: 75)
- Cached processed images for performance

To disable imgproxy and use direct MinIO URLs:
```bash
NEXT_PUBLIC_IMAGE_LOADER=default
```

### Rate Limiting

Redis is optional. If not needed, you can:
1. Remove the `redis` service from `docker-compose.yml`
2. Remove `KV_URL` from your environment

## Reverse Proxy

For production, use a reverse proxy like Nginx or Caddy.

### Nginx Example

```nginx
server {
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# For imgproxy (optional - you can expose it directly or proxy)
server {
    server_name images.your-domain.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
    }
}
```

### Caddy Example

```
your-domain.com {
    reverse_proxy localhost:3000
}

# For imgproxy (optional)
images.your-domain.com {
    reverse_proxy localhost:8080
}
```

## Security Considerations

1. **Change all default passwords** in `.env.production`:
   - `AUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `POSTGRES_PASSWORD` - Strong database password
   - `MINIO_ROOT_PASSWORD` - Strong MinIO root password
   - `MINIO_SECRET_ACCESS_KEY` - Strong access key

2. **Use SSL/TLS** - Configure HTTPS via your reverse proxy

3. **Restrict database access** - Only expose PostgreSQL port locally (don't map 5432 in production)

4. **MinIO credentials** - Use strong, unique access keys

5. **Environment variables** - Never commit `.env.production` to git

## Backup and Recovery

### Backup Database

```bash
docker compose exec postgres pg_dump -U postgres exif_photo_blog > backup.sql
```

### Restore Database

```bash
docker compose exec -T postgres psql -U postgres exif_photo_blog < backup.sql
```

### Backup MinIO Data

```bash
# Backup to local directory
docker compose exec minio mc mirror local/photos/ /tmp/backup/

# Or copy data volume
docker cp $(docker compose ps -q minio):/data ./minio-backup
```

## Troubleshooting

### Container won't start

Check logs:

```bash
docker compose logs app
docker compose logs postgres
docker compose logs minio
docker compose logs imgproxy
```

### Database connection errors

Ensure PostgreSQL is healthy:

```bash
docker compose ps
docker compose logs postgres
```

### MinIO connection errors

Verify MinIO is running:

```bash
docker compose logs minio
docker compose exec minio mc ls local/
```

### Image loading errors

Check imgproxy:

```bash
docker compose logs imgproxy
# Test imgproxy health
curl http://localhost:8080/health
```

### Login redirect shows container hash

This occurs when `NEXTAUTH_URL` is not set. Ensure:

```bash
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_DOMAIN=your-domain.com
```

### Images not displaying

1. Check imgproxy is running: `docker compose ps`
2. Test imgproxy directly: `curl http://localhost:8080/health`
3. Check MinIO bucket is public: `docker compose exec minio mc anonymous get local/photos`
4. Verify image exists: `docker compose exec minio mc ls local/photos/`

## Environment Variable Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_SECRET` | Yes | Random secret for authentication (generate with `openssl rand -base64 32`) |
| `ADMIN_EMAIL` | Yes | Admin user email address |
| `ADMIN_PASSWORD` | Yes | Admin user password |
| `POSTGRES_URL` | Yes | PostgreSQL connection string |
| `NEXT_PUBLIC_DOMAIN` | Yes | Your domain name (e.g., `photos.example.com`) |
| `NEXTAUTH_URL` | Yes | Full URL to your app (e.g., `https://photos.example.com`) |
| `MINIO_ROOT_USER` | Yes | MinIO root username |
| `MINIO_ROOT_PASSWORD` | Yes | MinIO root password |
| `MINIO_ACCESS_KEY` | Yes | MinIO access key for app |
| `MINIO_SECRET_ACCESS_KEY` | Yes | MinIO secret key for app |
| `NEXT_PUBLIC_MINIO_DOMAIN` | Yes | Domain for MinIO (e.g., `photos.example.com` or `minio.example.com`) |
| `NEXT_PUBLIC_IMAGE_LOADER` | No | Set to `imgproxy` for self-hosting (default: `default`) |
| `NEXT_PUBLIC_IMGPROXY_URL` | No | URL to imgproxy service (default: `http://localhost:8080`) |
| `KV_URL` | No | Redis URL for rate limiting (optional) |

## Updating

1. Pull latest changes:

   ```bash
   git pull origin main
   ```

2. Rebuild and restart:

   ```bash
   docker compose build
   docker compose up -d
   ```

## Removing

To completely remove the stack and all data:

```bash
docker compose down -v
```

To remove only volumes (keeps images):

```bash
docker compose down
```

## Development vs Production

For local development, use `dev-docker-compose.yml`:

```bash
# Development (hot-reload enabled)
cp .env.example.local .env.local
docker compose -f dev-docker-compose.yml up

# Production
cp .env.example.production .env.production
# Edit .env.production with your values
docker compose up -d
```

## Support

For issues and questions:
- GitHub Issues: https://github.com/sambecker/exif-photo-blog/issues
- Self-hosting Issue: https://github.com/sambecker/exif-photo-blog/issues/132
