import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import getPhotoSignedURL from '@/lib/r2';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ albumId: string }> }
) {
    try {
        const { albumId } = await params;

        const albumData = await prisma.album.findUnique({
            where: { id: albumId },
            select: {
                name: true,
                bannerId: true,
                photos: {
                    select: {
                        id: true
                    },
                    orderBy: {
                        photoMetadata: {
                            createdAt: 'desc'
                        }
                    }
                }
            }
        });

        if (!albumData) {
            return NextResponse.json(
                { message: "Album not found!" },
                { status: 404 }
            );
        }

        const bannerURL = await getPhotoSignedURL(albumData.bannerId, 'large');
        const photosWithUrls = await Promise.all(
            albumData.photos.map(async (photo: { id: string }) => {
                // Usa 'medium' para fotos na galeria do álbum
                const photoURL = await getPhotoSignedURL(photo.id, 'medium');
                return {
                    ...photo,
                    URL: photoURL
                };
            })
        );

        return NextResponse.json({
            ...albumData,
            bannerURL,
            photos: photosWithUrls
        });
    } catch (error) {
        console.error('Error fetching album:', error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
