import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ColorSidebar } from "@/components/sidebar";
import { CategoryPosts } from "@/components/category-posts";
import { CollectionPageSchema, BreadcrumbSchema } from "@/components/structured-data";

import { getPostsByTag, getAllTags } from "@/lib/wordpress";

export async function generateStaticParams() {
  console.log("Generating static params for tags...");
  const tags = await getAllTags();
  if (!tags || tags.length === 0) {
    console.log("No tags found. Returning fallback to prevent build error.");
    return [{ tag: "color" }];
  }
  return tags.map((tag: any) => ({
    tag: tag.slug,
  }));
}

type TagPageProps = {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag: tagSlug } = await params;
  const capitalizedTag = tagSlug
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `Posts tagged with ${capitalizedTag} - HexColorMeans`,
    description: `Browse all articles tagged with ${capitalizedTag.toLowerCase()} on HexColorMeans.`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: tagSlug } = await params;
  const { posts: rawPosts, tagName } = await getPostsByTag(tagSlug);
  
  // Transform posts
  const posts = rawPosts.map(post => ({
    ...post,
    excerpt: post.excerpt || "",
    featuredImage: post.featuredImage ? {
      node: {
        sourceUrl: post.featuredImage.node.sourceUrl,
        altText: post.featuredImage.node.altText
      }
    } : undefined
  }));

  // Define breadcrumbs
  const crumbs = [
    { label: `Tag: ${tagName}`, href: `/tags/${tagSlug}` },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <CollectionPageSchema name={`Tag: ${tagName}`} url={`https://hexcolormeans.com/tags/${tagSlug}`} />
      <BreadcrumbSchema items={[
        { name: "HexColorMeans", item: "https://hexcolormeans.com" },
        { name: "Tags", item: "https://hexcolormeans.com/tags" },
        { name: tagName, item: `https://hexcolormeans.com/tags/${tagSlug}` }
      ]} />
      <Header />
      <section className="bg-muted/30 py-12 px-4">
        <div className="w-full max-w-[1300px] mx-auto">
          <BreadcrumbNav items={crumbs} />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Tag: {tagName}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Browse all articles tagged with {tagName.toLowerCase()}
            </p>
          </div>
        </div>
      </section>
      <main className="w-full max-w-[1300px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <article id="content" className="main-content grow-content flex-1">
            <CategoryPosts
              initialPosts={posts}
              categoryName={`Tag: ${tagName}`}
              categorySlug={tagSlug}
            />
          </article>
          <ColorSidebar color="#E0115F" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
