import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ColorSidebar } from "@/components/sidebar";
import { CategoryPosts } from "@/components/category-posts";

import { getAllPosts } from "@/lib/wordpress";

export const metadata = {
  title: "Blog - Latest Articles on Color Meanings, Psychology & Design",
  description: "Read all articles about colors, their meanings, psychology, spirituality, and cultural symbolism. Latest posts from HexColorMeans.",
};

export default async function BlogPage() {
  const posts = await getAllPosts(100);

  // Transform posts to include category information
  const transformedPosts = posts.map((post: any) => ({
    ...post,
    categoryName: post?.categories?.nodes?.[0]?.name || "Uncategorized",
    categorySlug: post?.categories?.nodes?.[0]?.slug || "uncategorized"
  }));

  const crumbs = [
    { label: "Blog", href: "/blog" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="bg-muted/30 py-12 px-4">
        <div className="w-full max-w-[1350px] mx-auto">
          <BreadcrumbNav items={crumbs} />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Blog</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Read all articles about colors, their meanings, psychology, spirituality, and cultural symbolism
            </p>
          </div>
        </div>
      </section>
      <main className="w-full max-w-[1350px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <article id="content" className="main-content grow-content flex-1" itemProp="articleBody">
            <CategoryPosts
              initialPosts={transformedPosts}
              categoryName="Blog"
              categorySlug="blog"
            />
          </article>
          <ColorSidebar color="#E0115F" />
        </div>
      </main>
      <Footer />
    </div>
  );
}