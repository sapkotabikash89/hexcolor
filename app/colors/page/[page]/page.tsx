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

// Import data to calculate max pages for generateStaticParams
import colorLibraryData from "@/lib/color-library-data.json"

export const dynamic = "force-static";

export async function generateStaticParams() {
    const perPage = 50
    const pages = Math.ceil(colorLibraryData.length / perPage)
    return Array.from({ length: pages - 1 }, (_, i) => ({
        page: (i + 2).toString(),
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
    const { page } = await params
    const pageNum = parseInt(page)

    return {
        title: `Color Library - Page ${pageNum} | HexColorMeans`,
        description: `Browse our comprehensive color library. Page ${pageNum} of our collection of thousands of colors with hex codes and names.`,
        alternates: {
            canonical: `https://hexcolormeans.com/colors/page/${pageNum}/`,
        },
        robots: {
            index: true,
            follow: true,
        }
    }
}

export default async function PaginatedColorsPage({ params }: { params: Promise<{ page: string }> }) {
    const { page } = await params
    const pageNum = parseInt(page)

    if (isNaN(pageNum) || pageNum < 1) {
        notFound()
    }

    const baseUrl = "https://hexcolormeans.com"

    return (
        <div className="flex flex-col min-h-screen">
            <CollectionPageSchema name={`Color Library - Page ${pageNum}`} url={`${baseUrl}/colors/page/${pageNum}/`} />
            <BreadcrumbSchema items={[
                { name: "Home", item: "https://hexcolormeans.com/" },
                { name: "Color Library", item: "https://hexcolormeans.com/colors/" },
                { name: `Page ${pageNum}`, item: `https://hexcolormeans.com/colors/page/${pageNum}/` }
            ]} />
            <Header />

            <section className="bg-muted/30 py-12 px-4 border-b">
                <div className="w-full max-w-[1300px] mx-auto">
                    <BreadcrumbNav items={[
                        { label: "Color Library", href: "/colors/" },
                        { label: `Page ${pageNum}`, href: `/colors/page/${pageNum}/` }
                    ]} />
                    <div className="text-center space-y-4 max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">Color Library - Page {pageNum}</h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                            Continue exploring our growing collection of colors. Technical data and meanings for every shade.
                        </p>
                    </div>
                </div>
            </section>

            <main className="w-full max-w-[1300px] mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-6">
                    <article id="content" className="main-content grow-content flex-1" itemProp="articleBody">
                        <div className="space-y-12">
                            <Suspense fallback={<div className="p-12 text-center">Loading color library...</div>}>
                                <ColorLibrary page={pageNum} />
                            </Suspense>

                            <div className="mt-8 pt-8 border-t flex flex-col items-center gap-6">
                                <ShareButtons title={`Explore Page ${pageNum} of the HexColorMeans Color Library`} />
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
