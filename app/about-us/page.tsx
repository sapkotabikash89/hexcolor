import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema } from "@/components/structured-data"
import { ShareButtons } from "@/components/share-buttons"

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About Us - HexColorMeans",
  description: "Learn about HexColorMeans, a place created to understand color beyond appearance, exploring meaning, psychology, and precision.",
}

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "HexColorMeans", item: "https://hexcolormeans.com" },
        { name: "About Us", item: "https://hexcolormeans.com/about-us" }
      ]} />
      <Header />
      <main className="w-full max-w-[1350px] mx-auto px-4 py-12 flex-1">
        <BreadcrumbNav items={[{ label: "About Us", href: "/about-us" }]} />
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <article id="content" className="main-content grow-content flex-1 space-y-4">
            <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">About Us</h1>

            <div className="prose dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
              <section className="space-y-4">
                <p>
                  Welcome to <strong>HexColorMeans</strong>, a place created for people who want to understand color beyond appearance. We explore color meaning, symbolism, psychology, spirituality, and precise color values in one unified space. Our purpose is clear. We help you see how colors influence emotions, shape perception, reflect culture, and guide visual decisions in both digital and real-world settings.
                </p>
                <p>
                  Color communicates faster than language. It sets mood, builds trust, signals identity, and quietly shapes reactions. At HexColorMeans, we study color from two connected angles. One is emotional and symbolic. The other is technical and data-driven. When these perspectives meet, color stops feeling random and starts telling a story you can actually use.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
                <p>
                  Our mission is to build a dependable reference platform where meaning and accuracy exist side by side. We want HexColorMeans to serve designers, developers, students, spiritual thinkers, and curious readers who want clarity instead of scattered information. Every piece of content is written to explain not only what a color is, but why it matters and how it functions across different contexts.
                </p>
                <p>
                  We believe color education should feel intuitive. That belief guides how we explain symbolism, emotional impact, cultural associations, and technical formats such as HEX, RGB, CMYK, and HSL. Each topic is presented with intention, so learning feels natural rather than overwhelming.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Our Perspective on Color</h2>
                <p>
                  Many websites focus on color purely from a design standpoint. We go deeper by connecting human experience with structured color systems. At HexColorMeans, emotional responses sit alongside numerical values, while cultural symbolism exists next to modern digital standards. This approach allows you to understand color as both a feeling and a framework.
                </p>
                <p>
                  Because of this balance, our content stays approachable while still offering depth. Pages are designed to be easy to read, informative without distraction, and practical for real use. Whether you are choosing a palette, studying symbolism, or checking a hex value, the information stays relevant and grounded.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">How We Create Content</h2>
                <p>
                  Every article on HexColorMeans follows a defined editorial process. Symbolic and cultural meanings are shaped by traditional interpretations and supported by modern references. Psychological insights reflect commonly observed emotional patterns associated with color. Technical color data is generated using standard digital models and verified formulas to maintain consistency.
                </p>
                <p>
                  Automation may support early drafting in some cases. However, every page is reviewed, edited, and refined by a human before publication. This step ensures accuracy, readability, and alignment with our editorial standards.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Editorial Integrity</h2>
                <p>
                  All content is published under the HexColorMeans Editorial Team rather than individual author names. This team-based approach helps maintain consistent quality, tone, and accuracy across the site. It also creates long-term responsibility for every page we publish.
                </p>
                <p>
                  When content is reviewed internally, it reflects a shared standard rather than a single viewpoint. This structure allows the platform to grow while keeping trust intact.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
                <p>
                  We see HexColorMeans evolving into a long-term knowledge hub for color education. Our vision includes expanding shade meaning libraries, building practical tools for creators, improving accessibility-focused color guidance, and developing deeper cultural and spiritual research resources. Growth matters, but usefulness matters more.
                </p>
                <p>
                  Our focus stays on lasting relevance. We want the site to remain helpful years from now, not tied to short-lived trends.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Transparency and Trust</h2>
                <p>
                  Trust is central to everything we publish. We commit to clear editorial practices, honest communication about automation use, regular content reviews, and independent research. When errors appear, we correct them quickly and openly.
                </p>
              </section>

              <section className="space-y-6 pt-6 border-t">
                <h2 className="text-2xl font-bold text-foreground">Get in Touch</h2>
                <p>
                  We value thoughtful feedback and collaboration.
                </p>
                <div className="bg-muted p-6 rounded-xl border border-border space-y-2">
                  <p><strong>Email:</strong> <a href="mailto:info@hexcolormeans.com" className="text-primary hover:underline transition-colors">info@hexcolormeans.com</a></p>
                  <p><strong>Website:</strong> <a href="https://hexcolormeans.com" className="text-primary hover:underline transition-colors">https://hexcolormeans.com</a></p>
                </div>
                <p className="mt-4">
                  If you have suggestions, notice an issue, or want to collaborate, you are always welcome to reach out.
                </p>
                <p className="font-bold text-lg text-foreground italic">
                  HexColorMeans exists to help you see color with clarity, purpose, and meaning.
                </p>
              </section>
            </div>

            <div className="flex justify-center py-4 mt-8 border-t pt-8">
              <ShareButtons title="About HexColorMeans" />
            </div>
          </article>
          <ColorSidebar color="#E0115F" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
