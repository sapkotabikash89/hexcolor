export async function onRequest(context: any) {
  const url = new URL(context.request.url)
  const key = url.searchParams.get('key')
  if (!key) {
    return new Response(JSON.stringify({ error: 'missing key' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })
  }
  const kv = context.env?.LOVE_KV
  if (context.request.method === 'GET') {
    let val = 16
    if (kv) {
      const raw = await kv.get(key)
      if (raw && !Number.isNaN(Number(raw))) val = Number(raw)
    }
    return new Response(JSON.stringify({ count: val }), {
      headers: { 'content-type': 'application/json' },
    })
  }
  if (context.request.method === 'POST') {
    let current = 16
    if (kv) {
      const raw = await kv.get(key)
      if (raw && !Number.isNaN(Number(raw))) current = Number(raw)
      current = current + 1
      await kv.put(key, String(current))
    } else {
      current = current + 1
    }
    return new Response(JSON.stringify({ count: current }), {
      headers: { 'content-type': 'application/json' },
    })
  }
  return new Response('Method Not Allowed', { status: 405 })
}
