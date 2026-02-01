/**
 * Script to generate static blog post data for search functionality
 * This script fetches blog posts from WordPress and saves them as JSON
 * to be used in static builds
 */

import fs from 'fs/promises';
import path from 'path';

interface BlogPost {
  title: string;
  uri: string;
  excerpt?: string;
  date?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    }
  };
  categories?: {
    nodes?: Array<{
      name: string;
      slug: string;
    }>
  };
}

interface ApiResponse {
  data?: {
    posts?: {
      nodes?: BlogPost[];
    };
  };
}

async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const WORDPRESS_API_URL = 'https://blog.hexcolormeans.com/graphql';
    const res = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query AllPosts {
            posts(first: 100) {
              nodes {
                title
                excerpt
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
              }
            }
          }
        `,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json: ApiResponse = await res.json();
    return json?.data?.posts?.nodes ?? [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

async function generateBlogData() {
  console.log('Fetching blog posts...');
  const posts = await fetchBlogPosts();

  // Save the posts to a JSON file
  const outputPath = path.join(process.cwd(), 'lib', 'blog-posts-data.json');

  await fs.writeFile(outputPath, JSON.stringify(posts, null, 2));

  console.log(`Generated ${posts.length} blog posts in ${outputPath}`);
}

// Only run if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  generateBlogData().catch(console.error);
} else {
  // Alternative check for ES modules
  const __filename = new URL(import.meta.url).pathname;
  if (process.argv[1] === __filename) {
    generateBlogData().catch(console.error);
  }
}

export { fetchBlogPosts };