import Script from "next/script"

interface BreadcrumbItem {
  name: string
  item: string
}

interface FAQItem {
  question: string
  answer: string
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }

  return <Script id="breadcrumb-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return <Script id="faq-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HexColorMeans",
    url: "https://hexcolormeans.com",
    description: "Know your color - Explore color information, meanings, conversions, and professional tools",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://hexcolormeans.com/colors/{search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  return <Script id="website-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HexColorMeans",
    url: "https://hexcolormeans.com",
    logo: "https://hexcolormeans.com/logo.webp",
    description: "Professional color tools and information for designers, developers, and artists",
    sameAs: [],
  }

  return <Script id="organization-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function SoftwareApplicationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "HexColorMeans",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "Free online color tools including color picker, contrast checker, and color harmonies generator",
  }

  return <Script id="software-app-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function ImageObjectSchema({
  url,
  width,
  height,
  alt,
  caption,
  description,
  author,
  representativeOfPage,
  name,
}: {
  url: string
  width: number
  height: number
  alt?: string
  caption?: string
  description?: string
  author?: string
  representativeOfPage?: boolean
  name?: string
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: name ?? caption ?? alt,
    url,
    contentUrl: url,
    encodingFormat: "image/webp",
    width,
    height,
    caption: caption ?? alt,
    description: description ?? undefined,
    author: author ?? undefined,
    representativeOfPage: representativeOfPage ?? undefined,
    inLanguage: "en-US",
  }
  return <Script id="imageobject-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}



export function WebPageSchema({
  name,
  url,
  description,
}: {
  name: string
  url: string
  description?: string
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    url,
    description: description ?? undefined,
  }
  return <Script id="webpage-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function HowToSchema({
  name,
  steps,
}: {
  name: string
  steps: string[]
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s,
      text: s,
    })),
  }
  return <Script id="howto-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function CollectionPageSchema({
  name,
  url,
}: {
  name: string
  url: string
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url,
  }
  return <Script id="collectionpage-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function ItemListSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  }
  return <Script id="itemlist-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function BlogPostingSchema({
  title,
  description,
  author,
  publisher,
  image,
  datePublished,
  dateModified,
  url,
}: {
  title: string
  description?: string
  author: string
  publisher: { name: string; url: string; logo?: string }
  image?: { url: string; width?: number; height?: number; alt?: string }
  datePublished?: string
  dateModified?: string
  url: string
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description ?? undefined,
    author: { "@type": "Person", name: author },
    publisher: {
      "@type": "Organization",
      name: publisher.name,
      url: publisher.url,
      logo: publisher.logo ?? undefined,
    },
    datePublished: datePublished ?? undefined,
    dateModified: dateModified ?? undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
  }
  if (image?.url) {
    schema.image = {
      "@type": "ImageObject",
      url: image.url,
      width: image.width ?? undefined,
      height: image.height ?? undefined,
    }
  }
  return <Script id="blogposting-schema" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}
export function ArticleSchema({
  title,
  description,
  authorName,
  authorType = "Organization",
  publisherName = "HexColorMeans",
  publisherLogo = "https://hexcolormeans.com/logo.webp",
  image,
  datePublished,
  dateModified,
  url,
  articleSection,
  colorName,
  colorHex,
}: {
  title: string
  description?: string
  authorName?: string
  authorType?: "Organization" | "Person"
  publisherName?: string
  publisherLogo?: string
  image?: string
  datePublished?: string
  dateModified?: string
  url: string
  articleSection?: string
  colorName?: string
  colorHex?: string
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description ?? undefined,
    publisher: {
      "@type": "Organization",
      name: publisherName,
      logo: {
        "@type": "ImageObject",
        url: publisherLogo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: "en",
  }

  if (authorName) {
    schema.author = {
      "@type": authorType,
      name: authorName,
    }
  }

  if (datePublished) {
    schema.datePublished = datePublished
  }

  if (dateModified) {
    schema.dateModified = dateModified
  }

  if (image) {
    schema.image = image
  }

  if (articleSection) {
    schema.articleSection = articleSection
  }

  if (colorName || colorHex) {
    schema.mainEntity = {
      "@type": "Thing",
      name: colorName || "Color",
      description: colorHex || undefined,
    }

    if (colorHex) {
      schema.mainEntity.additionalProperty = {
        "@type": "PropertyValue",
        name: "Hex Code",
        value: colorHex
      }
    }
  }

  const id = `article-schema-${url.split('/').filter(Boolean).pop() || 'index'}`

  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="beforeInteractive"
    >
      {JSON.stringify(schema)}
    </Script>
  )
}

export function ToolApplicationSchema({
  name,
  slug,
  description,
  applicationCategory = "DesignApplication",
}: {
  name: string
  slug: string
  description: string
  applicationCategory?: string
}) {
  const url = `https://hexcolormeans.com/${slug}`
  const image = `https://hexcolormeans.com/tools/${slug}-snapshot.webp`
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url,
    applicationCategory,
    operatingSystem: "Web",
    description,
    image,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  }
  return <Script id={`${slug}-webapp-schema`} type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(schema)}</Script>
}

