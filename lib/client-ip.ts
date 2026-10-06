import { headers } from 'next/headers';

/** Best-effort client IP for rate limiting in Server Actions. */
export async function getClientIp() {
  const headerList = await headers();
  // Vercel sets x-real-ip itself; the first X-Forwarded-For hop can be
  // client-supplied behind other proxies, so it's only a fallback.
  return (
    headerList.get('x-real-ip')?.trim() ||
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}
