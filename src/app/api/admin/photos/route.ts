import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/lib/r2';

const PAGINATION_SIZE = 50;

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
            take: PAGINATION_SIZE,
            skip: skip,
            orderBy: {
                photoMetadata: {
                    createdAt: "desc",
                }
            },
            select: {
                id: true,
                description: true,
                isVisible: true,
                photoMetadata: {
                    select: {
                        createdAt: true
                    }
                }
            },
        });

        const photosWithUrls = await Promise.all(
            photosMetadata.map(async (photo: { id: string; description: string | null; isVisible: boolean; photoMetadata: { createdAt: Date } | null }) => {
                const photoURL = await getSignedUrl(
                    r2,
                    new GetObjectCommand({ Bucket: "photos", Key: photo.id }),
                    { expiresIn: 3600 }
                );

                return {
                    id: photo.id,
                    description: photo.description,
                    isVisible: photo.isVisible,
                    URL: photoURL,
                    createdAt: photo.photoMetadata?.createdAt
                };
            })
        );

        const hasRemaining = totalPhotos > skip + photosWithUrls.length;

        return NextResponse.json({
            photos: photosWithUrls,
            hasRemaining,
            total: totalPhotos
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch photos", error: String(error) },
            { status: 500 }
        );
    }
}
