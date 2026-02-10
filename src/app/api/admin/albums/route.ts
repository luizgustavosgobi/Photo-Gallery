import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const albums = await prisma.album.findMany({
    include: {
      _count: {
        select: { photos: true }
      }
    },

    orderBy: { createAt: 'desc' }
  });

  return NextResponse.json(albums);
}

export async function POST(request: Request) {
  const { albumName, bannerId, photoIds } = await request.json();

  if (!bannerId || !albumName) return NextResponse.json({ message: 'Preencha todos os campos!' }, { status: 400 });
  
  const existingAlbum = await prisma.album.findFirst({ where: { name: albumName } })
  if (existingAlbum) return NextResponse.json({ message: 'Já existe um album com esse nome!' }, { status: 400 });

  const album = await prisma.album.create({
    data: {
      name: albumName,
      bannerId,
      ...(photoIds && photoIds.length > 0 && {
        photos: {
          connect: photoIds.map((id: string) => ({ id }))
        }
      })
    }
  });

  return NextResponse.json(album);
}
