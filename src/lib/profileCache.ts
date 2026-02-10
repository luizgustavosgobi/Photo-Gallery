import { prisma } from '@/lib/prisma';

type CachedProfile = {
  description: string | null;
  photo: string | null; // photo key in R2
  fetchedAt: number;
};

let cache: CachedProfile | null = null;
const TTL = 30_000; // 30 seconds

export async function getCachedProfile() {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < TTL) return cache;

  const profile = await prisma.profile.findFirst();
  const description = profile?.description ?? null;
  const photo = profile?.photo ?? null;

  cache = { description, photo, fetchedAt: now };
  return cache;
}

export function invalidateProfileCache() {
  cache = null;
}
