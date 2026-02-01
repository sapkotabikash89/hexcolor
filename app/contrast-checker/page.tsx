import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema, FAQSchema, ToolApplicationSchema, WebPageSchema } from "@/components/structured-data"
import { ContrastCheckerClient } from "@/components/tool-wrappers"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"
import { Card } from "@/components/ui/card"
import { Info, HelpCircle, ShieldAlert, FileCheck, Layers, BadgeCheck } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Color Contrast Checker - Free Online WCAG Color Contrast Accessibility Tool | HexColorMeans",
  description: "Verify your design's legibility with our professional contrast checker. Ensure your color combinations meet WCAG AA and AAA accessibility standards instantly for a truly inclusive web experience.",
  keywords: ["contrast checker", "color contrast checker", "contrast checker accessibility", "contrast checker WCAG", "accessibility compliance", "color contrast tool", "WCAG AA checker", "WCAG AAA checker"],
  alternates: {
    canonical: "https://hexcolormeans.com/contrast-checker",
  },
  openGraph: {
    title: "Color Contrast Checker - Free Online WCAG Color Contrast Accessibility Tool | HexColorMeans",
    description:
      "Verify your design's legibility with our professional contrast checker. Ensure your color combinations meet WCAG AA and AAA accessibility standards with our real-time audit tool.",
    url: "https://hexcolormeans.com/contrast-checker",
    siteName: "HexColorMeans",
    type: "website",
    images: [
      {
        url: "https://hexcolormeans.com/advanced-color-contrast-checker-tool-online-free.webp",
        width: 1200,
        height: 630,
        alt: "Professional Color Contrast Checker and WCAG Accessibility Audit Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Contrast Checker - WCAG Accessibility Audit Tool | HexColorMeans",
    description:
      "Ensure your designs are accessible. Real-time WCAG contrast ratio analysis for AA and AAA compliance and professional inclusive design.",
    images: ["https://hexcolormeans.com/advanced-color-contrast-checker-tool-online-free.webp"],
  },
}

export default function ContrastCheckerPage() {
  const faqs = [
    {
      question: "What is a color contrast checker?",
      answer:
        "A color contrast checker measures the luminance difference between two colors. It calculates a ratio to ensure text is readable for everyone.",
    },
    {
      question: "Why is WCAG compliance important?",
      answer:
        "WCAG compliance makes your site accessible to users with visual impairments. It also helps meet legal requirements like the ADA and EAA.",
    },
    {
      question: "What is the difference between AA and AAA levels?",
      answer:
        "Level AA requires a 4.5:1 ratio for normal text. Level AAA is stricter, requiring a 7:1 ratio for maximum accessibility.",
    },
    {
      question: "Does contrast matter for icons and borders?",
      answer:
        "Yes. WCAG 2.1 requires a 3:1 contrast ratio for graphical objects and UI components to ensure they are visible to all users.",
    },
    {
      question: "How do I fix a failing contrast ratio?",
      answer:
        "Adjust the lightness or saturation of your colors. Small shifts in tone can often achieve compliance while keeping your brand aesthetic.",
    },
  ]

  const features = [
    {
      title: "Luminance Analysis",
      description: "Our tool calculated relative luminance in real-time, providing exact contrast ratios for any foreground and background pairing.",
      icon: ShieldAlert
    },
    {
      title: "UI Component Audit",
      description: "Beyond just text, verify the visibility of icons, input borders, and active states against the latest non-text contrast standards.",
      icon: FileCheck
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-left font-sans">
      <WebPageSchema
        name="Contrast Checker"
        url="https://hexcolormeans.com/contrast-checker"
        description="Professional online contrast checker for WCAG accessibility compliance. Ensure your designs are readable and inclusive for all users."
      />
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://hexcolormeans.com" },
        { name: "Contrast Checker", item: "https://hexcolormeans.com/contrast-checker" }
      ]} />
      <Header />

      <section className="bg-muted/30 py-12 px-4 border-b">
        <div className="container mx-auto">
          <div className="mb-6">
            <BreadcrumbNav items={[{ label: "Color Contrast Checker", href: "/contrast-checker" }]} />
          </div>
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight">
              Color Contrast Checker
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium text-pretty text-center">
              Use our Contrast Checker to instantly validate your design’s legibility and ensure WCAG AA and AAA compliance for accessible, inclusive digital experiences.
            </p>
          </div>
        </div>
      </section>

      <main className="w-full max-w-[1350px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <article id="content" className="main-content grow-content flex-1 space-y-16">
            <ToolApplicationSchema
              name="Professional Contrast Checker"
              slug="contrast-checker"
              description="A precision accessibility tool for validating and optimizing luminance ratios for WCAG compliance."
            />

            {/* Tool Area */}
            <section className="space-y-8">
              <ContrastCheckerClient />
            </section>

            {/* Precision Accessibility Standards section */}
            <section className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-8 bg-white">
              <div className="flex items-center gap-3">
                <Info className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold m-0">Precision Accessibility Standards</h2>
              </div>
              <div className="max-w-none space-y-8">
                <p className="text-lg text-muted-foreground leading-relaxed font-normal">
                  Legibility is the foundation of user trust. A high-contrast interface ensures that your message reaches every user, regardless of their visual ability or environmental lighting. By meeting WCAG standards, you create a professional environment that prioritizes inclusion and clarity over guesswork.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed font-normal">
                  Meeting ADA and EAA requirements is vital for modern digital products. Our tool automates this validation, allowing you to focus on creativity while we handle the mathematical precision of luminance ratios. Inclusive design is not just a requirement; it is a mark of superior design quality.
                </p>
              </div>
            </section>

            {/* WCAG Accessibility Standards section */}
            <section className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-10 bg-white">
              <div className="flex items-center gap-3">
                <BadgeCheck className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold m-0">WCAG Accessibility Standards</h2>
              </div>
              <div className="space-y-8">
                <p className="text-lg text-muted-foreground leading-relaxed font-normal">
                  The Web Content Accessibility Guidelines, known as WCAG, define how to make web content easier to read and use for people with disabilities, especially users with visual challenges.
                </p>

                <div className="grid md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">WCAG AA | Minimum Compliance</h3>
                    <ul className="space-y-2 text-lg text-muted-foreground">
                      <li className="flex items-start gap-2">• <span>Normal text requires a 4.5:1 contrast ratio</span></li>
                      <li className="flex items-start gap-2">• <span>Large text requires a 3:1 contrast ratio</span></li>
                      <li className="flex items-start gap-2">• <span>This level is expected for most public websites</span></li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">WCAG AAA | Enhanced Compliance</h3>
                    <ul className="space-y-2 text-lg text-muted-foreground">
                      <li className="flex items-start gap-2">• <span>Normal text requires a 7:1 contrast ratio</span></li>
                      <li className="flex items-start gap-2">• <span>Large text requires a 4.5:1 contrast ratio</span></li>
                      <li className="flex items-start gap-2">• <span>This is the highest level of accessibility support</span></li>
                    </ul>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed font-normal pt-4">
                  These standards help ensure color choices remain readable, inclusive, and usable across all screens and users.
                </p>
              </div>
            </section>

            {/* Accessibility & Professional Compliance section */}
            <section className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-12 bg-white">
              <div className="flex items-center gap-3">
                <Layers className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold text-left m-0">Accessibility & Professional Compliance</h2>
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
                    Pro Tip: When a primary color fails, generate a deeper variant for text while keeping the brand hue for large decorative elements.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQs Area Section */}
            <section id="faqs" className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-12 bg-white">
              <div className="flex items-center gap-4">
                <HelpCircle className="w-10 h-10 text-primary" />
                <h2 className="text-4xl font-bold m-0 text-left">FAQs About Color Contrast</h2>
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

      <ExploreColorTools current="contrast-checker" />
      <Footer />
    </div>
  )
}
