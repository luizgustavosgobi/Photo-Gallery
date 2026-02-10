import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { useQuery } from "@/hooks/useQuery";

type ResponseData = {
  hasRemaining: boolean;
  photos: PhotoData[];
};

type PhotoData = {
  id: string;
  URL: string;
  description?: string;
  isVisible: boolean;
};

interface MultiPhotoSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (photos: PhotoData[]) => void;
  selectedPhotoIds?: string[];
}

export default function MultiPhotoSelector({
  isOpen,
  onClose,
  onConfirm,
  selectedPhotoIds = [],
}: MultiPhotoSelectorProps) {
  const [selected, setSelected] = useState<string[]>(selectedPhotoIds);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const { data, loading, error, fetch } = useQuery<ResponseData>({
    url: "/api/photos?skip=0",
    method: "GET",
  });

  useEffect(() => {
    if (isOpen) {
      fetch();
    }
  }, [isOpen]);

  useEffect(() => {
    if (data) setPhotos(data.photos);
  }, [data]);

  const togglePhoto = (photoId: string) => {
    setSelected((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleConfirm = () => {
    const selectedPhotos = photos.filter((photo) =>
      selected.includes(photo.id)
    );
    onConfirm(selectedPhotos);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar Fotos ao Álbum"
      subtitle={`${selected.length} ${
        selected.length === 1 ? "foto selecionada" : "fotos selecionadas"
      }`}
    >
      {loading ? (
        <LoadingSpinner message="Carregando fotos..." className="min-h-[40vh] flex items-center justify-center" />
      ) : photos.length === 0 ? (
        <EmptyState
          title="Nenhuma foto encontrada"
          subtitle="Adicione fotos primeiro antes de criar um álbum"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {photos.map((photo) => {
              const isSelected = selected.includes(photo.id);
              return (
                <div
                  key={photo.id}
                  onClick={() => togglePhoto(photo.id)}
                  className={`group relative aspect-square rounded-lg overflow-hidden bg-black/20 border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-purple-500 ring-2 ring-purple-500/50"
                      : "border-white/10 hover:border-purple-500/50"
                  }`}
                >
                  <img
                    src={photo.URL}
                    alt={photo.description || "Foto"}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      isSelected
                        ? "opacity-100 scale-105"
                        : "opacity-80 group-hover:opacity-100 group-hover:scale-105"
                    }`}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity ${
                      isSelected
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <div className="absolute top-2 right-2">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-purple-500 border-purple-500"
                            : "bg-black/50 border-white/50"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className="w-4 h-4 text-white"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
            <button
              onClick={() => setSelected([])}
              className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
              disabled={selected.length === 0}
            >
              Limpar seleção
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={selected.length === 0}
                className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                Adicionar ({selected.length})
              </button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
