import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ColorSidebar } from "@/components/sidebar";
import { CategoryPosts } from "@/components/category-posts";
import { getPostsByTag, getAllPosts } from "@/lib/wordpress";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts(500);
  const tagMap = new Map<string, string>();

  posts.forEach((post: any) => {
    (post.tags?.nodes || []).forEach((t: any) => {
      if (t?.slug && t?.name && !tagMap.has(t.slug)) {
        tagMap.set(t.slug, t.name);
      }
    });
  });

  return Array.from(tagMap.keys()).map((slug) => ({
    tag: slug,
  }));
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  const capitalizedTag = tag
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${capitalizedTag} - Tag Articles | HexColorMeans`,
    description: `Explore articles tagged with ${capitalizedTag.toLowerCase()} on HexColorMeans. Discover meanings, psychology, and symbolism related to ${capitalizedTag.toLowerCase()}.`,
    alternates: {
      canonical: `https://hexcolormeans.com/tags/${tag}/`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const { posts: rawPosts, tagName } = await getPostsByTag(tag);

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

  const crumbs = [
    { label: "Tags", href: "/tags" },
    { label: tagName, href: `/tags/${tag}` },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="bg-muted/30 py-12 px-4">
        <div className="w-full max-w-[1300px] mx-auto">
          <BreadcrumbNav items={crumbs} />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{tagName}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {tag === "chakra-colors"
                ? "Browse all articles tagged with chakra colors."
                : `Browse articles tagged with ${tagName.toLowerCase()} from our headless WordPress CMS.`}
            </p>
          </div>
        </div>
      </section>
      <main className="w-full max-w-[1300px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <article id="content" className="main-content grow-content flex-1">
            <CategoryPosts
              initialPosts={posts}
              categoryName={tagName}
              categorySlug={tag}
            />
          </article>
          <ColorSidebar color="#E0115F" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
