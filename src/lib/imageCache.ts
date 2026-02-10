import { r2 } from '@/lib/r2';
import { GetObjectCommand } from '@aws-sdk/client-s3';

type ImageEntry = {
  buffer: Buffer;
  contentType: string;
  fetchedAt: number;
};

const cache = new Map<string, ImageEntry>();
const TTL = 1000 * 60 * 60; // 1 hour

export async function getCachedImage(key: string) {
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && now - cached.fetchedAt < TTL) return cached;

  const res = await r2.send(new GetObjectCommand({ Bucket: 'photos', Key: key }));
  const body = res.Body as any;

  let buffer: Buffer;
  if (body == null) {
    throw new Error('Empty body from R2');
  }

  if (typeof body.arrayBuffer === 'function') {
    const ab = await body.arrayBuffer();
    buffer = Buffer.from(ab);
  } else if (typeof body.pipe === 'function') {
    const chunks: Buffer[] = [];
    for await (const chunk of body) chunks.push(Buffer.from(chunk));
    buffer = Buffer.concat(chunks);
  } else if (body instanceof Uint8Array) {
    buffer = Buffer.from(body);
  } else {
    // fallback: try to stringify
    const txt = await (body.text ? body.text() : Promise.resolve(''));
    buffer = Buffer.from(txt);
  }

  const contentType = (res.ContentType as string) || 'application/octet-stream';
  const entry: ImageEntry = { buffer, contentType, fetchedAt: now };
  cache.set(key, entry);
  return entry;
}

export function invalidateImage(key: string) {
  cache.delete(key);
}
