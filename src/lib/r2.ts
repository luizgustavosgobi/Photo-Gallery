import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: `${process.env.CLOUDFLARE_R2_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.CLOUDFLARE_R2_ACCESS_KEY_SECRETE}`,
  }
});

export default async function getPhotoSignedURL(photoId: string) {
  return  await getSignedUrl(
      r2,
      new GetObjectCommand({ Bucket: "photos", Key: photoId }),
      { expiresIn: 3600 }
  );
}
