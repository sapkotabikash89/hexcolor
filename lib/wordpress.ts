import fs from "fs";
import path from "path";

/**
 * WordPress Integration - STATIC EXPORT VERSION
 * 
 * This module provides WordPress data using ONLY local JSON files.
 * All data must be pre-fetched during build time using sync scripts.
 * 
 * NO RUNTIME FETCHING - All data is static.
 */

const GRAPHQL_URL = process.env.WORDPRESS_API_URL || "https://blog.hexcolormeans.com/graphql";

/**
 * Fetch GraphQL data - ONLY for build-time scripts
 * DO NOT use this in page components - use getLocalPosts() instead
 */
export async function fetchGraphQL(query: string, variables: any = {}) {
  // Only allow fetching during build time (when Node.js APIs are available)
  if (typeof window !== 'undefined') {
    console.error('fetchGraphQL called in browser - this should never happen in static export');
    return null;
  }

  const url = process.env.WORDPRESS_API_URL;
  if (!url) {
    console.warn('WORDPRESS_API_URL is not defined');
  }

  try {
    const res = await fetch(url || GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      // Remove revalidate - not supported in static export
    });

    if (!res.ok) {
      throw new Error(`GraphQL request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("WordPress GraphQL fetch failed:", error);
    return null;
  }
}

/**
 * Get all blog posts from local JSON file
 * This is the PRIMARY data source for static export
 */
export async function getLocalPosts() {
  try {
    const dataPath = path.join(process.cwd(), "lib/blog-posts-data.json");
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf8");
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Error reading local blog-posts-data.json:", error);
  }
  return [];
}

/**
 * Get posts by category - STATIC VERSION
 * Uses ONLY local data
 */
export async function getPostsByCategory(categorySlug: string) {
  try {
    // Load from local data ONLY
    const allPosts = await getLocalPosts();
    const filteredPosts = allPosts.filter((post: any) =>
      post.categories?.nodes?.some((cat: any) => cat.slug === categorySlug)
    );

    const categoryName = filteredPosts[0]?.categories?.nodes?.find(
      (cat: any) => cat.slug === categorySlug
    )?.name || categorySlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

    return {
      posts: filteredPosts.map((p: any) => ({
        ...p,
        categoryName,
        categorySlug,
      })),
      categoryName,
    };
  } catch (error) {
    console.error(`Error getting posts for category ${categorySlug}:`, error);
    return {
      posts: [],
      categoryName: categorySlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    };
  }
}

/**
 * Get all categories - STATIC VERSION
 * Uses ONLY local data
 */
export async function getAllCategories() {
  try {
    // Load from local data ONLY
    const allPosts = await getLocalPosts();
    const categoryMap = new Map();

    allPosts.forEach((post: any) => {
      post.categories?.nodes?.forEach((cat: any) => {
        if (!categoryMap.has(cat.slug)) {
          categoryMap.set(cat.slug, { name: cat.name, slug: cat.slug, count: 0 });
        }
        categoryMap.get(cat.slug).count++;
      });
    });

    return Array.from(categoryMap.values());
  } catch (error) {
    console.error("Error getting all categories:", error);
    return [];
  }
}

/**
 * Get a single post by URI - STATIC VERSION
 * Uses ONLY local JSON files
 */
export async function getPostByUri(uri: string) {
  try {
    // Normalize URI
    const normalizedUri = uri.endsWith('/') ? uri : `${uri}/`;

    // Try to load from individual post file first
    const slug = normalizedUri.replace(/^\/|\/$/g, '').replace(/\//g, '-');
    if (slug) {
      const dataPath = path.join(process.cwd(), 'lib/posts', `${slug}.json`);
      if (fs.existsSync(dataPath)) {
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      }
    }

    // Fallback to searching in blog-posts-data.json
    const allPosts = await getLocalPosts();
    return allPosts.find((post: any) => {
      const postUri = post.uri?.endsWith('/') ? post.uri : `${post.uri}/`;
      return postUri === normalizedUri;
    }) || null;
  } catch (error) {
    console.error(`Error getting post by URI ${uri}:`, error);
    return null;
  }
}
