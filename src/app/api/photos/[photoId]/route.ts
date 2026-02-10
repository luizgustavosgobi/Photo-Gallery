import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import getPhotoSignedURL from '@/lib/r2';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ photoId: string }> }
) {
    try {
        const { photoId } = await params;

        const photo = await prisma.photo.findUnique({
            where: { id: photoId, isVisible: true },
            select: {
                id: true,
                description: true,
                ratings: {
                    select: {
                        likes: true,
                    }
                },
                photoMetadata: {
                    select: {
                        createdAt: true,
                    }
                }
            },
        });

        if (!photo) {
            return NextResponse.json(
                { message: "Photo not found" },
                { status: 404 }
            );
        }

        const nextPhoto = await prisma.photo.findFirst({
            where: {
                isVisible: true,
                photoMetadata: {
                    createdAt: { lt: photo.photoMetadata?.createdAt }
                }
            },
            orderBy: {
                photoMetadata: {
                    createdAt: 'desc'
                }
            },
            select: { id: true }
        });

        const previousPhoto = await prisma.photo.findFirst({
            where: {
                isVisible: true,
                photoMetadata: {
                    createdAt: { gt: photo.photoMetadata?.createdAt }
                }
            },
            orderBy: {
                photoMetadata: {
                    createdAt: 'asc'
                }
            },
            select: { id: true }
        });

        const photoURL = await getPhotoSignedURL(photo.id, 'original');

        return NextResponse.json({
            ...photo,
            URL: photoURL,
            navigation: {
                nextPhoto: nextPhoto?.id || null,
                previousPhoto: previousPhoto?.id || null,
            }
        });
    } catch (error) {
        console.error('Error fetching photo:', error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
