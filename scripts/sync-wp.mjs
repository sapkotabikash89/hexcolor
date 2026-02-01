import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORDPRESS_API_URL = 'https://blog.hexcolormeans.com/graphql';

async function fetchGraphQL(query, variables = {}) {
    const response = await fetch(WORDPRESS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
    });
    const json = await response.json();
    if (json.errors) {
        console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
        throw new Error('GraphQL query failed');
    }
    return json;
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
