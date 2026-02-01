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
      // OPTIMIZATION: Incremental Static Regeneration (ISR)
      // Revalidate every 60 seconds
      next: { revalidate: 60 },
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
