import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import getPhotoSignedURL from '@/lib/r2';

const PAGINATION_SIZE = process.env.PAGINATION_SIZE ? parseInt(process.env.PAGINATION_SIZE) : 20;

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
            where: {
                isVisible: true
            },
            select: {
                id: true,
                description: true,
                isVisible: true
            },
        });

        const photosWithUrls = await Promise.all(
            photosMetadata.map(async (photo: { id: string }) => {
                // Usa variante 'medium' para listagem (800px) com fallback automático
                const photoURL = await getPhotoSignedURL(photo.id, 'medium');

                return {
                    ...photo,
                    URL: photoURL
                };
            })
        );

        return NextResponse.json({
            hasRemaining: skip + PAGINATION_SIZE < totalPhotos,
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
