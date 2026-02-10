import {GetObjectCommand, S3Client, HeadObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import { ImageVariant, getImageVariantKey } from './imageProcessing';

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: `${process.env.CLOUDFLARE_R2_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.CLOUDFLARE_R2_ACCESS_KEY_SECRETE}`,
  }
});

export default async function getPhotoSignedURL(photoId: string, variant: ImageVariant = 'original') {
  const key = getImageVariantKey(photoId, variant);
  
  // Para variantes (não original), verifica se existe no R2
  // Se não existir (foto antiga), faz fallback para o original
  if (variant !== 'original') {
    try {
      await r2.send(new HeadObjectCommand({ Bucket: "photos", Key: key }));
    } catch (error) {
      // Variante não existe, usa o original
      return await getSignedUrl(
        r2,
        new GetObjectCommand({ Bucket: "photos", Key: photoId }),
        { expiresIn: 3600 }
      );
    }
  }
  
  return await getSignedUrl(
      r2,
      new GetObjectCommand({ Bucket: "photos", Key: key }),
      { expiresIn: 3600 }
  );
}
