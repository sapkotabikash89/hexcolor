# HexColorMeans.com - Cloudflare Pages Deployment Guide

## Project Overview
This is a Next.js 14+ App Router project configured for static export deployment on Cloudflare Pages.
It integrates with WordPress as a Headless CMS, fetching data at build time to generate static pages.

## Environment Variables
The following environment variables MUST be configured in your Cloudflare Pages project settings:

| Variable Name | Value Example | Description |
|--------------|---------------|-------------|
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | `G-XXXXXXXXXX` | Your Google Analytics Measurement ID. |
| `NEXT_PUBLIC_SITE_URL` | `https://hexcolormeans.com` | The canonical URL of your site. |
| `WORDPRESS_API_URL` | `https://blog.hexcolormeans.com/graphql` | The GraphQL endpoint of your WordPress site. |

**Important:** `WORDPRESS_API_URL` is used only during build time (server-side) to fetch content. `NEXT_PUBLIC_` variables are available in the browser.

## Deployment Instructions

### 1. Cloudflare Pages Settings
- **Framework Preset**: Next.js (Static HTML Export)
- **Build command**: `npm run build`
  - *Note: This automatically runs `npm run sync` before building to fetch WordPress content.*
- **Output directory**: `out`
- **Node.js Version**: 18.x or later (ensure this is set in environment variables if needed, e.g., `NODE_VERSION: 20`).

### 2. Build Process
1. **Sync**: The `prebuild` script runs `scripts/sync-wp.mjs`, which fetches all posts and pages from WordPress and saves them as local JSON files in `lib/posts/`.
2. **Generate**: Next.js builds the application. `generateStaticParams` reads the local JSON files to create static paths for all blog posts.
3. **Export**: The `output: 'export'` config ensures a purely static output in the `out/` directory.

### 3. Local Development
To run locally with the same build process:

1. Create a `.env.local` file with the variables listed above.
2. Run `npm install`
3. Run `npm run build` to test the full static generation.
4. Run `npx serve out` to preview the static site.

For dev mode (hot reload):
`npm run dev`
(Note: You may need to run `npm run sync` once manually if you want blog content in dev mode).

## File Structure Highlights
- `app/[...wp]/page.tsx`: Handles all dynamic WordPress routes. Uses `generateStaticParams` to build pages from synced data.
- `scripts/sync-wp.mjs`: Fetches data from WordPress GraphQL API and saves to `lib/posts/`.
- `components/home/latest-posts.tsx`: Statically rendered latest posts component.
