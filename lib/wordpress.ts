import { type NextRequest } from "next/server";

const GRAPHQL_URL = process.env.WORDPRESS_API_URL || "https://blog.hexcolormeans.com/graphql";

/**
 * Fetch GraphQL data with ISR support
 */
export async function fetchGraphQL(query: string, variables: any = {}) {
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      // Static export - cache at build time
      cache: 'force-cache'
    });

    if (!res.ok) {
      console.error(`GraphQL request failed with status ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("WordPress GraphQL fetch failed:", error);
    return null;
  }
}

/**
 * Get posts by category - ISR Version
 */
export async function getPostsByCategory(categorySlug: string) {
  // Try local JSON cache first
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dataPath = path.join(process.cwd(), 'lib/blog-posts-data.json');
    
    if (fs.existsSync(dataPath)) {
      const allPosts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const posts = allPosts.filter((post: any) => 
        post.categories?.nodes?.some((c: any) => c.slug === categorySlug)
      );

      if (posts.length > 0) {
        // Find category name from the first post that has this category
        const category = posts[0].categories.nodes.find((c: any) => c.slug === categorySlug);
        
        return {
          posts,
          categoryName: category ? category.name : categorySlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
          categorySlug,
        };
      }
      
      // If no posts found in cache, return empty but valid structure
      // This prevents build errors if category exists but has no posts
      return {
        posts: [],
        categoryName: categorySlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        categorySlug,
      };
    }
  } catch (e) {
    console.warn(`Local cache read failed for category ${categorySlug}, falling back to API:`, e);
  }

  const query = `
    query PostsByCategory($slug: String!) {
      category(id: $slug, idType: SLUG) {
        name
        slug
        posts(first: 100) {
          nodes {
            title
            slug
            uri
            date
            excerpt
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            categories {
              nodes {
                name
                slug
              }
            }
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query, { slug: categorySlug });
  
  if (!data?.data?.category) {
    return {
      posts: [],
      categoryName: categorySlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    };
  }

  const category = data.data.category;
  return {
    posts: category.posts.nodes,
    categoryName: category.name,
    categorySlug: category.slug,
  };
}

/**
 * Get all categories - ISR Version
 */
export async function getAllCategories() {
  const query = `
    query AllCategories {
      categories(first: 100) {
        nodes {
          name
          slug
          count
        }
      }
    }
  `;

  const data = await fetchGraphQL(query);
  return data?.data?.categories?.nodes || [];
}

/**
 * Get all posts - ISR Version
 * Used for homepage latest posts
 */
export async function getAllPosts(limit = 10) {
  const query = `
    query AllPosts($first: Int!) {
      posts(first: $first) {
        nodes {
          id
          title
          slug
          uri
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query, { first: limit });
  return data?.data?.posts?.nodes || [];
}

/**
 * Get a single post by URI - ISR Version
 * (Mainly used by other components if needed, though [...wp]/page.tsx has its own)
 */
export async function getPostByUri(uri: string) {
  const query = `
    query PostByUri($uri: String!) {
      nodeByUri(uri: $uri) {
        ... on Post {
          title
          content
          uri
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
          seo {
            title
            metaDesc
            canonical
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query, { uri });
  return data?.data?.nodeByUri || null;
}
