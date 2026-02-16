import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema } from "@/components/structured-data"
import { ShareButtons } from "@/components/share-buttons"

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Contact Us - HexColorMeans",
  description: "Get in touch with the HexColorMeans team for questions, feedback, or collaborations regarding color meanings and data.",
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "HexColorMeans", item: "https://hexcolormeans.com" },
        { name: "Contact", item: "https://hexcolormeans.com/contact" }
      ]} />
      <Header />
      <main className="w-full max-w-[1300px] mx-auto px-4 py-12 flex-1">
        <BreadcrumbNav items={[{ label: "Contact", href: "/contact" }]} />
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <article id="content" className="main-content grow-content flex-1 space-y-4">
            <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Contact Us</h1>

            <div className="prose dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
              <section className="space-y-4">
                <p>
                  At <strong>HexColorMeans</strong>, communication matters. We enjoy hearing from designers, developers, researchers, and curious readers who spend time exploring color meanings on our site. Whether you have a question about a specific hex color, noticed something that needs correction, or want to share an idea, your message is always welcome.
                </p>
                <p>
                  Feedback plays a key role in how this platform grows. Every suggestion, correction, or thoughtful note helps us improve accuracy, expand clarity, and refine the experience for everyone who relies on HexColorMeans.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">How to Reach Us</h2>
                <p>
                  The easiest way to get in touch is by email at <a href="mailto:info@hexcolormeans.com" className="text-primary hover:underline transition-colors">info@hexcolormeans.com</a>. You can also visit us anytime at <a href="https://hexcolormeans.com" className="text-primary hover:underline transition-colors">https://hexcolormeans.com</a> to explore our content or reference a specific page when contacting us.
                </p>
                <p>
                  When writing, adding context helps a lot. Mentioning the page link you are referring to, explaining your concern clearly, and including any supporting details allows us to understand your message faster and respond more effectively.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Reasons People Contact Us</h2>
                <p>
                  Many readers reach out for content related reasons, such as pointing out factual updates, clarifying color symbolism, or discussing how a hex code meaning is interpreted. Others contact us about technical issues on the site, ideas for new features, or accessibility related concerns. We also handle copyright questions and legal requests with care and professionalism.
                </p>
                <p>
                  No matter the topic, every message is reviewed thoughtfully and treated with respect.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Editorial Transparency</h2>
                <p>
                  If you are curious about how our color meanings are researched, reviewed, or updated over time, we are happy to explain. Transparency and accuracy guide our editorial process, and open conversations help us maintain trust with our audience.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Business and Collaboration</h2>
                <p>
                  HexColorMeans also works with educators, brands, and technical partners on meaningful collaborations. If you have an idea for educational content, a partnership proposal, or a technical integration, feel free to reach out with clear details. Well explained proposals help us connect you with the right people faster.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Response Time</h2>
                <p>
                  We aim to respond to most inquiries within 24 to 72 business hours. During periods of higher volume, replies may take slightly longer, but rest assured that every message is read.
                </p>
              </section>

              <section className="pt-6 border-t font-medium italic text-center sm:text-left">
                <p>
                  Thank you for taking the time to contact HexColorMeans. Your voice helps shape this platform, and we genuinely appreciate your interest and support.
                </p>
              </section>
            </div>

            <div className="flex justify-center py-4 mt-8 border-t pt-8">
              <ShareButtons title="Contact HexColorMeans" />
            </div>
          </article>
          <ColorSidebar color="#E0115F" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
