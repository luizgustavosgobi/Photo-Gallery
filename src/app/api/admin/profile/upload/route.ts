import { NextResponse } from 'next/server';
import { r2 } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const filename = file.name || `profile-${Date.now()}`;
    const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `profile/${Date.now()}-${sanitized}`;

    const arrayBuffer = await file.arrayBuffer();

    await r2.send(new PutObjectCommand({
      Bucket: 'photos',
      Key: key,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type || 'application/octet-stream'
    }));

    return NextResponse.json({ key });
  } catch (err) {
    console.error('POST /api/admin/profile/upload error', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
