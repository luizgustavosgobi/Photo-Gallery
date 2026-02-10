import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ albumId: string }> }
) {
  try {
    const { name, bannerId, photoIds } = await request.json();
    const { albumId } = await params;

    // Primeiro, desconecta todas as fotos atuais
    await prisma.album.update({
      where: { id: albumId },
      data: {
        photos: {
          set: []
        }
      }
    });

    // Depois, atualiza o álbum com os novos dados
    const updatedAlbum = await prisma.album.update({
      where: { id: albumId },
      data: {
        ...(name && { name }),
        ...(bannerId && { bannerId }),
        ...(photoIds && photoIds.length > 0 && {
          photos: {
            connect: photoIds.map((id: string) => ({ id }))
          }
        })
      },
      include: {
        _count: {
          select: { photos: true }
        }
      }
    });

    return NextResponse.json(updatedAlbum);
  } catch (error) {
    console.error('Erro ao atualizar álbum:', error);
    return NextResponse.json(
      { message: 'Erro ao atualizar álbum' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ albumId: string }> }
) {
  try {
    const { albumId } = await params;

    await prisma.album.delete({
      where: { id: albumId }
    });

    return NextResponse.json({ message: 'Álbum deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar álbum:', error);
    return NextResponse.json(
      { message: 'Erro ao deletar álbum' },
      { status: 500 }
    );
  }
}
