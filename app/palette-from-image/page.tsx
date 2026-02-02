import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema, FAQSchema, ToolApplicationSchema, WebPageSchema } from "@/components/structured-data"
import { PaletteFromImageClient } from "@/components/tool-wrappers"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Info, Palette, HelpCircle, Layers, ShieldCheck, Zap } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Image Palette Generator - Create Beautiful Color Palettes from Images | HexColorMeans",
  description: "Generate stunning color palettes from any photograph or design asset. Our advanced image palette generator extracts dominant hues to create professional color combinations instantly.",
  keywords: ["palette from image", "image palette generator", "color combination from image", "color palette from image", "extract palette from photo", "photo color palette"],
  alternates: {
    canonical: "https://hexcolormeans.com/palette-from-image",
  },
  openGraph: {
    title: "Image Palette Generator - Create Beautiful Color Palettes from Images | HexColorMeans",
    description: "Deconstruct your favorite visuals into professional color scales with algorithmic precision. Extract dominant hues instantly with our image palette generator.",
    url: "https://hexcolormeans.com/palette-from-image",
    siteName: "HexColorMeans",
    type: "website",
    images: [
      {
        url: "https://hexcolormeans.com/advanced-color-palette-from-image-tool-online-free.webp",
        width: 1200,
        height: 630,
        alt: "Professional Image Palette Generator and Quantized Color Analysis Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Palette Generator - Create Palettes from Photos | HexColorMeans",
    description: "Generate cohesive color combinations from your images. Precision color quantization for professional design results.",
    images: ["https://hexcolormeans.com/advanced-color-palette-from-image-tool-online-free.webp"],
  },
}

export default function PaletteFromImagePage() {
  const faqs = [
    {
      question: "How does the image palette generator work?",
      answer:
        "The tool uses a k-means quantization algorithm to sample the pixels in your image. It groups related colors into clusters and identifies the center of each cluster as a dominant pigment, ensuring the resulting palette represents the true visual weight of the original asset.",
    },
    {
      question: "How many colors can I extract from one image?",
      answer:
        "By default, we extract a balanced set of 8 dominant colors. However, you can adjust the sensitivity using the selector to harvest anywhere from 2 to 12 distinct tones, captured as HEX and RGB values.",
    },
    {
      question: "Is my image resolution important for extraction?",
      answer:
        "While higher resolution images provide more raw data, our algorithm works efficiently across all sizes. Even web-optimized or lower-resolution photos will yield accurate dominant palettes since the tool analyzes the overall chromatic distribution.",
    },
    {
      question: "Can I use these palettes for commercial projects?",
      answer:
        "Absolutely. The color values extracted are independent of the source image's copyright. You are free to use these HEX and RGB combinations in your website, branding, or digital products.",
    },
    {
      question: "Are my uploaded images kept private?",
      answer:
        "Yes. Total privacy is built in. All image analysis is performed locally in your browser memory via the Canvas API. Your images never leave your computer and are permanently cleared the moment you close the tab.",
    },
  ]

  const features = [
    {
      title: "Quantized Distribution",
      description: "Our algorithm doesn't just pick pixels; it identifies clusters that define the visual mood, ensuring your palette captures the 'soul' of the image.",
      icon: Palette
    },
    {
      title: "Real-time Sensitivity",
      description: "Dynamically adjust the number of extracted colors to find the perfect balance between primary tones and subtle accent hues.",
      icon: Zap
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-left font-sans">
      <WebPageSchema
        name="Palette from Image"
        url="https://hexcolormeans.com/palette-from-image"
        description="Professional online image palette generator to extract balanced color schemes and dominant hex codes from digital assets."
      />
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://hexcolormeans.com" },
        { name: "Palette from Image", item: "https://hexcolormeans.com/palette-from-image" }
      ]} />
      <Header />

      <section className="bg-muted/30 py-12 px-4 border-b">
        <div className="w-full max-w-[1350px] mx-auto">
          <div className="mb-6">
            <BreadcrumbNav items={[{ label: "Palette from Image", href: "/palette-from-image" }]} />
          </div>
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight">
              Palette from Image
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium text-pretty text-center">
              Palette from Image helps you turn any photo into a refined color palette by extracting dominant hues and key accents, making it easy to create balanced, professional color schemes in seconds.
            </p>
          </div>
        </div>
      </section>

      <main className="w-full max-w-[1350px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <article id="content" className="main-content grow-content flex-1 space-y-16">
            <ToolApplicationSchema
              name="Image-to-Palette Generator"
              slug="palette-from-image"
              description="A precision engine for extracting balanced color schemes and dominant hex codes from photographic or digital assets."
            />

            {/* Tool Area */}
            <section className="space-y-8">
              <PaletteFromImageClient />
            </section>

            {/* How to Generate Palettes section */}
            <section className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-12 bg-white">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                  <h2 className="text-4xl font-bold m-0">How to Generate Palettes</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-8 items-stretch">
                  <div className="space-y-6">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Using our interactive generator is the fastest way to turn inspiration into actual design data. Follow these simple steps:
                    </p>
                    <ul className="space-y-4">
                      {[
                        "Upload a photograph or design asset using the 'Upload Image' button.",
                        "Our algorithm will instantly analyze the chromatic distribution of the asset.",
                        "Use the dropdown to increase or decrease the number of colors in your palette.",
                        "View the visual breakdown of color weights in the distribution chart.",
                        "Export the entire scheme as a text file or explore individual colors in-depth."
                      ].map((step, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">{i + 1}</span>
                          <span className="text-lg text-muted-foreground pt-1 font-medium">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Card className="overflow-hidden border-2 border-border shadow-2xl relative min-h-[400px] flex items-center justify-center bg-white p-4 sm:p-10">
                    <img
                      src="/advanced-color-palette-from-image-tool-online-free.webp"
                      alt="Professional user interface of the online palette from image tool"
                      className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
                    />
                  </Card>
                </div>
              </div>
            </section>

            {/* Why Use an Image Palette Generator? section */}
            <section className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-10 text-left bg-white">
              <div className="flex items-center gap-3">
                <Info className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold m-0">Why Use an Image Palette Generator?</h2>
              </div>
              <div className="max-w-none space-y-12">
                <p className="text-lg text-muted-foreground leading-relaxed font-normal">
                  Color is the "soul" of any visual narrative. An image palette generator bridges the gap between raw intuition and mathematical precision, allowing you to harvest the exact chromatic relationships found in nature, fine art, or professional photography. By extracting consistent color scales, you ensure your branding and designs resonate with the same emotional impact as your reference inspiration.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed font-normal">
                  Furthermore, our tool automates the tedious work of manual color selection. Algorithmic extraction ensures that dominant hues are weighted accurately, preventing human bias from ignoring subtle but essential accent pigments. This scientific approach to palette building is the key to creating cohesive and professional digital environments.
                </p>
              </div>
            </section>

            {/* Professional Color Harmonization Section with border */}
            <section className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-12 bg-white">
              <div className="flex items-center gap-3">
                <Layers className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold m-0">Professional Color Harmonization</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                {features.map((feature, i) => (
                  <Card key={i} className="p-5 sm:p-8 space-y-4 border-2 border-border/50 hover:border-primary/30 transition-all shadow-md hover:shadow-xl rounded-2xl bg-white">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
                  </Card>
                ))}
                <div className="sm:col-span-2">
                  <p className="text-lg text-muted-foreground italic border-l-4 border-primary/20 pl-6 py-2">
                    Pro Tip: Use photographs with varied lighting but consistent hues to extract a palette that scales gracefully across shadows and highlights.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQs Area Section with border */}
            <section id="faqs" className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-12 bg-white">
              <div className="flex items-center gap-4">
                <HelpCircle className="w-10 h-10 text-primary" />
                <h2 className="text-4xl font-bold m-0 text-left">FAQs About Image Palettes</h2>
              </div>
              <div className="max-w-5xl">
                <FAQSchema faqs={faqs} />
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

      <ExploreColorTools current="palette-from-image" />
      <Footer />
    </div>
  )
}
