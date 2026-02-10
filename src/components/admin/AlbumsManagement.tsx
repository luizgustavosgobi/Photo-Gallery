import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import EditAlbumModal from "./EditAlbumModal";
import { useQuery } from "@/hooks/useQuery";

interface Album {
  id: string;
  name: string;
  bannerId: string;
  _count: { photos: number };
}

export default function AlbumsManagement() {
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: albums, loading, error, fetch: loadAlbums } = useQuery<Album[]>({
    url: "/api/admin/albums",
    method: "GET",
  });

  const { fetch: deleteAlbum } = useQuery({
    url: "",
    method: "DELETE",
  });

  useEffect(() => {
    loadAlbums();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza? Todas as fotos deste álbum serão desvinculadas."))
      return;

    setDeletingId(id);
    await deleteAlbum({ url: `/api/admin/albums?id=${id}` });
    setDeletingId(null);
    loadAlbums();
  };

  if (loading) {
    return <LoadingSpinner message="Carregando álbuns..." className="min-h-[40vh] flex items-center justify-center animate-fade-in-up" />;
  }

  if (!albums || albums.length === 0) {
    return (
      <EmptyState
        title="Nenhum álbum encontrado"
        subtitle="Crie seu primeiro álbum"
      />
    );
  }

  return (
    <>
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-medium text-white/90">
            Álbuns Existentes
          </h2>
          <p className="text-sm text-white/50 mt-1">
            Visualize e gerencie seus álbuns.
          </p>
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <span className="text-sm text-white/60">
              {albums.length} {albums.length === 1 ? "álbum encontrado" : "álbuns encontrados"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div
                key={album.id}
                className="group bg-black/20 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-mono text-white/30 bg-white/5 px-2 py-1 rounded">
                      ID: {album.id.slice(0, 4)}...
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                    {album.name}
                  </h3>
                  <p className="text-sm text-white/50">
                    {album._count.photos} {album._count.photos === 1 ? "foto" : "fotos"}
                  </p>
                </div>

                <div className="p-4 border-t border-white/5 bg-black/20 flex gap-2">
                  <button
                    onClick={() => window.open(`/album/${album.id}`, "_blank")}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Ver
                  </button>
                  <button
                    onClick={() => setEditingAlbum(album)}
                    className="px-3 py-2 text-sm font-medium text-blue-400/70 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(album.id)}
                    disabled={deletingId === album.id}
                    className="px-3 py-2 text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deletingId === album.id ? (
                      <LoadingSpinner size="sm" variant="inline" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditAlbumModal
        isOpen={editingAlbum !== null}
        onClose={() => setEditingAlbum(null)}
        album={editingAlbum}
        onSave={loadAlbums}
      />
    </>
  );
}
