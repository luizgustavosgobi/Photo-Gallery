import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { invalidateProfileCache } from '@/lib/profileCache';
import { invalidateImage } from '@/lib/imageCache';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { description, photo } = body;

    const existing = await prisma.profile.findFirst();

    let result;
    if (existing) {
      result = await prisma.profile.update({
        where: { id: existing.id },
        data: { description: description ?? existing.description, photo: photo ?? existing.photo }
      });
    } else {
      result = await prisma.profile.create({ data: { description: description ?? '', photo: photo ?? '' } });
    }

    // invalidate cache so next GET returns fresh data
    try { invalidateProfileCache(); } catch (e) { console.error('Failed to invalidate profile cache', e); }
    // invalidate image cache for the old/new key
    try { if (result.photo) invalidateImage(result.photo); } catch (e) { console.error('Failed to invalidate image cache', e); }

    const photoProxy = result.photo ? `/api/profile/photo?key=${encodeURIComponent(result.photo)}` : null;
    return NextResponse.json({ id: result.id, description: result.description, photoProxy });
  } catch (err) {
    console.error('PATCH /api/admin/profile error', err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
