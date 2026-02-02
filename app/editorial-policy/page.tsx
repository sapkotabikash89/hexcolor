import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema, WebPageSchema } from "@/components/structured-data"
import { ShareButtons } from "@/components/share-buttons"

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Editorial Policy - HexColorMeans",
  description: "Learn about HexColorMeans' editorial standards, research practices, and commitment to accurate color information.",
}

export default function EditorialPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema
        name="Editorial Policy"
        url="https://hexcolormeans.com/editorial-policy"
        description="Learn about HexColorMeans' editorial standards, research practices, and commitment to accurate color information."
      />
      <BreadcrumbSchema items={[
        { name: "HexColorMeans", item: "https://hexcolormeans.com" },
        { name: "Editorial Policy", item: "https://hexcolormeans.com/editorial-policy" }
      ]} />
      <Header />
      <main className="w-full max-w-[1300px] mx-auto px-4 py-12 flex-1">
        <BreadcrumbNav items={[{ label: "Editorial Policy", href: "/editorial-policy" }]} />
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <article id="content" className="main-content grow-content flex-1 space-y-4">
            <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Editorial Policy</h1>

            <div className="prose dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
              <section className="space-y-4">
                <p>
                  At <strong>HexColorMeans</strong>, our mission is to provide accurate, insightful, and well-researched information about colors, covering their meanings, psychological effects, cultural significance, spiritual relevance, and technical properties. Every article on this site is created with a focus on clarity, reliability, and educational value, ensuring that readers can trust the information presented.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Purpose of Our Content</h2>
                <p>
                  HexColorMeans exists to help readers understand colors in depth, from their symbolic and emotional impact to their cultural, historical, and spiritual significance. We also provide detailed technical information, including HEX, RGB, CMYK, HSL values, color harmonies, and accessibility considerations. All content is intended for educational and informational purposes, offering insights rather than prescriptive advice or professional guidance.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Research and Source Standards</h2>
                <p>
                  All content on HexColorMeans is grounded in established research and reputable sources. We draw upon color theory principles, studies in perception and psychology, cultural documentation, spiritual and traditional references, and standard digital color models. Our goal is to present a balanced perspective, honoring both traditional interpretations and contemporary applications, so readers can understand colors from multiple angles.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Editorial Review Workflow</h2>
                <p>
                  Every article goes through a thorough editorial process to ensure quality. This includes reviewing language for clarity and readability, verifying facts for symbolism, psychology, and cultural claims, and validating technical color information. We also check for consistency across related topics and ensure content is accessible and user-friendly on all devices. Only after passing these internal standards is content published on HexColorMeans.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Technical Accuracy</h2>
                <p>
                  Technical color information is a cornerstone of HexColorMeans. HEX codes, RGB, CMYK, HSL values, shades, tints, tones, harmonies, and contrast ratios are generated using industry-standard formulas and verified for accuracy. Our team continually tests and updates these values to maintain reliability, so readers can depend on the data for creative, educational, or professional purposes.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Use of Automation and AI</h2>
                <p>
                  To manage content efficiently, some drafts may be generated using AI or automated tools. However, every AI-assisted page is carefully reviewed and edited by our editorial team before publication. Automation is used only as a productivity aid, never as a replacement for human judgment, ensuring that all content meets our standards of accuracy and clarity.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Editorial Independence</h2>
                <p>
                  HexColorMeans operates with complete editorial autonomy. We do not accept sponsored interpretations of symbolism, paid claims about psychological effects, or external influence over cultural or spiritual content. Every article is designed for educational understanding, providing insights rather than promoting products, services, or specific viewpoints.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Content Updates and Corrections</h2>
                <p>
                  We regularly review older articles to maintain relevance and accuracy. If errors are discovered, technical values are revalidated and interpretations refined as necessary. Updates are applied promptly, and we encourage readers to report inaccuracies through our Contact page, fostering a collaborative approach to maintaining reliable content.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">No Professional Advice</h2>
                <p>
                  While we explore the psychological and emotional effects of colors, HexColorMeans content does not constitute medical, therapeutic, legal, or professional advice. Readers should consult qualified professionals for clinical or legal concerns. Our goal is to provide educational insight, not guidance for personal or professional decisions.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Authorship and Accountability</h2>
                <p>
                  HexColorMeans follows a team-based editorial model. All content is thoroughly researched, reviewed, and curated by the editorial team to ensure accuracy, consistency, and accountability across the website. This approach allows us to maintain long-term reliability and a uniform standard of quality for all readers.
                </p>
              </section>

              <section className="pt-6 border-t space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Transparency and User Trust</h2>
                <p>
                  Trust is central to HexColorMeans. We commit to clear editorial standards, transparent use of AI tools, regular content updates, and responsiveness to user feedback. By maintaining independence and prioritizing accuracy, HexColorMeans aims to be a trusted, comprehensive reference for color knowledge worldwide.
                </p>
              </section>
            </div>

            <div className="flex justify-center py-4 mt-8 border-t pt-8">
              <ShareButtons title="HexColorMeans Editorial Policy" />
            </div>
          </article>
          <ColorSidebar color="#E0115F" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
