import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema, FAQSchema, ToolApplicationSchema, WebPageSchema } from "@/components/structured-data"
import { ColorBlindnessSimulatorClient } from "@/components/tool-wrappers"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"
import { Card } from "@/components/ui/card"
import { Info, HelpCircle, Eye, CheckCircle2, ShieldAlert, Palette, Layers, Accessibility } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Color Blindness Simulator - Free Online Color Vision Deficiency Checker | HexColorMeans",
  description: "Test your designs for accessibility with our professional color blindness simulator. Model various vision deficiencies like Protanopia, Deuteranopia, and Tritanopia instantly to ensure WCAG compliance.",
  keywords: ["color blindness simulator", "color blindness checker", "color vision deficiency checker", "color vision deficiency simulator", "accessibility testing", "protanopia simulator", "deuteranopia tool", "WCAG accessibility tool"],
  alternates: {
    canonical: "https://hexcolormeans.com/color-blindness-simulator",
  },
  openGraph: {
    title: "Color Blindness Simulator - Free Online Color Vision Deficiency Simulator | HexColorMeans",
    description: "Simulate how colors appear to people with different types of color vision deficiency. Ensure your designs are accessible to all users with our professional-grade simulator.",
    url: "https://hexcolormeans.com/color-blindness-simulator",
    siteName: "HexColorMeans",
    type: "website",
    images: [
      {
        url: "https://hexcolormeans.com/advanced-color-blindness-simulator-tool-online-free.webp",
        width: 1200,
        height: 630,
        alt: "Professional Color Blindness Simulator and Vision Deficiency Audit Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Blindness Simulator - Vision Deficiency Checker | HexColorMeans",
    description: "Audit your color choices for inclusivity. Model Protanopia, Deuteranopia, and Tritanopia in real-time.",
    images: ["https://hexcolormeans.com/advanced-color-blindness-simulator-tool-online-free.webp"],
  },
}

export default function ColorBlindnessSimulatorPage() {
  const faqs = [
    {
      question: "How accurate is the color blindness simulator?",
      answer:
        "Our simulator uses research-backed mathematical matrices to model how light is perceived by different cone cells. While it provides a high-fidelity approximation, it is important to remember that individual color vision exists on a spectrum.",
    },
    {
      question: "Which type of color vision deficiency is most common?",
      answer:
        "Deuteranomaly, a form of red-green color blindness, is the most common deficiency. It affects roughly 5% of all men. Protanomaly and Deuteranopia are also frequently tested in professional accessibility audits.",
    },
    {
      question: "Should I test every color in my design system?",
      answer:
        "Yes. You should prioritize testing functional colors like buttons, alerts, and navigation links. Ensuring these remain distinguishable across all vision types is critical for a usable and inclusive interface.",
    },
    {
      question: "Can I fix my palette if it fails the simulator test?",
      answer:
        "Absolutely. If two colors look too similar in a simulation, try adjusting their lightness or saturation. Often, increasing the contrast between hues is enough to make them distinct for users with vision deficiencies.",
    },
    {
      question: "Is color blindness testing required by law?",
      answer:
        "Digital accessibility laws like the ADA (US) and EAA (EU) require websites to be accessible. Testing for color vision deficiency is a key part of meeting WCAG 2.1 standards, ensuring your content is perceivable by all users.",
    },
  ]

  const types = [
    {
      title: "Red-Green Deficiencies",
      content: [
        { name: "Protanopia", desc: "Total lack of red retinal photoreceptors. Reds appear dark or gray." },
        { name: "Protanomaly", desc: "Reduced sensitivity to red light. Reds appear shifted toward green." },
        { name: "Deuteranopia", desc: "Total lack of green retinal photoreceptors. Greens appear brown or gray." },
        { name: "Deuteranomaly", desc: "Most common type. Reduced sensitivity to green, making it hard to separate from red." }
      ]
    },
    {
      title: "Blue-Yellow & Total Deficiencies",
      content: [
        { name: "Tritanopia", desc: "Very rare. Blue appears green, and yellow appears violet or light gray." },
        { name: "Tritanomaly", desc: "Reduced blue sensitivity. Colors appear slightly muted and harder to distinguish." },
        { name: "Achromatopsia", desc: "Total color blindness. Vision is limited to shades of black, white, and gray." }
      ]
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-left font-sans">
      <WebPageSchema
        name="Color Blindness Simulator"
        url="https://hexcolormeans.com/color-blindness-simulator"
        description="Professional online color blindness simulator to test design accessibility. Model Protanopia, Deuteranopia, Tritanopia, and more."
      />
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://hexcolormeans.com" },
        { name: "Color Blindness Simulator", item: "https://hexcolormeans.com/color-blindness-simulator" }
      ]} />
      <Header />

      <section className="bg-muted/30 py-12 px-4 border-b">
        <div className="container mx-auto">
          <div className="mb-6">
            <BreadcrumbNav items={[{ label: "Color Blindness Simulator", href: "/color-blindness-simulator" }]} />
          </div>
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight">
              Color Blindness Simulator
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium text-pretty text-center">
              Color Blindness Simulator lets you preview your designs through multiple types of color vision deficiency, helping designers and teams create accessible, inclusive, and compliant digital experiences with confidence.
            </p>
          </div>
        </div>
      </section>

      <main className="w-full max-w-[1350px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <article id="content" className="main-content grow-content flex-1 space-y-16">
            <ToolApplicationSchema
              name="Color Blindness Simulator"
              slug="color-blindness-simulator"
              description="A professional-grade simulation tool for auditing color vision deficiency and accessibility compliance."
            />

            {/* Tool Area */}
            <section className="space-y-8">
              <ColorBlindnessSimulatorClient />
            </section>

            {/* How to Audit Your Design section */}
            <section className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-12 bg-white">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                  <h2 className="text-4xl font-bold m-0">How to Audit Your Design</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-8 items-stretch">
                  <div className="space-y-6">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Auditing for accessibility is a critical step in professional UI/UX design. Follow these steps to verify your color choices:
                    </p>
                    <ul className="space-y-4">
                      {[
                        "Select any base color from your palette using our integrated color picker.",
                        "Choose a deficiency type—start with Deuteranopia as it is the most common.",
                        "Compare the original hue with the simulated result in the side-by-side preview.",
                        "Check if critical information (like 'Success' vs 'Error') remains distinguishable.",
                        "Adjust the hue or lightness until your color cues are clear to all users."
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
                      src="/advanced-color-blindness-simulator-tool-online-free.webp"
                      alt="Professional user interface of the online color blindness simulator tool"
                      className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
                    />
                  </Card>
                </div>
              </div>
            </section>

            {/* Comprehensive Guide to Color Vision Deficiency */}
            <section className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-10 bg-white">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold m-0">Guide to Color Vision Deficiency</h2>
              </div>
              <div className="space-y-12">
                <p className="text-lg text-muted-foreground leading-relaxed font-normal">
                  Color vision deficiency (CVD) affects how the eye perceives specific ranges of light. It is usually caused by the absence or malfunction of light-sensitive cone cells in the retina. Understanding these types is essential for building inclusive digital products.
                </p>

                <div className="grid md:grid-cols-2 gap-12 pt-4">
                  {types.map((group, i) => (
                    <div key={i} className="space-y-6">
                      <h3 className="text-2xl font-bold text-foreground border-b pb-2">{group.title}</h3>
                      <div className="space-y-6">
                        {group.content.map((type, j) => (
                          <div key={j} className="space-y-1">
                            <h4 className="text-xl font-bold text-primary">{type.name}</h4>
                            <p className="text-lg text-muted-foreground">{type.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Designing for Total Inclusion */}
            <section className="border-2 border-border/60 rounded-3xl p-8 sm:p-12 space-y-12 bg-white">
              <div className="flex items-center gap-3">
                <Accessibility className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold text-left m-0">Designing for Total Inclusion</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Great design works for everyone. Accessibility isn't just about passing a test; it's about providing a reliable experience. Follow these best practices to ensure your interface is truly inclusive:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">✓</div>
                      <p className="text-lg text-muted-foreground font-medium">Never rely on color alone to convey crucial state changes or information.</p>
                    </li>
                    <li className="flex gap-4">
                      <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">✓</div>
                      <p className="text-lg text-muted-foreground font-medium">Use patterns, icons, or text labels alongside color for better distinction.</p>
                    </li>
                    <li className="flex gap-4">
                      <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">✓</div>
                      <p className="text-lg text-muted-foreground font-medium">Maintain high luminance contrast between elements, especially for typography.</p>
                    </li>
                  </ul>
                </div>
                <div className="bg-primary/5 rounded-2xl p-8 flex flex-col justify-center border border-primary/10 shadow-inner">
                  <p className="text-2xl text-primary font-bold mb-4 italic">"Accessibility is the hallmark of professional design quality."</p>
                  <p className="text-lg text-muted-foreground italic">— Inclusive Design Principles</p>
                </div>
              </div>
            </section>

            {/* FAQs Area Section */}
            <section id="faqs" className="border-2 border-border/60 rounded-3xl p-4 sm:p-12 space-y-12 bg-white">
              <div className="flex items-center gap-4">
                <HelpCircle className="w-10 h-10 text-primary" />
                <h2 className="text-4xl font-bold m-0 text-left">FAQs About Color Blindness</h2>
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

      <ExploreColorTools current="color-blindness-simulator" />
      <Footer />
    </div>
  )
}
