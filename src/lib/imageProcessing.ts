import sharp from 'sharp';
import { r2 } from './r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export type ImageVariant = 'thumb' | 'medium' | 'large' | 'original';

export const IMAGE_SIZES = {
  thumb: 400,
  medium: 800,
  large: 1600,
};

export interface ProcessedImage {
  width: number;
  height: number;
  contentType: string;
}

/**
 * Processa uma imagem e gera variantes (thumbnails) no R2
 */
export async function processAndUploadImageVariants(
  buffer: Buffer,
  photoId: string,
  contentType: string
): Promise<ProcessedImage> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Não foi possível obter dimensões da imagem');
  }

  // Upload do original
  await r2.send(new PutObjectCommand({
    Bucket: 'photos',
    Key: photoId,
    Body: buffer,
    ContentType: contentType,
  }));

  // Gera e faz upload das variantes
  await Promise.all([
    generateAndUploadVariant(buffer, photoId, 'thumb'),
    generateAndUploadVariant(buffer, photoId, 'medium'),
    generateAndUploadVariant(buffer, photoId, 'large'),
  ]);

  return {
    width: metadata.width,
    height: metadata.height,
    contentType,
  };
}

/**
 * Gera e faz upload de uma variante específica
 */
async function generateAndUploadVariant(
  buffer: Buffer,
  photoId: string,
  variant: 'thumb' | 'medium' | 'large'
): Promise<void> {
  const size = IMAGE_SIZES[variant];
  
  const resizedBuffer = await sharp(buffer)
    .resize(size, size, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();

  await r2.send(new PutObjectCommand({
    Bucket: 'photos',
    Key: `${photoId}-${variant}`,
    Body: resizedBuffer,
    ContentType: 'image/jpeg',
  }));
}

/**
 * Retorna a chave (Key) da variante no R2
 */
export function getImageVariantKey(photoId: string, variant: ImageVariant): string {
  if (variant === 'original') {
    return photoId;
  }
  return `${photoId}-${variant}`;
}
