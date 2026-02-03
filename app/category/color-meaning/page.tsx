import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ColorSidebar } from "@/components/sidebar";
import { CategoryPosts } from "@/components/category-posts";
import { getPostsByCategory } from "@/lib/wordpress";

async function fetchPostsByCategory() {
  return await getPostsByCategory("color-meaning");
}

export const metadata = {
  title: "Color Meaning - Explore Psychology, Spirituality and Culture",
  description:
    "Explore color meanings, psychology, spirituality, and cultural symbolism. Curated articles from our headless WordPress CMS.",
};

export default async function HexColorMeansingCategoryPage() {
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

  // Define breadcrumbs
  const crumbs = [
    { label: categoryName, href: "/categories/color-meaning" },
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
              Read expert guides about colors, their psychology, spirituality, history, and usage in design
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
              categorySlug="color-meaning"
            />
          </article>
          <ColorSidebar color="#E0115F" />
        </div>
      </main>
      <Footer />
    </div>
  );
}