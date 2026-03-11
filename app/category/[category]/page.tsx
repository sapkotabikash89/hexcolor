import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GlobalLayout } from "@/components/layout/global-layout";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ColorSidebar } from "@/components/sidebar";
import { CategoryPosts } from "@/components/category-posts";
import { CollectionPageSchema, BreadcrumbSchema } from "@/components/structured-data";

import { getPostsByCategory, getAllCategories } from "@/lib/wordpress";

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
    alternates: {
      canonical: `https://hexcolormeans.com/category/${categorySlug}/`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const { posts: rawPosts, categoryName } = await getPostsByCategory(categorySlug);

  // Ensure strict type compatibility with CategoryPosts component
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
    { label: categoryName, href: `/category/${categorySlug}/` },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <CollectionPageSchema name={categoryName} url={`https://hexcolormeans.com/category/${categorySlug}/`} />
      <BreadcrumbSchema items={[
        { name: "HexColorMeans", item: "https://hexcolormeans.com/" },
        { name: "Categories", item: "https://hexcolormeans.com/category/" },
        { name: categoryName, item: `https://hexcolormeans.com/category/${categorySlug}/` }
      ]} />
      <Header />
      <section className="bg-muted/30 py-12 px-4">
        <div className="w-full max-w-[1300px] mx-auto">
          <BreadcrumbNav items={crumbs} />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{categoryName}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Read expert guides about {categoryName.toLowerCase()}, their psychology, symbolism, and cultural significance
            </p>
          </div>
        </div>
      </section>

      <GlobalLayout
        rightSidebar={<ColorSidebar color="#E0115F" />}
        rightSidebarClassName="lg:block w-[340px] sticky top-24 self-start"
        articleClassName="main-content grow-content flex-1"
      >
        <div className="py-12">
            <CategoryPosts
              initialPosts={posts}
              categoryName={categoryName}
              categorySlug={categorySlug}
            />
        </div>
      </GlobalLayout>
      <Footer />
    </div>
  );
}
