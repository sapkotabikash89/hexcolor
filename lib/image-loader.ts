'use client'

export default function gumletLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const isAbsolute = src.startsWith('http://') || src.startsWith('https://')
  const base = 'https://hexcolormeans.com'

  const url = new URL(isAbsolute ? src : `${base}${src}`)

  const isWpUploads =
    url.hostname === 'blog.hexcolormeans.com' &&
    url.pathname.startsWith('/wp-content/uploads/')

  if (isWpUploads || url.hostname === 'hexcolormeans.gumlet.io') {
    url.hostname = 'hexcolormeans.gumlet.io'
    if (!url.pathname.startsWith('/wp-content/uploads/')) {
      url.pathname = `/wp-content/uploads${url.pathname}`
    }
  }

  url.searchParams.set('w', String(width))

  if (typeof quality === 'number') {
    url.searchParams.set('q', String(quality))
  }

  const result = url.toString()

  if (isAbsolute) {
    return result
  }

  return result.replace(base, '')
}
