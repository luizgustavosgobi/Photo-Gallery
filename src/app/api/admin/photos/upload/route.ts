import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processAndUploadImageVariants } from '@/lib/imageProcessing';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const photoId = crypto.randomUUID();

    // Processa a imagem e gera variantes (thumbnails)
    const imageInfo = await processAndUploadImageVariants(
      buffer,
      photoId,
      file.type
    );

    await prisma.photo.create({
      data: {
        id: photoId,
        description: description,
        photoMetadata: {
          create: {
            height: imageInfo.height,
            width: imageInfo.width,
            contentType: imageInfo.contentType,
          }
        },
        ratings: {
          create: {
            likes: 0
          }
        }
      }
    });

    return NextResponse.json({ photoId });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
