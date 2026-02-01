import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema, WebPageSchema } from "@/components/structured-data"
import { ShareButtons } from "@/components/share-buttons"

export const metadata: Metadata = {
  title: "Privacy Policy - HexColorMeans",
  description: "Learn how HexColorMeans collects, protects, and uses your data. Our privacy practices are designed with care and transparency.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema
        name="Privacy Policy"
        url="https://hexcolormeans.com/privacy-policy"
        description="Privacy practices of HexColorMeans. Learn how we collect, use, and protect your information."
      />
      <BreadcrumbSchema items={[
        { name: "HexColorMeans", item: "https://hexcolormeans.com" },
        { name: "Privacy Policy", item: "https://hexcolormeans.com/privacy-policy" }
      ]} />
      <Header />
      <main className="w-full max-w-[1280px] mx-auto px-4 py-12 flex-1">
        <BreadcrumbNav items={[{ label: "Privacy Policy", href: "/privacy-policy" }]} />
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <article id="content" className="main-content grow-content flex-1 space-y-4">
            <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Privacy Policy</h1>

            <div className="prose dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
              <section className="space-y-4">
                <p>
                  At <strong>HexColorMeans</strong>, accessible from <a href="https://hexcolormeans.com" className="text-primary hover:underline transition-colors">https://hexcolormeans.com</a>, your privacy is treated with care and respect. This Privacy Policy explains how information is collected, how it is used, and how it is protected when you visit or interact with our website. Transparency matters to us, and this page is designed to clearly outline our data practices in plain language.
                </p>
                <p>
                  By using HexColorMeans, you agree to the collection and use of information as described in this policy.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Information We Collect</h2>
                <p>
                  Most visitors can browse HexColorMeans without providing any personal details. However, when you choose to contact us, send feedback, or interact with specific tools or features, you may voluntarily share limited personal information. This typically includes your name, your email address, and any message you decide to submit. We intentionally avoid collecting sensitive personal data such as financial information, government identification numbers, or health-related details.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">How Your Information Is Used</h2>
                <p>
                  The information you provide helps us operate and improve HexColorMeans. We use it to respond to messages, answer questions, and provide support when requested. It also allows us to understand how visitors use the site, which helps improve performance, layout, and overall experience. Additionally, collected data supports security monitoring, helps prevent misuse, and allows us to identify and resolve technical issues. We do not sell, rent, or trade personal information under any circumstances.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Log Files and Usage Data</h2>
                <p>
                  Like many websites, HexColorMeans uses log files as part of standard analytics practices. These files may record details such as IP addresses, browser types, internet service providers, timestamps, referring pages, exit pages, and click activity. This information is used to analyze trends, manage the website, and understand user behavior at an aggregate level. It is not linked to personally identifiable information.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Cookies and Browser Technologies</h2>
                <p>
                  HexColorMeans may use cookies to store visitor preferences and improve how content is displayed. Cookies help the website recognize returning visitors and tailor the experience based on browser type or interaction patterns. You are free to disable cookies through your browser settings. Instructions for managing cookies can be found on your browser’s official support pages.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Advertising and Third Party Services</h2>
                <p>
                  Some content on HexColorMeans may include advertisements provided by third party partners. These partners may use technologies such as cookies, JavaScript, or web beacons to measure advertising effectiveness and display relevant ads. HexColorMeans does not control these cookies and does not have access to data collected by third party advertisers.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">External Privacy Policies</h2>
                <p>
                  This Privacy Policy applies only to HexColorMeans and does not extend to external websites or services linked from our pages. We encourage you to review the privacy policies of third party sites to understand how they collect, use, and manage information.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Your Data Protection Rights</h2>
                <p>
                  You have rights over your personal information. Depending on applicable laws, you may request access to your data, ask for corrections, request deletion, or object to certain forms of processing. If you wish to exercise any of these rights, you can contact us using the information provided below. Requests are handled within a reasonable timeframe.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Children’s Information</h2>
                <p>
                  HexColorMeans does not knowingly collect personal information from children under the age of 13. If a parent or guardian believes that a child has provided personal information on our website, we encourage immediate contact. We will promptly remove such data from our records.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Use of Automated Systems</h2>
                <p>
                  Certain processes related to data organization or content generation may involve automated systems. However, all published content is reviewed to ensure accuracy, clarity, and consistency before it appears on the site.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Consent</h2>
                <p>
                  By continuing to use HexColorMeans, you confirm that you have read this Privacy Policy and agree to its terms.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Policy Updates</h2>
                <p>
                  This Privacy Policy may be updated from time to time to reflect changes in website features, legal requirements, or operational practices. Any updates will be posted on this page with a revised effective date. Reviewing this page periodically helps you stay informed about how your information is protected.
                </p>
              </section>

              <section className="pt-6 border-t space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
                <p>
                  If you have questions or concerns about this Privacy Policy or how your data is handled, you may contact us at <a href="mailto:info@hexcolormeans.com" className="text-primary hover:underline transition-colors">info@hexcolormeans.com</a> or visit <a href="https://hexcolormeans.com" className="text-primary hover:underline transition-colors">https://hexcolormeans.com</a>.
                </p>
                <p className="font-bold text-lg text-foreground italic">
                  Your trust matters. HexColorMeans is committed to protecting your privacy and safeguarding your information.
                </p>
              </section>
            </div>

            <div className="flex justify-center py-4 mt-8 border-t pt-8">
              <ShareButtons title="HexColorMeans Privacy Policy" />
            </div>
          </article>
          <ColorSidebar color="#E0115F" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