export function UnifiedBlogSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image,
  authorName = "HexColorMeans",
  publisherName = "HexColorMeans",
  publisherLogo = "https://hexcolormeans.com/logo.webp",
  categories = [],
  breadcrumbs,
  colorName,
  colorHex,
  faqs,
  authorType = "Organization",
}: {
  title: string
  description?: string
  url: string
  datePublished?: string
  dateModified?: string
  image?: string
  authorName?: string
  authorType?: "Person" | "Organization"
  publisherName?: string
  publisherLogo?: string
  categories?: { name: string; slug: string }[]
  breadcrumbs: { label: string; href: string }[]
  colorName?: string
  colorHex?: string
  faqs?: FAQItem[]
}) {
  const siteUrl = "https://hexcolormeans.com"
  const organizationId = `${siteUrl}/#organization`
  const websiteId = `${siteUrl}/#website`
  const webpageId = `${url}#webpage`
  const articleId = `${url}#article`
  const primaryImageId = `${url}#primaryimage`
  const breadcrumbId = `${url}#breadcrumb`

  const graph: any[] = [
    {
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        ...breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 2,
          name: crumb.label,
          item: crumb.href.startsWith("http") ? crumb.href : `${siteUrl}${crumb.href}`,
        })),
      ],
    },
    {
      "@type": "Article",
      "@id": articleId,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      author: {
        "@type": authorType,
        name: authorName,
      },
      headline: title,
      datePublished: datePublished,
      dateModified: dateModified,
      publisher: {
        "@type": "Organization",
        name: publisherName,
        logo: {
          "@type": "ImageObject",
          url: publisherLogo,
        },
      },
      image: image ? {
        "@type": "ImageObject",
        url: image,
      } : undefined,
      articleSection: categories.map((c) => c.name),
      inLanguage: "en-US",
      ...(colorName || colorHex
        ? {
          mainEntity: {
            "@type": "Thing",
            name: colorName || "Color",
            description: colorHex || undefined,
            ...(colorHex
              ? {
                additionalProperty: {
                  "@type": "PropertyValue",
                  name: "Hex Code",
                  value: colorHex,
                },
              }
              : {}),
          },
        }
        : {}),
    },
  ]

  if (faqs && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    })
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": graph.filter((item) => {
      if (item["@type"] === "ImageObject" && !item.url) return false
      return true
    }),
  }

  return (
    <Script id="unified-blog-schema" type="application/ld+json" strategy="beforeInteractive">
      {JSON.stringify(schema)}
    </Script>
  )
}

export function UnifiedColorSchema({
  title,
  description,
  url,
  image,
  colorName,
  colorHex,
  breadcrumbs,
  faqs,
}: {
  title: string
  description: string
  url: string
  image: string
  colorName?: string
  colorHex: string
  breadcrumbs: { name: string; item: string }[]
  faqs: FAQItem[]
}) {
  const siteUrl = "https://hexcolormeans.com"
  const organizationId = `${siteUrl}/#organization`
  const websiteId = `${siteUrl}/#website`
  const webpageId = `${url}#webpage`
  const primaryImageId = `${url}#primaryimage`
  const breadcrumbId = `${url}#breadcrumb`

  const graph: any[] = [
    {
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.item,
      })),
    },
  ]
  const schema = {
    "@context": "https://schema.org",
    "@graph": graph,
  }

  return (
    <Script id="unified-color-schema" type="application/ld+json" strategy="beforeInteractive">
      {JSON.stringify(schema)}
    </Script>
  )
}
