import fs from 'fs';
import path from 'path';

// Define types based on what we expect in the JSON
interface BlogPost {
  title: string;
  slug?: string;
  uri: string;
  date: string;
  excerpt?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    }
  };
  categories?: {
    nodes: Array<{
      name: string;
      slug: string;
    }>
  };
}

// Path to the main data file
const BLOG_DATA_PATH = path.join(process.cwd(), 'lib/blog-posts-data.json');

/**
 * Helper to read blog data
 */
function getLocalBlogData(): BlogPost[] {
  try {
    if (fs.existsSync(BLOG_DATA_PATH)) {
      return JSON.parse(fs.readFileSync(BLOG_DATA_PATH, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading blog data:', error);
  }
  return [];
}

/**
 * Get posts by category - Local Version
 */
export async function getPostsByCategory(categorySlug: string) {
  const allPosts = getLocalBlogData();
  const posts = allPosts.filter((post: any) => 
    post.categories?.nodes?.some((c: any) => c.slug === categorySlug)
  );

  if (posts.length > 0) {
    const category = posts[0].categories?.nodes?.find((c: any) => c.slug === categorySlug);
    return {
      posts,
      categoryName: category ? category.name : categorySlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      categorySlug,
    };
  }
  
  return {
    posts: [],
    categoryName: categorySlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    categorySlug,
  };
}

/**
 * Get all categories - Local Version
 */
export async function getAllCategories() {
  const posts = getLocalBlogData();
  const categoriesMap = new Map();
  
  posts.forEach(post => {
    post.categories?.nodes?.forEach(cat => {
      if (!categoriesMap.has(cat.slug)) {
        categoriesMap.set(cat.slug, {
          name: cat.name,
          slug: cat.slug,
          count: 0
        });
      }
      categoriesMap.get(cat.slug).count++;
    });
  });
  
  return Array.from(categoriesMap.values());
}

/**
 * Get all posts - Local Version
 */
export async function getAllPosts(limit = 10) {
  const posts = getLocalBlogData();
  // Sort by date desc if needed, assuming they might not be sorted
  // posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts.slice(0, limit);
}

/**
 * Get a single post by URI - Local Version
 */
export async function getPostByUri(uri: string) {
  // Try to find in lib/posts/
  const slug = uri.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  const postPath = path.join(process.cwd(), 'lib', 'posts', `${slug}.json`);
  
  try {
    if (fs.existsSync(postPath)) {
      return JSON.parse(fs.readFileSync(postPath, 'utf8'));
    }
  } catch (e) {
    console.error(`Error reading post file for ${uri}:`, e);
  }
  
  return null;
}
