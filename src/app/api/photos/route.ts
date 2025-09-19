import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/lib/r2';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const skip = Number(searchParams.get('skip')) || 0;

        const totalPhotos = await prisma.photo.count();
        if (totalPhotos <= skip) {
            return NextResponse.json(
                { message: "No more photos available", hasRemaining: false },
                { status: 400 }
            );
        }

        const photosMetadata = await prisma.photo.findMany({
            take: 20,
            skip: skip,
            orderBy: {
                photoMetadata: {
                    createdAt: "desc",
                }
            },
            where: {
                isVisible: true
            },
            select: {
                id: true,
            },
        });

        // Add signed URLs
        const photosWithUrls = await Promise.all(
            photosMetadata.map(async (photo: { id: string }) => {
                const photoURL = await getSignedUrl(
                    r2,
                    new GetObjectCommand({ Bucket: "photos", Key: photo.id }),
                    { expiresIn: 3600 }
                );

                return {
                    ...photo,
                    URL: photoURL
                };
            })
        );

        return NextResponse.json({
            hasRemaining: skip + 20 < totalPhotos,
            photos: photosWithUrls
        });
    } catch (error) {
        console.error('Error fetching photos:', error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
