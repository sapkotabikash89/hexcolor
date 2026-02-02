import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema, WebPageSchema } from "@/components/structured-data"
import { ShareButtons } from "@/components/share-buttons"

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Terms and Conditions - HexColorMeans",
  description: "Terms and conditions for using HexColorMeans. Outlines the rules and responsibilities for using our website.",
}

export default function TermsAndConditionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema
        name="Terms and Conditions"
        url="https://hexcolormeans.com/terms-and-conditions"
        description="Terms and conditions for using HexColorMeans. Outlines the rules and responsibilities for using our website."
      />
      <BreadcrumbSchema items={[
        { name: "HexColorMeans", item: "https://hexcolormeans.com" },
        { name: "Terms and Conditions", item: "https://hexcolormeans.com/terms-and-conditions" }
      ]} />
      <Header />
      <main className="w-full max-w-[1300px] mx-auto px-4 py-12 flex-1">
        <BreadcrumbNav items={[{ label: "Terms and Conditions", href: "/terms-and-conditions" }]} />
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <article id="content" className="main-content grow-content flex-1 space-y-4">
            <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Terms and Conditions</h1>

            <div className="prose dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
              <section className="space-y-4">
                <p>
                  Welcome to <strong>HexColorMeans</strong>. These Terms and Conditions outline the rules and responsibilities for using our website, located at <a href="https://hexcolormeans.com" className="text-primary hover:underline transition-colors">https://hexcolormeans.com</a>. By accessing or using HexColorMeans, you accept these terms in full. If you disagree with any part of these terms, please refrain from using the website.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Use of the Website</h2>
                <p>
                  When you use HexColorMeans, you agree to engage with the website in a lawful and respectful manner. You must not attempt to disrupt or impair the website’s functionality, nor seek unauthorized access to any part of it. The website is intended for informational and creative use, and any misuse of its content, tools, or data for harmful, fraudulent, or commercial purposes is strictly prohibited. All users are expected to comply with applicable laws and regulations, both locally and internationally.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Intellectual Property</h2>
                <p>
                  All content on HexColorMeans, including written articles, guides, color codes, interactive tools, and website design, is the intellectual property of HexColorMeans or its contributors unless explicitly stated otherwise. You are welcome to read, view, and reference our content for personal or educational purposes, and you may share links with proper attribution. Reproducing, republishing, or using our content for commercial purposes without prior written permission is prohibited, as is copying large portions of the website or our tools.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Educational and Informational Purpose</h2>
                <p>
                  HexColorMeans provides content primarily for educational and informational purposes. While we strive for accuracy in our color data and creative guidance, interpretations of color symbolism, psychology, and meaning can vary widely depending on culture, context, and personal perspective. Color codes are presented using standard digital models, though slight variations may occur across devices. We do not guarantee that every piece of information will be accurate in all contexts, and the website should not replace professional advice in specialized areas.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">User Contributions</h2>
                <p>
                  If you submit feedback, suggestions, or other contributions to HexColorMeans, you grant us permission to use your submissions to improve the website or enhance content. You represent that your submissions do not violate any third party rights and agree not to provide false, harmful, or misleading information. We reserve the right to remove, modify, or ignore any submissions that are deemed inappropriate or irrelevant without prior notice.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Tools and Interactive Features</h2>
                <p>
                  HexColorMeans offers a range of tools such as color generators, palette creators, and accessibility checkers to assist users in creative projects. These tools are provided “as is” and may not always guarantee accurate results, uninterrupted access, or complete compatibility across devices. HexColorMeans is not responsible for errors in generated outputs or decisions made based on tool usage, including creative, branding, or business outcomes.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">External Links</h2>
                <p>
                  The website may include links to third party websites for additional information or resources. HexColorMeans does not control these external sites and is not responsible for their content, policies, or actions. Users are encouraged to review the terms, privacy policies, and practices of any third party site they access through HexColorMeans before interacting with it.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Limitation of Liability</h2>
                <p>
                  HexColorMeans and its team shall not be held liable for any direct, indirect, or incidental losses resulting from the use of the website. This includes, but is not limited to, data loss, business interruptions, design or creative outcomes based on our content, and misinterpretation of symbolic or cultural meanings. Users access and use the website entirely at their own risk.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Termination of Access</h2>
                <p>
                  HexColorMeans reserves the right to restrict or terminate access for any user who violates these Terms and Conditions. Harmful or abusive behavior, attempts to bypass website security, or misuse of content may result in immediate removal or blocking of access without prior notice.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Changes to Terms</h2>
                <p>
                  We may update these Terms and Conditions at any time, with changes becoming effective immediately upon posting. Continued use of HexColorMeans constitutes acceptance of the updated terms. We recommend reviewing this page periodically to stay informed of any modifications.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Governing Law</h2>
                <p>
                  These Terms are governed by applicable international digital standards and relevant jurisdictional laws. Any disputes arising from the use of HexColorMeans will be resolved under the applicable legal framework.
                </p>
              </section>

              <section className="pt-6 border-t space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
                <p>
                  If you have any questions or concerns about these Terms and Conditions, you may reach us at:
                </p>
                <div className="bg-muted p-6 rounded-xl border border-border space-y-2">
                  <p><strong>Email:</strong> <a href="mailto:info@hexcolormeans.com" className="text-primary hover:underline transition-colors">info@hexcolormeans.com</a></p>
                  <p><strong>Website:</strong> <a href="https://hexcolormeans.com" className="text-primary hover:underline transition-colors">https://hexcolormeans.com</a></p>
                </div>
                <p className="font-bold text-lg text-foreground italic mt-4">
                  By continuing to use HexColorMeans, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
                </p>
              </section>
            </div>

            <div className="flex justify-center py-4 mt-8 border-t pt-8">
              <ShareButtons title="HexColorMeans Terms and Conditions" />
            </div>
          </article>
          <ColorSidebar color="#E0115F" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
