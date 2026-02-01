import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema, FAQSchema, ToolApplicationSchema, WebPageSchema } from "@/components/structured-data"
import { ColorWheelClient } from "@/components/tool-wrappers"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Info, Palette, HelpCircle, Layers } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Color Wheel - Free Online Chromatic Wheel & Harmony Tool | HexColorMeans",
    description:
        "Master color theory with our interactive color wheel. Generate professional harmonies like complementary, analogous, and triadic schemes using the chromatic wheel for artistic and design excellence.",
    keywords: ["color wheel", "chromatic wheel", "color harmony", "color theory", "hue tool", "color palette generator", "harmony selector"],
    alternates: {
        canonical: "https://hexcolormeans.com/color-wheel",
    },
    openGraph: {
        title: "Color Wheel - Free Online Chromatic Wheel & Harmony Tool | HexColorMeans",
        description:
            "Professional color wheel tool to explore chromatic relationships and generate perfect color schemes instantly. Explore color theory in real-time.",
        url: "https://hexcolormeans.com/color-wheel",
        siteName: "HexColorMeans",
        type: "website",
        images: [
            {
                url: "https://hexcolormeans.com/advanced-chromatic-or-color-wheel-tool-online-free.webp",
                width: 1200,
                height: 630,
                alt: "Professional Color Wheel and Chromatic Harmony Guide for Designers",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Color Wheel - Online Chromatic Tool | HexColorMeans",
        description:
            "Explore the interactive color wheel to discover perfect chromatic harmonies for your next project.",
        images: ["https://hexcolormeans.com/advanced-chromatic-or-color-wheel-tool-online-free.webp"],
    },
}

export default function ColorWheelPage() {
    const faqs = [
        {
            question: "What is a color wheel?",
            answer:
                "A color wheel, also known as a chromatic wheel, is a circular diagram that organizes colors by their chromatic relationship. It shows the connection between primary, secondary, and tertiary colors. Performance-driven designers use it to create balanced and visually appealing palettes based on established geometric patterns.",
        },
        {
            question: "How do designers use chromatic wheels?",
            answer:
                "Designers use chromatic wheels to identify harmonies that evoke specific moods. By rotating geometric shapes over the wheel, they find colors that naturally contrast or blend. This ensures visual consistency across UI/UX designs, branding, and digital illustrations.",
        },
        {
            question: "What is the most popular color harmony?",
            answer:
                "The Complementary harmony is widely considered the most popular. It uses two colors from opposite sides of the wheel to create high contrast. This drives attention to specific elements like 'Buy' buttons or calls to action.",
        },
        {
            question: "Why are complementary colors important for accessibility?",
            answer:
                "Complementary colors provide the highest visual contrast. This is crucial for readability and accessibility in digital products. High contrast ensures that text stands out from backgrounds, helping users with visual impairments navigate interfaces more easily.",
        },
        {
            question: "How do I save a palette from the wheel?",
            answer:
                "Once you generate a harmony using our interactive tool, you can copy the Hex or RGB codes directly. You can also export the entire scheme to your design software or save the URL to access your custom palette later.",
        },
    ]

    const harmonies = [
        {
            title: "Complementary",
            description: "Complementary colors are pairs of hues that reside directly opposite each other on the chromatic wheel. This relationship creates the highest possible level of visual contrast and vibration. Designers use this scheme to make specific elements pop against a background. It is perfect for calls-to-action and important highlights.",
            image: "complementary-color-harmony.webp"
        },
        {
            title: "Analogous",
            description: "Analogous harmonies consist of three colors that sit side-by-side on the color wheel. These palettes are naturally pleasing to the eye because they often appear in nature. They create a serene and comfortable design experience. When using this harmony, designers typically pick one dominant color and use the others as subtle accents.",
            image: "analogous-color-harmony.webp"
        },
        {
            title: "Triadic",
            description: "A triadic color harmony uses three colors that are evenly spaced around the wheel, forming a perfect equilateral triangle. This scheme tends to be quite vibrant and rich, even if you use unsaturated or pale versions of the hues. It provides a high level of visual balance while maintaining a professional and diverse aesthetic.",
            image: "triadic-color-harmony.webp"
        },
        {
            title: "Tetradic (Rectangle)",
            description: "Tetradic harmonies use four colors arranged into two complementary pairs. On the chromatic wheel, these points form a rectangle. This scheme is incredibly varied and offers plenty of room for creative expression. To maintain balance, it is best to choose one primary color and use the remaining three as supporting accents throughout the design.",
            image: "tetradic-color-harmony.webp"
        },
        {
            title: "Split Complementary",
            description: "The split-complementary harmony is a variation of the standard complementary scheme. It uses one base color and the two colors located adjacent to its complement. This provides strong visual contrast similar to a complementary palette but with significantly less tension. It is a safer choice for beginners who want high contrast without visual clashing.",
            image: "split-complementary-color-harmony.webp"
        },
        {
            title: "Square",
            description: "The square harmony is similar to the tetradic scheme, but all four colors are spaced evenly around the color wheel (90 degrees apart). This creates a perfect square shape. It offers a great balance between warm and cool tones. Like the tetradic harmony, you should pay attention to color dominance to avoid a messy or overwhelming visual result.",
            image: "square-color-harmony.webp"
        },
        {
            title: "Double Split Complementary",
            description: "This is a complex and sophisticated harmony that involves five distinct colors. It uses a base hue, its two adjacent colors, and the colors adjacent to its direct complement across the wheel. Designers use this for highly detailed illustrations and complex UI systems where a wide variety of hues must exist in a controlled, harmonic state.",
            image: "double-split-complementary-color-harmony.webp"
        },
        {
            title: "Monochromatic",
            description: "Monochromatic harmonies utilize varying tones, shades, and tints of a single hue. By adjusting the saturation and luminance, you create a cohesive and elegant look that is impossible to clash. This is the most reliable way to create a professional design that feels unified and sophisticated. It works exceptionally well for clean, modern interfaces.",
            image: "monochromatic-color-harmony.webp"
        },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-background text-left font-sans">
            <WebPageSchema
                name="Color Wheel"
                url="https://hexcolormeans.com/color-wheel"
                description="Interactive chromatic wheel to explore 8 types of color harmonies for professional design. Learn Complementary, Analogous, and Triadic schemes."
            />
            <BreadcrumbSchema items={[
                { name: "Home", item: "https://hexcolormeans.com" },
                { name: "Color Wheel", item: "https://hexcolormeans.com/color-wheel" }
            ]} />
            <Header />

            <section className="bg-muted/30 py-12 px-4 border-b">
                <div className="container mx-auto">
                    <div className="mb-6">
                        <BreadcrumbNav items={[{ label: "Color Wheel", href: "/color-wheel" }]} />
                    </div>
                    <div className="text-center space-y-4 max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight">
                            Color Wheel
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium text-pretty text-center">
                            Master color relationships and create harmonious color combinations using our interactive chromatic wheel.
                        </p>
                    </div>
                </div>
            </section>

            <main className="w-full max-w-[1350px] mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    <article id="content" className="main-content grow-content flex-1 space-y-16">
                        <ToolApplicationSchema
                            name="Color Wheel Tool"
                            slug="color-wheel"
                            description="A professional chromatic wheel interface for selecting hues and building coordinated color palettes based on harmony rules."
                        />

                        {/* Tool Area */}
                        <section className="space-y-8">
                            <ColorWheelClient />
                        </section>

                        {/* How to Use Area with border */}
                        <section className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-12 bg-white">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-8 h-8 text-primary" />
                                    <h2 className="text-4xl font-bold m-0">How to Use the Color Wheel</h2>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-8 items-stretch">
                                    <div className="space-y-6">
                                        <p className="text-lg text-muted-foreground leading-relaxed">
                                            Using our interactive chromatic wheel is simple and efficient. Follow these steps to generate professional palettes for your next project:
                                        </p>
                                        <ul className="space-y-4">
                                            {[
                                                "Select a base color from the center wheel or enter a Hex code in the input box.",
                                                "Choose a harmony type from the dropdown menu to see related colors.",
                                                "Adjust the saturation and luminance sliders to refine the mood of your palette.",
                                                "View the updated color combinations instantly in the breakdown section below.",
                                                "Click any color code to copy it to your clipboard for use in your code or design tool."
                                            ].map((step, i) => (
                                                <li key={i} className="flex gap-4">
                                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{i + 1}</span>
                                                    <span className="text-muted-foreground pt-1 font-medium">{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <Card className="overflow-hidden border-2 border-border shadow-2xl relative min-h-[400px] flex items-center justify-center bg-white p-4 sm:p-10">
                                        <img
                                            src="/advanced-chromatic-or-color-wheel-tool-online-free.webp"
                                            alt="Professional user interface of the online color wheel tool"
                                            className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
                                        />
                                    </Card>
                                </div>
                            </div>
                        </section>

                        {/* Why Use Area with border */}
                        <section className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-10 bg-white">
                            <div className="flex items-center gap-3">
                                <Info className="w-8 h-8 text-primary" />
                                <h2 className="text-4xl font-bold m-0">Why Use a Color Wheel?</h2>
                            </div>
                            <div className="max-w-none space-y-12">
                                <p className="text-lg text-muted-foreground leading-relaxed font-normal">
                                    The color wheel is the essential tool for anyone working with visuals. It bridges the gap between raw intuition and mathematical precision. By understanding how colors relate on a circular spectrum, you remove the guesswork from design.
                                </p>
                                <p className="text-lg text-muted-foreground leading-relaxed font-normal">
                                    For developers, it ensures UI components meet accessibility standards through high contrast. For designers, it provides a structured way to build emotional connection with users. A well-chosen chromatic scheme can make a brand feel trustworthy, exciting, or calm within seconds of interaction.
                                </p>
                            </div>
                        </section>

                        {/* Understanding Color Harmonies with border */}
                        <section className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-16 bg-white">
                            <div className="flex items-center gap-3">
                                <Layers className="w-8 h-8 text-primary" />
                                <h2 className="text-4xl font-bold m-0">Understanding Color Harmonies</h2>
                            </div>
                            <p className="text-lg text-muted-foreground max-w-3xl m-0">Explore the core geometric relationships that define professional color theory.</p>

                            <div className="space-y-32">
                                {harmonies.map((harmony, idx) => (
                                    <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16`}>
                                        <div className="flex-1 space-y-6 text-left">
                                            <h3 className="text-4xl font-extrabold text-foreground">{harmony.title}</h3>
                                            <p className="text-lg text-muted-foreground leading-relaxed font-normal">{harmony.description}</p>
                                        </div>
                                        <div className="flex-1 w-full flex justify-center">
                                            <Card className="overflow-hidden border-2 border-border shadow-2xl transition-all hover:scale-[1.02] duration-500 max-w-lg w-full rounded-2xl bg-white p-5 sm:p-8">
                                                <img
                                                    src={`/${harmony.image}`}
                                                    alt={`${harmony.title} color harmony pattern`}
                                                    className="w-full h-full object-contain"
                                                />
                                            </Card>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FAQs Area with border */}
                        <section id="faqs" className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-12 bg-white">
                            <div className="flex items-center gap-4">
                                <HelpCircle className="w-10 h-10 text-primary" />
                                <h2 className="text-4xl font-bold m-0">FAQs About Color Wheel</h2>
                            </div>
                            <div className="max-w-5xl">
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {faqs.map((faq, i) => (
                                        <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl px-6 bg-white transition-colors hover:bg-accent/5">
                                            <AccordionTrigger className="text-xl font-bold text-left hover:no-underline py-6">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-lg text-muted-foreground leading-relaxed pb-6 text-left">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </section>
                    </article>
                    <div className="hidden lg:block w-[340px]">
                        <div className="sticky top-24">
                            <ColorSidebar color="#E0115F" />
                        </div>
                    </div>
                </div>
            </main>

            <ExploreColorTools current="color-wheel" />

            <Footer />
        </div>
    )
}
