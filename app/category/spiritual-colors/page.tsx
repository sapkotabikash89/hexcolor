import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ColorSidebar } from "@/components/sidebar";
import { CategoryPosts } from "@/components/category-posts";
import { getPostsByCategory } from "@/lib/wordpress";

async function fetchPostsByCategory() {
  return await getPostsByCategory("spiritual-colors");
}

export const metadata = {
  title: "Spiritual Colors - Explore Symbolism, Energy and Meaning",
  description:
    "Discover spiritual colors, their symbolism, energetic qualities, chakra connections, and practical uses. Curated articles from our headless WordPress CMS.",
  alternates: {
    canonical: "https://hexcolormeans.com/category/spiritual-colors/",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SpiritualColorsCategoryPage() {
  const { posts: rawPosts, categoryName } = await fetchPostsByCategory();

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
    { label: categoryName, href: "/category/spiritual-colors" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="bg-muted/30 py-12 px-4">
        <div className="w-full max-w-[1300px] mx-auto">
          <BreadcrumbNav items={crumbs} />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{categoryName}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Read expert guides about spiritual colors, their symbolism, energy, and practical applications in life and design.
            </p>
          </div>
        </div>
      </section>
      <main className="w-full max-w-[1300px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <article id="content" className="main-content grow-content flex-1">
            <CategoryPosts
              initialPosts={posts}
              categoryName={categoryName}
              categorySlug="spiritual-colors"
            />
          </article>
          <ColorSidebar color="#E0115F" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
