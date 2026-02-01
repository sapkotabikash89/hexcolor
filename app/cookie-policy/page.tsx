import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbSchema, WebPageSchema } from "@/components/structured-data"
import { ShareButtons } from "@/components/share-buttons"

export const metadata: Metadata = {
  title: "Cookie Policy - HexColorMeans",
  description: "Learn how HexColorMeans uses cookies to improve your browsing experience and understand website usage.",
}

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema
        name="Cookie Policy"
        url="https://hexcolormeans.com/cookie-policy"
        description="Learn how HexColorMeans uses cookies to improve your browsing experience and understand website usage."
      />
      <BreadcrumbSchema items={[
        { name: "HexColorMeans", item: "https://hexcolormeans.com" },
        { name: "Cookie Policy", item: "https://hexcolormeans.com/cookie-policy" }
      ]} />
      <Header />
      <main className="w-full max-w-[1280px] mx-auto px-4 py-12 flex-1">
        <BreadcrumbNav items={[{ label: "Cookie Policy", href: "/cookie-policy" }]} />
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <article id="content" className="main-content grow-content flex-1 space-y-4">
            <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Cookie Policy</h1>

            <div className="prose dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
              <section className="space-y-4">
                <p>
                  This Cookie Policy explains how <strong>HexColorMeans</strong> (<a href="https://hexcolormeans.com" className="text-primary hover:underline transition-colors">https://hexcolormeans.com</a>) uses cookies and similar technologies to improve your browsing experience, understand how the website is used, and ensure smooth and secure functionality. By visiting or interacting with our website, you consent to the practices described in this policy.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">What Are Cookies</h2>
                <p>
                  Cookies are small text files that are stored on your device when you visit a website. They help websites remember user preferences, provide personalized features, and track interactions to better understand user behavior. Cookies are completely safe, do not harm your device, and do not contain viruses or malware. They act as memory tools for the website, helping it respond more efficiently to your needs and actions.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">How We Use Cookies</h2>
                <p>
                  At HexColorMeans, cookies serve multiple purposes. They allow the website to function more smoothly by improving loading times and overall performance. Cookies help us analyze how visitors navigate the site, which pages are most popular, and how users interact with our tools and content. They also enable us to remember your preferences, such as selected themes or settings, ensuring a consistent experience whenever you return. Beyond functionality, cookies contribute to site security by detecting unusual activity and protecting against potential threats.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Types of Cookies We Use</h2>
                <p>
                  We categorize cookies according to their role in enhancing your experience. Essential cookies are necessary for the basic operation of the website. They support core functionality such as page navigation, secure access, and tool usage. Without these cookies, parts of HexColorMeans may not work as intended. Performance and analytics cookies collect data about how visitors use the site. This information helps us refine content placement, design, and the overall usability of the website. Functionality cookies remember your preferences, like language choices or interface settings, so that you do not need to reset them every visit. Advertising and marketing cookies allow us and our partners to deliver content that is more relevant to you. These cookies can help provide tailored ads based on browsing activity across different websites.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Third-Party Cookies</h2>
                <p>
                  HexColorMeans may also use cookies from trusted third-party providers. These providers include analytics platforms, advertising networks, and embedded tools or widgets. We do not control how these third-party cookies are used, and each provider maintains its own Cookie Policy and Privacy Policy. Google services, such as Google Analytics and Google AdSense, may also place cookies to collect information on website usage and deliver personalized ads. Users can manage ad personalization or opt-out entirely through Google Ad Settings.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Managing Cookies</h2>
                <p>
                  You have full control over cookies through your browser settings. You can delete cookies that are already on your device, block cookies entirely, or choose to allow cookies only from selected websites. However, disabling certain cookies may impact functionality or prevent access to specific tools on HexColorMeans. For guidance on managing cookies, consult the help section of your browser for step-by-step instructions.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Consent</h2>
                <p>
                  By using HexColorMeans, you are agreeing to the use of cookies as described in this policy. If you do not agree, you should adjust your browser settings accordingly or refrain from using the website until you are comfortable with the cookie practices.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Updates to This Cookie Policy</h2>
                <p>
                  This Cookie Policy may be updated periodically to reflect changes in website features, technology, or legal requirements. Any updates will be posted on this page immediately, and we encourage visitors to review the policy regularly to stay informed about our practices.
                </p>
              </section>

              <section className="pt-6 border-t space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
                <p>
                  If you have questions regarding this Cookie Policy or how we use cookies, you can contact us at:
                </p>
                <div className="bg-muted p-6 rounded-xl border border-border space-y-2">
                  <p><strong>Email:</strong> <a href="mailto:info@hexcolormeans.com" className="text-primary hover:underline transition-colors">info@hexcolormeans.com</a></p>
                  <p><strong>Website:</strong> <a href="https://hexcolormeans.com" className="text-primary hover:underline transition-colors">https://hexcolormeans.com</a></p>
                </div>
                <p className="font-bold text-lg text-foreground italic mt-4">
                  HexColorMeans uses cookies responsibly to provide a faster, safer, and more personalized browsing experience for every visitor.
                </p>
              </section>
            </div>

            <div className="flex justify-center py-4 mt-8 border-t pt-8">
              <ShareButtons title="HexColorMeans Cookie Policy" />
            </div>
          </article>
          <ColorSidebar color="#E0115F" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
