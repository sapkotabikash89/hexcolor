import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema, FAQSchema, ToolApplicationSchema, WebPageSchema } from "@/components/structured-data"
import { ImageColorPickerClient } from "@/components/tool-wrappers"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Info, Eye, HelpCircle, ShieldCheck, Zap, Layers, Image as ImageIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Image Color Picker - Free Online Tool to Extract Colors from Images | HexColorMeans",
  description: "Upload any image and extract exact hex, RGB, and HSL codes with our professional image color picker. Fast, accurate, and privacy-focused pixel extraction for professional design workflow.",
  keywords: ["image color picker", "extract color from image", "color picker from image", "get color from image", "online eyedropper tool", "pixel color extractor", "image palette generator", "photo color extractor"],
  alternates: {
    canonical: "https://hexcolormeans.com/image-color-picker",
  },
  openGraph: {
    title: "Image Color Picker - Free Online Tool to Extract Colors from Images | HexColorMeans",
    description: "Analyze and extract exact pixel values from any digital asset with our professional online eyedropper tool. Local processing for maximum privacy and accuracy.",
    url: "https://hexcolormeans.com/image-color-picker",
    siteName: "HexColorMeans",
    type: "website",
    images: [
      {
        url: "https://hexcolormeans.com/advanced-image-color-picker-tool-online-free.webp",
        width: 1200,
        height: 630,
        alt: "Professional Image Color Picker and Pixel Extraction Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Color Picker - Extract Colors from Photos | HexColorMeans",
    description: "Extract exact colors from any image. Identify hex codes and build palettes from your visual assets.",
    images: ["https://hexcolormeans.com/advanced-image-color-picker-tool-online-free.webp"],
  },
}

export default function ImageColorPickerPage() {
  const faqs = [
    {
      question: "What image formats are supported for color picking?",
      answer:
        "Our image color picker supports all modern web formats including JPG, PNG, WEBP, and GIF. For maximum color fidelity, we recommend using lossless formats like PNG to avoid compression artifacts.",
    },
    {
      question: "Are my uploaded images stored on your servers?",
      answer:
        "No. Your privacy is paramount. All image processing and color extraction happen locally within your browser using the Canvas API. Your images never touch our servers and are cleared once you close the session.",
    },
    {
      question: "How accurate is the color extraction?",
      answer:
        "The tool extracts raw pixel data directly from the coordinate you click. This provides 100% mathematical accuracy for the specific pixel selected, delivering exact HEX, RGB, and HSL values.",
    },
    {
      question: "Can I extract colors from SVG files?",
      answer:
        "Yes, our extractor can process SVG files as long as they can be rendered in the browser. It treates the rendered SVG as a high-fidelity image for pixel-perfect color selection.",
    },
    {
      question: "Does resolution affect the color results?",
      answer:
        "The hex code remains accurate regardless of resolution, as we sample individual pixels. However, higher resolution images provide a larger surface area and clearer details for easier pinpoint selection.",
    },
  ]

  const features = [
    {
      title: "Local Privacy Architecture",
      description: "Proprietary browser-based processing ensures your creative assets remain entirely on your machine, never reaching the cloud.",
      icon: ShieldCheck
    },
    {
      title: "Raw Pixel Analysis",
      description: "Extract direct source values from JPG, PNG, and WEBP files, avoiding the color degradation typical of standard screenshots.",
      icon: Zap
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-left font-sans">
      <WebPageSchema
        name="Image Color Picker"
        url="https://hexcolormeans.com/image-color-picker"
        description="Professional online image color picker to extract exact HEX, RGB, and HSL codes from any digital asset."
      />
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://hexcolormeans.com" },
        { name: "Image Color Picker", item: "https://hexcolormeans.com/image-color-picker" }
      ]} />
      <Header />

      <section className="bg-muted/30 py-12 px-4 border-b">
        <div className="container mx-auto">
          <div className="mb-6">
            <BreadcrumbNav items={[{ label: "Image Color Picker", href: "/image-color-picker" }]} />
          </div>
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight">
              Image Color Picker
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium text-pretty text-center">
              Quickly analyze and extract precise pixel colors from any digital image with our fast, privacy-focused tool for designers and developers.
            </p>
          </div>
        </div>
      </section>

      <main className="w-full max-w-[1350px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <article id="content" className="main-content grow-content flex-1 space-y-16">
            <ToolApplicationSchema
              name="Image Color Picker"
              slug="image-color-picker"
              description="A precision pixel extraction tool for harvesting exact color data from local image files."
            />

            {/* Tool Area */}
            <section className="space-y-8">
              <ImageColorPickerClient />
            </section>

            {/* How to Extract Colors section */}
            <section className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-12 bg-white">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                  <h2 className="text-4xl font-bold m-0">How to Extract Colors</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-8 items-stretch">
                  <div className="space-y-6">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Our high-fidelity extractor makes it easy to harvest palettes from your visuals. Follow these steps for precision results:
                    </p>
                    <ul className="space-y-4">
                      {[
                        "Click 'Upload Image' and select your local JPG, PNG, or WEBP file.",
                        "Directly move your cursor over the image—the magnifier will show exact pixels.",
                        "Click anywhere on the visual to lock in the desired color value.",
                        "Instantly receive HEX, RGB, and HSL codes in the sidebar breakdown.",
                        "Export your entire picked palette or explore individual hues in detail."
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
                      src="/advanced-image-color-picker-tool-online-free.webp"
                      alt="Professional user interface of the online image color picker tool"
                      className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
                    />
                  </Card>
                </div>
              </div>
            </section>

            {/* Why Use a Browser-Based Color Picker section */}
            <section className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-10 text-left bg-white">
              <div className="flex items-center gap-3">
                <Info className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold m-0">Why Use a Local Color Picker?</h2>
              </div>
              <div className="max-w-none space-y-12">
                <p className="text-lg text-muted-foreground leading-relaxed font-normal">
                  Professional design requires both precision and security. By processing your images locally using your browser&apos;s internal Canvas API, we ensure that your proprietary assets never touch an external server. This "privacy-first" architecture is essential for commercial projects where data security is non-negotiable.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed font-normal">
                  Furthermore, direct extraction avoids the color degradation associated with secondary screenshots or compression. You receive the raw, original pixel data, guaranteeing that the brand colors you extract are 100% accurate to the source file. High-fidelity extraction is the foundation of a professional design workflow.
                </p>
              </div>
            </section>

            {/* Professional Workflow Optimization Section */}
            <section className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-12 bg-white">
              <div className="flex items-center gap-3">
                <Layers className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold m-0">Professional Color Extraction</h2>
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
              </div>
            </section>

            {/* FAQs Area with border */}
            <section id="faqs" className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-12 bg-white">
              <div className="flex items-center gap-4">
                <HelpCircle className="w-10 h-10 text-primary" />
                <h2 className="text-4xl font-bold m-0 text-left">FAQs About Image Picking</h2>
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
          <div className="hidden lg:block w-[380px]">
            <div className="sticky top-24">
              <ColorSidebar color="#E0115F" />
            </div>
          </div>
        </div>
      </main>

      <ExploreColorTools current="image-color-picker" />
      <Footer />
    </div>
  )
}
