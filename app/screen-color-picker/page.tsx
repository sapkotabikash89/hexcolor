import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema, FAQSchema, ToolApplicationSchema, WebPageSchema } from "@/components/structured-data"
import { ScreenColorPickerClient } from "@/components/tool-wrappers"
import { ExploreColorTools } from "@/components/tools/explore-color-tools"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Info, Eye, HelpCircle, ShieldCheck, Zap, Layers, Pipette } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Screen Color Picker - Free Online Tool to Pick Colors from Anything | HexColorMeans",
  description: "Pick any color directly from your screen with our professional EyeDropper tool. Extract exact hex codes from other applications, websites, or images instantly with 1:1 pixel precision.",
  keywords: ["screen color picker", "online screen color picker", "eyedropper tool browser", "color picker from desktop", "pixel color picker", "os-native color sampler", "extract color from application"],
  alternates: {
    canonical: "https://hexcolormeans.com/screen-color-picker",
  },
  openGraph: {
    title: "Screen Color Picker - Free Online Tool to Pick Colors from Anything | HexColorMeans",
    description: "Sample pixels beyond the browser. Our professional screen picker utilizes OS-native precision to capture hex codes from any window on your entire display.",
    url: "https://hexcolormeans.com/screen-color-picker",
    siteName: "HexColorMeans",
    type: "website",
    images: [
      {
        url: "https://hexcolormeans.com/advanced-screen-color-picker-tool-online-free.webp",
        width: 1200,
        height: 630,
        alt: "Professional Screen Color Picker and OS-Native Pixel Sampler Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Screen Color Picker - Universal Pixel Sampler | HexColorMeans",
    description: "Extract exact color codes from any window or application. High-precision OS-native EyeDropper for designers and developers.",
    images: ["https://hexcolormeans.com/advanced-screen-color-picker-tool-online-free.webp"],
  },
}

export default function ScreenColorPickerPage() {
  const faqs = [
    {
      question: "Which browsers currently support the screen color picker?",
      answer:
        "The EyeDropper API is currently supported in Chromium-based browsers, specifically Chrome (version 95+), Edge (version 95+), and Opera. For users on Safari or Firefox, our Image Color Picker remains the best alternative for extracting colors from browser-based assets.",
    },
    {
      question: "Can I pick colors from applications other than the browser?",
      answer:
        "Yes. One of the primary advantages of this tool is its ability to sample pixels from your entire operating system. You can pick colors from Photoshop, Figma, Slack, or even your desktop wallpaper as long as they are visible on your screen.",
    },
    {
      question: "Does the tool work on mobile devices and tablets?",
      answer:
        "The EyeDropper API is currently a desktop-only feature. Mobile browsers typically lack the OS-level hooks required for a universal screen picker. We recommend using our Image Color Picker for mobile color extraction tasks.",
    },
    {
      question: "Is it safe to give my browser permission to pick colors?",
      answer:
        "Yes. The API is designed with strict security protocols. The browser requires an explicit user action (like clicking the button) before the native picker is launched. The tool only receives the specific pixel color you choose and does not have continuous access to your screen content.",
    },
    {
      question: "Will it capture colors from a Retina or high-DPI display accurately?",
      answer:
        "Absolutely. The EyeDropper API samples the exact sRGB value as rendered by the operating system. It automatically accounts for hardware scaling to ensure that the HEX code you receive is a 1:1 match of what you see on your display.",
    },
  ]

  const features = [
    {
      title: "OS-Native Precision",
      description: "Sample pixels from any application, window, or desktop element on your system with single-pixel accuracy.",
      icon: Pipette
    },
    {
      title: "Instant Format Mapping",
      description: "Automatically convert picked pixels into HEX, RGB, HSL, and CMYK formats for immediate use in your design system.",
      icon: Zap
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-left font-sans">
      <WebPageSchema
        name="Screen Color Picker"
        url="https://hexcolormeans.com/screen-color-picker"
        description="Professional OS-native screen color picker to extract exact HEX, RGB, and HSL codes from any desktop pixel."
      />
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://hexcolormeans.com" },
        { name: "Screen Color Picker", item: "https://hexcolormeans.com/screen-color-picker" }
      ]} />
      <Header />

      <section className="bg-muted/30 py-12 px-4 border-b">
        <div className="container mx-auto">
          <div className="mb-6">
            <BreadcrumbNav items={[{ label: "Screen Color Picker", href: "/screen-color-picker" }]} />
          </div>
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight">
              Screen Color Picker
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium text-pretty text-center">
              Screen Color Picker lets you sample pixels anywhere on your screen, using high-precision OS-native technology to capture accurate hex codes beyond browser boundaries.
            </p>
          </div>
        </div>
      </section>

      <main className="w-full max-w-[1350px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <article id="content" className="main-content grow-content flex-1 space-y-16">
            <ToolApplicationSchema
              name="Screen Color Picker"
              slug="screen-color-picker"
              description="A professional-grade universal screen color sampler for desktop-wide pixel extraction."
            />

            {/* Tool Area */}
            <section className="space-y-8">
              <ScreenColorPickerClient />
            </section>

            {/* How to Sample Your Screen section */}
            <section className="border-2 border-border/60 rounded-3xl p-8 sm:p-12 space-y-12 bg-white">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                  <h2 className="text-4xl font-bold m-0">How to Sample Your Screen</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-8 items-stretch">
                  <div className="space-y-6">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Capturing colors from your desktop is simple and powerful. Follow these steps to extract values from any open application:
                    </p>
                    <ul className="space-y-4">
                      {[
                        "Ensure you are using a supported browser (Chrome, Edge, or Opera).",
                        "Click the 'Pick Color from Screen' button to activate the native EyeDropper.",
                        "Hover over any element on your entire display—inside or outside the browser.",
                        "Click the specific pixel you want to capture; the picker will close automatically.",
                        "Copy the generated HEX or RGB code from the results box to your clipboard."
                      ].map((step, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">{i + 1}</span>
                          <span className="text-lg text-muted-foreground pt-1 font-medium">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Card className="overflow-hidden border-2 border-border shadow-2xl relative min-h-[400px] flex items-center justify-center bg-white p-6 sm:p-10">
                    <img
                      src="/advanced-screen-color-picker-tool-online-free.webp"
                      alt="Professional user interface of the online screen color picker tool"
                      className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
                    />
                  </Card>
                </div>
              </div>
            </section>

            {/* Why Use a Native Screen Picker? section */}
            <section className="border-2 border-border/60 rounded-3xl p-8 sm:p-12 space-y-10 text-left bg-white">
              <div className="flex items-center gap-3">
                <Info className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold m-0">Why Use a Native Screen Picker?</h2>
              </div>
              <div className="max-w-none space-y-12">
                <p className="text-lg text-muted-foreground leading-relaxed font-normal">
                  Development often involves translating visual designs into functional code. Traditional web-based pickers are restricted to the browser tab, forcing you to take screenshots or guess colors from external applications. A native OS-level screen picker eliminates this friction, allowing you to sample pixels directly from Figma, Photoshop, or a video player. This ensures 100% brand consistency throughout your build.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed font-normal">
                  By sampling colors as they are presented by the hardware, you bypass any potential color profile shifts that can happen during image processing. This is the professional standard for UI auditing—giving you a 1:1 match of the hex color currently displayed on your screen. Precision extraction leads to cleaner code and superior design fidelity.
                </p>
              </div>
            </section>

            {/* Professional Sampling Section with border */}
            <section className="border-2 border-border/60 rounded-3xl p-8 sm:p-12 space-y-12 bg-white">
              <div className="flex items-center gap-3">
                <Layers className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold m-0">Professional Desktop Sampling</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                {features.map((feature, i) => (
                  <Card key={i} className="p-8 space-y-4 border-2 border-border/50 hover:border-primary/30 transition-all shadow-md hover:shadow-xl rounded-2xl bg-white">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
                  </Card>
                ))}
                <div className="sm:col-span-2">
                  <p className="text-lg text-muted-foreground italic border-l-4 border-primary/20 pl-6 py-2">
                    Design Tip: Use this tool to verify contrast ratios on native desktop applications or to harvest inspiration from complex UI designs across different operating systems.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQs Area Section with border */}
            <section id="faqs" className="border-2 border-border/60 rounded-3xl p-8 sm:p-12 space-y-12 bg-white">
              <div className="flex items-center gap-4">
                <HelpCircle className="w-10 h-10 text-primary" />
                <h2 className="text-4xl font-bold m-0 text-left">FAQs About Screen Picking</h2>
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

      <ExploreColorTools current="screen-color-picker" />
      <Footer />
    </div>
  )
}
