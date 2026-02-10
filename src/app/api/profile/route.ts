import { NextResponse } from 'next/server';
import { getCachedProfile } from '@/lib/profileCache';

export async function GET() {
  try {
    const prof = await getCachedProfile();
    const photoKey = prof.photo ?? null;
    const photoProxy = photoKey ? `/api/profile/photo?key=${encodeURIComponent(photoKey)}` : null;
    return NextResponse.json({ description: prof.description, photoProxy });
  } catch (err) {
    console.error('GET /api/profile error', err);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}
