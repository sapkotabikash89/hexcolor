import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ColorSidebar } from "@/components/sidebar";

import { getAllCategories } from "@/lib/wordpress";

export const metadata = {
  title: "Color Categories - Browse All Topics",
  description: "Explore all color categories and topics on HexColorMeans. Find articles about color meanings, psychology, and more.",
};

export default async function AllCategoriesPage() {
  const categories = await getAllCategories();

  // Filter out categories with no posts
  const activeCategories = categories.filter((category: any) => (category.count ?? 0) > 0);

  const crumbs = [
    { label: "Categories", href: "/categories" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="bg-muted/30 py-12 px-4 border-b">
        <div className="container mx-auto">
          <BreadcrumbNav items={crumbs} />
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">Taxonomy of Color Intelligence</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Explore our structured knowledge base organized by chromatic domain. Our research is categorized to provide deep insights into psychological profiles, cultural symbolism, and technical implementations.
            </p>
          </div>
        </div>
      </section>
      <main className="w-full max-w-[1280px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <article id="content" className="main-content grow-content flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCategories.map((category: any, i: number) => (
                <a
                  key={i}
                  href={`/categories/${category.slug}`}
                  className="block p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-bold mb-2">{category.name}</h2>
                  <p className="text-muted-foreground">{category.count} post{category.count !== 1 ? 's' : ''}</p>
                </a>
              ))}
            </div>
          </article>
          <ColorSidebar color="#E0115F" />
        </div>
      </main>
      <Footer />
    </div>
  );
}