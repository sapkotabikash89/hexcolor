import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema, WebPageSchema } from "@/components/structured-data"
import { ShareButtons } from "@/components/share-buttons"

export const metadata: Metadata = {
  title: "Disclaimer - HexColorMeans",
  description: "Disclaimer for HexColorMeans. Information provided is for general educational purposes only.",
}

export default function DisclaimerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema
        name="Disclaimer"
        url="https://hexcolormeans.com/disclaimer"
        description="Disclaimer for HexColorMeans. Information provided is for general educational purposes only."
      />
      <BreadcrumbSchema items={[
        { name: "HexColorMeans", item: "https://hexcolormeans.com" },
        { name: "Disclaimer", item: "https://hexcolormeans.com/disclaimer" }
      ]} />
      <Header />
      <main className="w-full max-w-[1300px] mx-auto px-4 py-12 flex-1">
        <BreadcrumbNav items={[{ label: "Disclaimer", href: "/disclaimer" }]} />
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <article id="content" className="main-content grow-content flex-1 space-y-4">
            <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Disclaimer</h1>

            <div className="prose dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
              <section className="space-y-4">
                <p>
                  The information provided by <strong>HexColorMeans</strong> (<a href="https://hexcolormeans.com" className="text-primary hover:underline transition-colors">https://hexcolormeans.com</a>) is intended for general informational and educational purposes only. All content on this website is created with care to help users understand color meanings, symbolism, psychology, spirituality, and technical color specifications. By using this website, you agree to the terms of this Disclaimer in full.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">No Professional Advice</h2>
                <p>
                  The content on HexColorMeans does not constitute professional advice of any kind. This includes psychological guidance, medical recommendations, spiritual or religious direction, and legal or financial counsel. Interpretations of color, symbolism, and emotional responses can vary widely depending on culture, personal beliefs, experiences, and context. For any situation that requires professional expertise, it is always best to consult a qualified professional rather than relying solely on the information presented here.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Accuracy of Information</h2>
                <p>
                  While we strive to provide accurate and up-to-date information, HexColorMeans makes no guarantees regarding the completeness, reliability, or accuracy of the content. Symbolic and spiritual interpretations are based on traditional references, research, and general understanding, and may not reflect every perspective. Technical color values such as HEX, RGB, CMYK, and HSL are generated using standard digital formulas and may display slight variations across devices or software. Any action taken based on information from this website is done at your own risk.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Use of Tools and Generators</h2>
                <p>
                  HexColorMeans offers interactive tools such as color pickers, palette generators, shade and harmony tools, and accessibility checkers. These tools are provided "as is" without warranties. We do not guarantee that the generated values will always be error-free, that the results will suit specific design or commercial purposes, or that the tools will always be available without interruption. HexColorMeans is not responsible for outcomes, design decisions, or usability issues that arise from the use of these tools.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">External Links Disclaimer</h2>
                <p>
                  HexColorMeans may include links to external websites that are not created or maintained by us. While we aim to connect users with reliable and ethical sources, we do not control the content, policies, or practices of third-party websites. HexColorMeans cannot guarantee the accuracy of information on external sites and is not responsible for any loss, damage, or inconvenience caused by visiting them. Users should always review the Privacy Policies and Terms of any website they visit through our links.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Advertising and Affiliate Disclosure</h2>
                <p>
                  HexColorMeans may display advertisements and promotional content from third-party networks to support the operation of the website. These ads are not directly endorsed by HexColorMeans, and any interaction, purchase, or engagement with advertised products or services is solely between you and the advertiser.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Limitation of Liability</h2>
                <p>
                  HexColorMeans, its owners, and its staff are not liable for any direct, indirect, or incidental losses or damages arising from the use of this website. This includes errors, omissions, technical issues, or site downtime, as well as decisions made based on symbolic, spiritual, or emotional interpretations of color. Your use of this website is entirely voluntary and at your own risk.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Consent</h2>
                <p>
                  By accessing and using HexColorMeans, you consent to this Disclaimer and agree to its terms.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Updates to This Disclaimer</h2>
                <p>
                  HexColorMeans may revise this Disclaimer at any time without prior notice. Any updates will be posted on this page and take effect immediately. Users are encouraged to review this page periodically to stay informed about changes.
                </p>
              </section>

              <section className="pt-6 border-t space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
                <p>
                  If you have any questions about this Disclaimer, please contact us at <a href="mailto:info@hexcolormeans.com" className="text-primary hover:underline transition-colors">info@hexcolormeans.com</a> or visit <a href="https://hexcolormeans.com" className="text-primary hover:underline transition-colors">https://hexcolormeans.com</a>. HexColorMeans is intended for learning, exploration, and inspiration in color, and is not a substitute for professional guidance.
                </p>
              </section>
            </div>

            <div className="flex justify-center py-4 mt-8 border-t pt-8">
              <ShareButtons title="HexColorMeans Disclaimer" />
            </div>
          </article>
          <ColorSidebar color="#E0115F" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
