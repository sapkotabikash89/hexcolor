import fs from 'fs';
import path from 'path';

const GRAPHQL_ENDPOINT = 'https://blog.hexcolormeans.com/graphql';
const BATCH_SIZE = 20;

const query = `
  query GetAllPosts($first: Int, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        title
        slug
        uri
        date
        excerpt
        content
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
        tags {
          nodes {
            name
            slug
          }
        }
        seo {
          title
          metaDesc
          canonical
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
          schema {
            raw
          }
        }
      }
    }
  }
`;

async function fetchPosts() {
  let allPosts = [];
  let hasNextPage = true;
  let after = null;

  console.log('Starting to fetch posts...');

  while (hasNextPage) {
    console.log(`Fetching batch... (after: ${after})`);
    
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            first: BATCH_SIZE,
            after,
          },
        }),
      });

      const json = await response.json();
      
      if (json.errors) {
        console.error('GraphQL Errors:', json.errors);
        break;
      }

      const posts = json.data.posts.nodes;
      const pageInfo = json.data.posts.pageInfo;

      allPosts = [...allPosts, ...posts];
      
      hasNextPage = pageInfo.hasNextPage;
      after = pageInfo.endCursor;
      
      console.log(`Fetched ${posts.length} posts. Total: ${allPosts.length}`);

    } catch (error) {
      console.error('Error fetching posts:', error);
      break;
    }
  }

  return allPosts;
}

async function savePosts() {
  const posts = await fetchPosts();
  
  if (posts.length === 0) {
    console.log('No posts found or error occurred.');
    return;
  }

  // Ensure directories exist
  const postsDir = path.join(process.cwd(), 'lib/posts');
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  // 1. Save lib/blog-posts-data.json (Summary without content)
  const summaryPosts = posts.map(post => {
    const { content, ...summary } = post;
    return summary;
  });

  const summaryPath = path.join(process.cwd(), 'lib/blog-posts-data.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summaryPosts, null, 2));
  console.log(`Saved summary to ${summaryPath}`);

  // 2. Save individual post files in lib/posts/{slug}.json
  for (const post of posts) {
    // Ensure slug is clean
    const slug = post.slug || post.uri.replace(/^\/|\/$/g, '').replace(/\//g, '-');
    if (!slug) {
        console.warn(`Skipping post with no slug/uri: ${post.title}`);
        continue;
    }
    
    const filePath = path.join(postsDir, `${slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
  }
  
  console.log(`Saved ${posts.length} individual post files to ${postsDir}`);

  // 3. Save latest posts for sidebar in public/latest-posts.json
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const latestPosts = summaryPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)
    .map(p => ({ title: p.title, uri: p.uri }));

  const latestPostsPath = path.join(publicDir, 'latest-posts.json');
  fs.writeFileSync(latestPostsPath, JSON.stringify(latestPosts, null, 2));
  console.log(`Saved latest posts to ${latestPostsPath}`);
}

savePosts();
