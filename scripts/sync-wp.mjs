import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://blog.hexcolormeans.com/graphql';

async function fetchGraphQL(query, variables = {}) {
    console.log(`Attempting to connect to WordPress API at: ${WORDPRESS_API_URL}`);
    if (!process.env.WORDPRESS_API_URL) {
        console.warn('Warning: WORDPRESS_API_URL env variable not set. Using default.');
    }
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(WORDPRESS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Check if response is OK
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP Error ${response.status}: ${response.statusText}`);
            console.error(`Response body: ${errorText.substring(0, 500)}...`);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const errorText = await response.text();
            console.error('Expected JSON response but received:', contentType);
            console.error('Response preview:', errorText.substring(0, 500));
            throw new Error('Invalid response format - expected JSON');
        }
        
        const json = await response.json();
        if (json.errors) {
            console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
            throw new Error('GraphQL query failed');
        }
        return json;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Request timed out after 30 seconds. The WordPress API may be slow or unreachable.');
            throw new Error('WordPress API request timed out');
        }
        if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
            console.error('Failed to parse JSON response. The WordPress API may be unreachable or returning an error page.');
            console.error('Please check if the WordPress GraphQL endpoint is accessible and properly configured.');
        }
        throw error;
    }
}

async function fetchItems(type) {
    console.log(`Fetching all ${type}...`);
    const allItems = [];
    let hasNextPage = true;
    let after = null;

    while (hasNextPage) {
        const query = type === 'posts' ? `
            query GetPosts($after: String) {
                posts(first: 100, after: $after) {
                    pageInfo { hasNextPage endCursor }
                    nodes {
                        id
                        databaseId
                        title
                        excerpt
                        content
                        uri
                        date
                        featuredImage { node { sourceUrl altText } }
                        categories { nodes { name slug } }
                        tags { nodes { name uri } }
                        seo {
                            title
                            metaDesc
                            canonical
                            opengraphTitle
                            opengraphDescription
                            opengraphImage { sourceUrl }
                            schema { raw }
                        }
                    }
                }
            }
        ` : `
            query GetPages($after: String) {
                pages(first: 100, after: $after) {
                    pageInfo { hasNextPage endCursor }
                    nodes {
                        id
                        databaseId
                        title
                        content
                        uri
                        date
                        seo {
                            title
                            metaDesc
                            canonical
                            schema { raw }
                        }
                    }
                }
            }
        `;

        const json = await fetchGraphQL(query, { after });
        const { nodes, pageInfo } = json.data[type];

        allItems.push(...nodes);
        hasNextPage = pageInfo.hasNextPage;
        after = pageInfo.endCursor;

        console.log(`Fetched ${allItems.length} ${type}...`);
    }

    return allItems;
}

async function sync() {
    try {
        const posts = await fetchItems('posts');
        const pages = await fetchItems('pages');
        const items = [...posts, ...pages];

        const postsDir = path.resolve(__dirname, '../lib/posts');
        const indexFile = path.resolve(__dirname, '../lib/blog-posts-data.json');

        if (fs.existsSync(postsDir)) {
            // Clean directory first to remove outdated content
            console.log(`Cleaning existing directory: ${postsDir}`);
            fs.rmSync(postsDir, { recursive: true, force: true });
        }
        fs.mkdirSync(postsDir, { recursive: true });

        // 1. Update Index File (Blog posts only)
        fs.writeFileSync(indexFile, JSON.stringify(posts, null, 2));
        console.log(`Updated index: ${indexFile}`);

        // 2. Save individual JSON files and detect new ones
        let newItemsCount = 0;
        const newItems = [];

        items.forEach(item => {
            if (!item.uri || item.uri === '/') return;

            const slug = item.uri.replace(/^\/|\/$/g, '').replace(/\//g, '-');
            const itemPath = path.join(postsDir, `${slug}.json`);

            if (!fs.existsSync(itemPath)) {
                newItemsCount++;
                newItems.push(item.title);
            }

            fs.writeFileSync(itemPath, JSON.stringify(item, null, 2));
        });

        console.log(`Successfully saved ${items.length} items to ${postsDir}`);
        if (newItemsCount > 0) {
            console.log(`\nDETECTED ${newItemsCount} NEW POSTS:`);
            newItems.forEach(title => console.log(` - ${title}`));
        } else {
            console.log('\nNo new posts detected.');
        }
        console.log('Sync complete!');

    } catch (error) {
        console.error('Sync failed:', error);
        process.exit(1);
    }
}

sync();
