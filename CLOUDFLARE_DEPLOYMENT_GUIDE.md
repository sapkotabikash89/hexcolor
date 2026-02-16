# Cloudflare Pages Deployment Guide

## 🚀 Complete Guide to Deploy Your Static Next.js Site on Cloudflare Pages

---

## Prerequisites

✅ Cloudflare account (free tier works)
✅ GitHub repository with your code
✅ All WordPress data synced to local JSON files

---

## Part 1: Pre-Deployment Preparation

### Step 1: Sync WordPress Data (CRITICAL)

Before building, ensure all blog posts are synced locally:

```bash
npm run sync
```

This will:
- Fetch all posts from WordPress GraphQL API
- Save them to `/lib/posts/*.json`
- Update `/lib/blog-posts-data.json`

**⚠️ WARNING:** If you skip this step, your blog posts won't be included in the static build!

---

### Step 2: Test Local Build

```bash
# Generate sitemaps and build
npm run build

# Verify output directory exists
ls -la out/

# Test locally
npm start
```

Open `http://localhost:3000` and verify:
- ✅ Homepage loads
- ✅ Color pages work (`/colors/ff0000/`)
- ✅ Blog posts load
- ✅ Navigation works
- ✅ No console errors

---

### Step 3: Verify Static Files

Check that these files exist in `/out`:

```bash
# Check sitemaps
ls -la out/sitemap*.xml

# Check robots.txt
cat out/robots.txt

# Check Cloudflare config files
cat out/_redirects
cat out/_headers

# Check a sample color page
ls -la out/colors/ff0000/

# Check blog posts
ls -la out/color-meanings/
```

---

## Part 2: Cloudflare Pages Setup

### Method A: Connect via GitHub (Recommended)

#### Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for Cloudflare Pages deployment"
git push origin main
```

#### Step 2: Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **Pages** in the left sidebar
3. Click **Create a project**
4. Click **Connect to Git**
5. Authorize Cloudflare to access your GitHub account
6. Select your repository
7. Click **Begin setup**

#### Step 3: Configure Build Settings

**Framework preset:** `Next.js (Static HTML Export)`

**Build configuration:**
```
Build command:       npm run build
Build output directory:  out
Root directory:      (leave empty)
```

**Environment variables:**
```
NODE_VERSION=20
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production
```

#### Step 4: Deploy

1. Click **Save and Deploy**
2. Wait for build to complete (5-15 minutes)
3. Your site will be live at `https://your-project.pages.dev`

---

### Method B: Direct Upload (Quick Test)

For quick testing without Git:

```bash
# Build locally
npm run build

# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy out --project-name=hexcolormeans
```

---

## Part 3: Custom Domain Setup

### Step 1: Add Custom Domain

1. In Cloudflare Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `hexcolormeans.com`)
4. Click **Continue**

### Step 2: Update DNS

If your domain is on Cloudflare:
- DNS records will be automatically configured ✅

If your domain is elsewhere:
1. Add a CNAME record:
   ```
   Name: @
   Value: your-project.pages.dev
   ```
2. Wait for DNS propagation (up to 48 hours)

### Step 3: Enable HTTPS

Cloudflare automatically provisions SSL certificates.
- **Always Use HTTPS:** ON
- **Automatic HTTPS Rewrites:** ON

---

## Part 4: Performance Optimization

### Enable Cloudflare Features

1. **Auto Minify**
   - Go to **Speed** → **Optimization**
   - Enable: JavaScript, CSS, HTML

2. **Brotli Compression**
   - Automatically enabled ✅

3. **HTTP/3**
   - Go to **Network**
   - Enable HTTP/3 (with QUIC)

4. **Caching**
   - Already configured via `_headers` file ✅

---

## Part 5: Continuous Deployment

### Automatic Deployments

Every push to your main branch will trigger a new deployment:

```bash
# Make changes
git add .
git commit -m "Update content"
git push origin main

# Cloudflare automatically builds and deploys
```

### Preview Deployments

Every pull request gets a unique preview URL:
- `https://abc123.your-project.pages.dev`

---

## Part 6: Monitoring & Analytics

### Enable Web Analytics

1. Go to **Analytics** in your Pages project
2. Enable **Web Analytics**
3. View:
   - Page views
   - Unique visitors
   - Performance metrics
   - Geographic distribution

### Build Logs

