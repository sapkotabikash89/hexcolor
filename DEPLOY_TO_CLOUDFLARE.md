# Deploying HexColorMeans to Cloudflare Pages

This guide explains how to deploy the static export of `HexColorMeans` to Cloudflare Pages.

## Prerequisites

1.  A [Cloudflare account](https://dash.cloudflare.com/sign-up).
2.  Access to the GitHub repository: `https://github.com/bikash9500/hexcolor`.

## Method 1: Connect to GitHub (Recommended)

This method automatically builds and deploys your site whenever you push changes to GitHub.

1.  **Log in to Cloudflare Dashboard**.
2.  Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3.  **Select the Repository**:
    *   Choose `bikash9500/hexcolor`.
4.  **Configure Build Settings**:
    *   **Project Name**: `hexcolor` (or your preferred name).
    *   **Production Branch**: `main`.
    *   **Framework Preset**: `Next.js (Static Export)` or `None`.
    *   **Build Command**: `npm run build`
    *   **Build Output Directory**: `out`
    *   **Node.js Version**: Set an environment variable if needed (e.g., `NODE_VERSION` = `20`).
5.  **Save and Deploy**.

Cloudflare will clone your repo, install dependencies, run the build, and deploy the `out` folder.

## Method 2: Direct Upload (Manual)

If you just want to deploy the currently generated `out` folder without connecting Git:

1.  **Log in to Cloudflare Dashboard**.
2.  Go to **Workers & Pages** > **Create application** > **Pages** > **Upload Assets**.
3.  **Project Name**: Enter a name (e.g., `hexcolormeans`).
4.  **Upload**: Drag and drop the contents of the local `/out` folder.
5.  **Deploy Site**.

## Important Configuration Notes

### 1. Static Export Config
The project is already configured for static export in `next.config.mjs`:
*   `output: 'export'`
*   `trailingSlash: true`
*   `images: { unoptimized: true }`

### 2. Routing and Redirects
The `public/_redirects` and `public/_headers` files are automatically included in the build output. These handle:
*   Redirects from old URLs (e.g., `/color/123456` -> `/colors/123456`).
*   Security headers.
*   Caching policies.

### 3. WordPress Sync
Since this is a static site, it **does not** fetch WordPress data at runtime.
*   **Before pushing to GitHub**, ensure you run `npm run sync` locally to update the JSON data in `lib/posts/`.
*   Commit the updated JSON files so the Cloudflare build has access to the latest content.

## Verifying the Deployment

After deployment, check:
*   **Homepage**: `https://hexcolor.pages.dev` (or your custom domain).
*   **Color Pages**: `https://hexcolor.pages.dev/colors/000000`.
*   **Tools**: Check `/html-color-picker`, `/contrast-checker`, etc.
*   **Redirects**: Try accessing an old URL like `/color/ff0000` and ensure it redirects to `/colors/ff0000`.
