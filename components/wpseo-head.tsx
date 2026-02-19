import Head from "next/head"

export function WPSEOHead({
  schemaRaw,
  canonical,
  focuskw,
  robotsAdvanced,
  ogAuthor,
  ogSection,
  ogTags,
  twitterCreator,
  estimatedReadingTime,
  cornerstone,
}: {
  schemaRaw?: string
  canonical?: string
  focuskw?: string
  robotsAdvanced?: string
  ogAuthor?: string
  ogSection?: string
  ogTags?: string[] | string
  twitterCreator?: string
  estimatedReadingTime?: string | number
  cornerstone?: boolean
}) {
  const normalizedSchemaRaw =
    schemaRaw?.replace(/https?:\/\/blog\.hexcolormeans\.com/gi, "https://hexcolormeans.com") || undefined
  return (
    <Head>
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      {normalizedSchemaRaw ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: normalizedSchemaRaw }} />
      ) : null}
      {focuskw ? <meta name="keywords" content={focuskw} /> : null}
      {robotsAdvanced ? <meta name="robots" content={robotsAdvanced} /> : null}
      {ogAuthor ? <meta property="article:author" content={ogAuthor} /> : null}
      {ogSection ? <meta property="article:section" content={ogSection} /> : null}
      {Array.isArray(ogTags)
        ? ogTags.map((t, i) => <meta key={`ogtag-${i}`} property="article:tag" content={t} />)
        : ogTags
        ? <meta property="article:tag" content={String(ogTags)} />
        : null}
      {twitterCreator ? <meta name="twitter:creator" content={twitterCreator} /> : null}
      {estimatedReadingTime ? <meta name="estimated-reading-time" content={String(estimatedReadingTime)} /> : null}
      {typeof cornerstone === "boolean" ? <meta name="yoast:cornerstone" content={cornerstone ? "true" : "false"} /> : null}
    </Head>
  )
}
