import { NextResponse } from 'next/server';
import { getCachedImage } from '@/lib/imageCache';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    if (!key) return NextResponse.json({ error: 'missing key' }, { status: 400 });

    const entry = await getCachedImage(key);
    const body = Uint8Array.from(entry.buffer);
    return new NextResponse(body, {
      headers: {
        'Content-Type': entry.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (err) {
    console.error('GET /api/profile/photo error', err);
    return NextResponse.json({ error: 'failed to load photo' }, { status: 500 });
  }
}