View build logs in Cloudflare Dashboard:
1. Go to your Pages project
2. Click **View build** on any deployment
3. Check for errors or warnings

---

## Part 7: Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error: "Out of memory"**
```bash
# Solution: Increase Node.js memory
# Add to package.json scripts:
"build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
```

### Pages Don't Load

**404 errors on routes**
- Check `/out` directory has HTML files
- Verify `trailingSlash: true` in `next.config.mjs`
- Check `_redirects` file is in `/out`

**Blank pages**
- Check browser console for errors
- Verify all images use `unoptimized: true`
- Check no runtime `fetch()` calls

### Sitemaps Not Generated

```bash
# Manually run sitemap generation
node scripts/generate-sitemaps.mjs

# Check output
ls -la public/sitemap*.xml
```

---

## Part 8: Post-Deployment Checklist

After deployment, verify:

- [ ] Homepage loads correctly
- [ ] All color pages work (`/colors/{hex}/`)
- [ ] Blog posts display properly
- [ ] Navigation works (no broken links)
- [ ] Images load correctly
- [ ] Sitemap accessible (`/sitemap.xml`)
- [ ] Robots.txt accessible (`/robots.txt`)
- [ ] No console errors in browser
- [ ] Mobile responsive
- [ ] Fast page loads (< 2 seconds)
- [ ] SEO meta tags present
- [ ] Social sharing works
- [ ] Google Search Console verified
- [ ] Analytics tracking works

---

## Part 9: SEO Setup

### Submit Sitemap to Google

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (domain)
3. Go to **Sitemaps**
4. Submit: `https://hexcolormeans.com/sitemap.xml`

### Verify Indexing

```bash
# Check if Google can access your site
site:hexcolormeans.com

# Check specific page
site:hexcolormeans.com/colors/ff0000/
```

---

## Part 10: Updating Content

### Update Blog Posts

```bash
# Sync latest posts from WordPress
npm run sync

# Build and deploy
npm run build
git add .
git commit -m "Update blog posts"
git push origin main
```

### Update Color Pages

Color pages are generated from `/lib/color-meaning.json`:

1. Edit the JSON file
2. Run build
3. Deploy

---

## Part 11: Advanced Configuration

### Custom Headers

Edit `/public/_headers`:

```
/*
  X-Custom-Header: value
  Access-Control-Allow-Origin: *
```

### Redirects

Edit `/public/_redirects`:

```
/old-path  /new-path  301
/blog/*    /posts/:splat  301
```

### Functions (Optional)

Cloudflare Pages supports serverless functions:

Create `/functions/api/hello.ts`:

```typescript
export async function onRequest(context) {
  return new Response("Hello from Cloudflare!");
}
```

Access at: `/api/hello`

---

## Part 12: Cost & Limits

### Free Tier Limits

- ✅ Unlimited requests
- ✅ Unlimited bandwidth
- ✅ 500 builds per month
- ✅ 1 concurrent build
- ✅ 20,000 files per deployment

### Pro Tier ($20/month)

- 5,000 builds per month
- 5 concurrent builds
- Advanced analytics
- Priority support

**Your site should work perfectly on the free tier!**

---

## Part 13: Backup & Rollback

### Rollback to Previous Deployment

1. Go to Cloudflare Pages project
2. Click **Deployments**
3. Find the working deployment
4. Click **...** → **Rollback to this deployment**

### Download Static Files

```bash
# Download from Cloudflare
wrangler pages download --project-name=hexcolormeans
```

---

## Part 14: Performance Benchmarks

Expected performance:
- **First Contentful Paint:** < 1s
- **Time to Interactive:** < 2s
- **Lighthouse Score:** 95+
- **Core Web Vitals:** All green

Test your site:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

---

## Part 15: Support & Resources

### Official Documentation

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

### Community

- [Cloudflare Community](https://community.cloudflare.com/)
- [Next.js Discord](https://nextjs.org/discord)

### Get Help

- Cloudflare Support: support@cloudflare.com
- GitHub Issues: Create an issue in your repo

---

## 🎉 Congratulations!

Your static Next.js site is now live on Cloudflare Pages with:
- ✅ Lightning-fast global CDN
- ✅ Automatic HTTPS
- ✅ Continuous deployment
- ✅ Zero server costs
- ✅ Unlimited scalability

**Your site is production-ready!** 🚀
