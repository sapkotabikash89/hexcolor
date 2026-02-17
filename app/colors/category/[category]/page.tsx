import { Suspense } from "react"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { ColorLibrary } from "@/components/color-library"
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/structured-data"
import { notFound } from "next/navigation"

import { ShareButtons } from "@/components/share-buttons"

export const dynamic = "force-static";

const CATEGORY_NAMES: Record<string, string> = {
    reds: "Red Colors",
    pinks: "Pink Colors",
    oranges: "Orange Colors",
    yellows: "Yellow Colors",
    greens: "Green Colors",
    blues: "Blue Colors",
    purples: "Purple Colors",
    browns: "Brown Colors",
    grays: "Gray Colors",
}

export async function generateStaticParams() {
    return Object.keys(CATEGORY_NAMES).map((category) => ({
        category,
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const { category } = await params
    const name = CATEGORY_NAMES[category] || category

    return {
        title: `${name} Library - All Shades and Meanings | HexColorMeans`,
        description: `Explore all ${category} colors in our library. Complete list of ${category} shades with hex codes, RGB values, and color names.`,
        alternates: {
            canonical: `https://hexcolormeans.com/colors/category/${category}/`,
        }
    }
}

export default async function CategoryColorsPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params
    const categoryName = CATEGORY_NAMES[category]

    if (!categoryName) {
        notFound()
    }

    const baseUrl = "https://hexcolormeans.com"

    return (
        <div className="flex flex-col min-h-screen">
            <CollectionPageSchema name={`${categoryName} Library`} url={`${baseUrl}/colors/category/${category}/`} />
            <BreadcrumbSchema items={[
                { name: "Home", item: "https://hexcolormeans.com/" },
                { name: "Color Library", item: "https://hexcolormeans.com/colors/" },
                { name: categoryName, item: `https://hexcolormeans.com/colors/category/${category}/` }
            ]} />
            <Header />

            <section className="bg-muted/30 py-12 px-4 border-b">
                <div className="w-full max-w-[1300px] mx-auto">
                    <BreadcrumbNav items={[
                        { label: "Color Library", href: "/colors/" },
                        { label: categoryName, href: `/colors/category/${category}/` }
                    ]} />
                    <div className="text-center space-y-4 max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">{categoryName}</h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                            Explore every shade of {category} in our collection. From deep tones to bright tints, find the perfect {category} for your project.
                        </p>
                    </div>
                </div>
            </section>

            <main className="w-full max-w-[1300px] mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-6">
                    <article id="content" className="main-content grow-content flex-1" itemProp="articleBody">
                        <div className="space-y-12">
                            <Suspense fallback={<div className="p-12 text-center">Loading color library...</div>}>
                                <ColorLibrary activeCategory={category} hidePagination={true} />
                            </Suspense>

                            <div className="mt-8 pt-8 border-t flex flex-col items-center gap-6">
                                <ShareButtons title={`Explore all ${categoryName} on HexColorMeans`} />
                            </div>
                        </div>
                    </article>
                    <aside className="hidden lg:block w-[340px] shrink-0">
                        <ColorSidebar color="#E0115F" />
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    )
}
