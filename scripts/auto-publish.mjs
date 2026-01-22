import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
    try {
        console.log('--- STEP 1: Syncing from WordPress ---');
        execSync('npm run sync', { stdio: 'inherit' });

        console.log('\n--- STEP 2: Checking for changes ---');
        // Check if there are changes in lib/posts or lib/blog-posts-data.json
        const status = execSync('git status --porcelain', { encoding: 'utf8' });

        if (!status.includes('lib/posts/') && !status.includes('lib/blog-posts-data.json')) {
            console.log('No new posts or updates detected. Nothing to do.');
            return;
        }

        console.log('\n--- STEP 3: Generating Static Pages ---');
        // This will run next build and since we updated generateStaticParams,
        // it will pick up the new JSON files.
        execSync('npm run build', { stdio: 'inherit' });

        console.log('\n--- STEP 4: Committing and Pushing to GitHub ---');
        execSync('git add lib/posts/ lib/blog-posts-data.json', { stdio: 'inherit' });
        execSync('git commit -m "Auto-sync: New WordPress posts detected and pages generated"', { stdio: 'inherit' });

        // Push to the current branch
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
        console.log(`Pushing to ${branch}...`);
        execSync(`git push origin ${branch}`, { stdio: 'inherit' });

        console.log('\nSUCCESS: New posts detected, static data saved, and changes pushed to GitHub.');
        console.log('Cloudflare Pages will now build the project and make the new posts live.');

    } catch (error) {
        console.error('\nFAILED during auto-publish process:');
        console.error(error.message);
        process.exit(1);
    }
}

run();
