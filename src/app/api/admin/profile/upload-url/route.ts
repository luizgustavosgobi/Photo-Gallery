import { NextResponse } from 'next/server';
import { r2 } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const filename = url.searchParams.get('filename') || `profile-${Date.now()}`;
    const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `profile/${Date.now()}-${sanitized}`;

    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({ Bucket: 'photos', Key: key }),
      { expiresIn: 3600 }
    );

    return NextResponse.json({ url: signedUrl, key });
  } catch (err) {
    console.error('GET /api/admin/profile/upload-url error', err);
    return NextResponse.json({ error: 'Failed to create upload url' }, { status: 500 });
  }
}
