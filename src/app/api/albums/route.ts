import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import getPhotoSignedURL from '@/lib/r2';

export async function GET() {
    try {
        const albums = await prisma.album.findMany({
            orderBy: {
                createAt: "desc"
            },
            select: {
                id: true,
                name: true,
                bannerId: true
            }
        });

        const albumsWithUrls = await Promise.all(
            albums.map(async (album: { id: string, name: string | null, bannerId: string }) => {
                const bannerURL = album.bannerId ? await getPhotoSignedURL(album.bannerId) : "";
                return {
                    ...album,
                    bannerURL
                };
            })
        );

        return NextResponse.json(albumsWithUrls);
    } catch (error) {
        console.error('Error fetching albums:', error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
