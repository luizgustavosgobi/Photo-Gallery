import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import EditPhotoModal from "./EditPhotoModal";
import { useQuery } from "@/hooks/useQuery";

type ResponseData = {
  hasRemaining: boolean;
  photos: Photo[];
};

interface Photo {
  id: string;
  URL: string;
  description?: string;
  isVisible: boolean;
}

export default function PhotosManagement() {
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  const { data, loading, error, fetch: loadPhotos } = useQuery<ResponseData>({
    url: "/api/admin/photos",
    method: "GET",
  });

  const { fetch: deletePhoto } = useQuery({
    url: "/api/admin/photos/",
    method: "DELETE",
  });

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleDelete = async (photoId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta foto?")) return;

    await deletePhoto({ url: `/api/admin/photos/${photoId}` });
    loadPhotos();
  };

  if (loading) {
    return <LoadingSpinner message="Carregando fotos..." className="min-h-[40vh] flex items-center justify-center animate-fade-in-up" />;
  }

  const photos = data?.photos || [];

  if (photos.length === 0) {
    return (
      <EmptyState
        title="Nenhuma foto encontrada"
        subtitle="Adicione fotos primeiro"
      />
    );
  }

  return (
    <>
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-medium text-white/90">
            Fotos Existentes
          </h2>
          <p className="text-sm text-white/50 mt-1">
            Visualize e gerencie as fotos da galeria.
          </p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square rounded-lg overflow-hidden bg-black/20 border border-white/10 hover:border-white/30 transition-all"
              >
                <img
                  src={photo.URL}
                  alt={photo.description || "Foto"}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
                    !photo.isVisible ? 'opacity-40 grayscale group-hover:opacity-60' : 'opacity-80 group-hover:opacity-100'
                  }`}
                />
                
                {/* Badge de Visibilidade */}
                {photo.isVisible === false && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                    Oculta
                  </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={photo.isVisible ? () => window.open(`/media/${photo.id}`, "_blank") : undefined}
                      disabled={!photo.isVisible}
                      className={`flex-1 backdrop-blur-sm px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                        photo.isVisible 
                          ? 'bg-white/20 hover:bg-white/30 text-white cursor-pointer' 
                          : 'bg-white/5 text-white/30 cursor-not-allowed'
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
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
                      onClick={() => setEditingPhoto(photo)}
                      className="bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur-sm text-blue-200 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-red-200 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditPhotoModal
        isOpen={editingPhoto !== null}
        onClose={() => setEditingPhoto(null)}
        photo={editingPhoto}
        onSave={loadPhotos}
      />
    </>
  );
}
