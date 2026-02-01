import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ColorSidebar } from "@/components/sidebar";
import { CategoryPosts } from "@/components/category-posts";

import { getPostsByCategory, getAllCategories } from "@/lib/wordpress";

export const dynamicParams = false;

export async function generateStaticParams() {
  console.log("Generating static params for categories...");
  const categories = await getAllCategories();
  if (!categories || categories.length === 0) {
    console.log("No categories found. Returning fallback to prevent build error.");
    return [{ category: "uncategorized" }];
  }
  return categories.map((category: any) => ({
    category: category.slug,
  }));
}

type CategoryPageProps = {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const capitalizedCategory = categorySlug
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${capitalizedCategory} - HexColorMeans`,
    description: `Explore ${capitalizedCategory.toLowerCase()} articles and guides on HexColorMeans. Latest posts about ${capitalizedCategory.toLowerCase()} meanings, psychology, and symbolism.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const { posts, categoryName } = await getPostsByCategory(categorySlug);

  // Define breadcrumbs
  const crumbs = [
    { label: categoryName, href: `/categories/${categorySlug}` },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <BreadcrumbNav items={crumbs} />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{categoryName}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Read expert guides about {categoryName.toLowerCase()}, their psychology, symbolism, and cultural significance
            </p>
          </div>
        </div>
      </section>
      <main className="w-full max-w-[1280px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <article id="content" className="main-content grow-content flex-1">
            <CategoryPosts
              initialPosts={posts}
              categoryName={categoryName}
              categorySlug={categorySlug}
            />
          </article>
          <ColorSidebar color="#E0115F" />
        </div>
      </main>
      <Footer />
    </div>
  );
}