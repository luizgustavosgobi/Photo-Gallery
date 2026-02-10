import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ photoId: string }> }
) {
  try {
    const { description, isVisible } = await request.json();
    const { photoId } = await params;

    const updatedPhoto = await prisma.photo.update({
      where: { id: photoId },
      data: {
        ...(description !== undefined && { description }),
        ...(isVisible !== undefined && { isVisible })
      },
      include: {
        photoMetadata: true
      }
    });

    return NextResponse.json(updatedPhoto);
  } catch (error) {
    console.error('Erro ao atualizar foto:', error);
    return NextResponse.json(
      { message: 'Erro ao atualizar foto' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ photoId: string }> }
) {
  try {
    const { photoId } = await params;

    const albumUsingAsBanner = await prisma.album.findFirst({ where: { bannerId: photoId } });
    if (albumUsingAsBanner) {
      return NextResponse.json(
        { message: 'Não é possível excluir: a foto é capa do álbum "' + (albumUsingAsBanner.name || '') + '". Remova a foto como capa antes de excluir.' },
        { status: 400 }
      );
    }

    const albumsContaining = await prisma.album.findMany({ where: { photos: { some: { id: photoId } } }, select: { id: true } });

    for (const a of albumsContaining) {
      await prisma.album.update({ where: { id: a.id }, data: { photos: { disconnect: { id: photoId } } } });
    }
    
    await prisma.photo_metadata.deleteMany({ where: { photoId } });
    await prisma.photo_ratings.deleteMany({ where: { photoId } });

    await prisma.photo.delete({ where: { id: photoId } });

    return NextResponse.json({ message: 'Foto deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar foto:', error);
    return NextResponse.json(
      { message: 'Erro ao deletar foto' },
      { status: 500 }
    );
  }
}
