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
  id: string,
  URL: string,
  description?: string,
  isVisible: boolean
};

interface PhotoSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (photo: PhotoData) => void;
  selectedPhotoId?: string;
}

export default function PhotoSelector({
  isOpen,
  onClose,
  onSelect,
  selectedPhotoId,
}: PhotoSelectorProps) {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const { data, loading, error, fetch } = useQuery<ResponseData>({
    url: "/api/photos?skip=0",
    method: "GET",
  });

  useEffect(() => {
    if (isOpen) {
      fetch()
    }
  }, [isOpen]);

  useEffect(() => {
    if (data) setPhotos(data.photos)
  }, [data]);

  const handleSelectPhoto = (photo: PhotoData) => {
    onSelect(photo);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Selecionar Foto"
      subtitle="Escolha uma foto da sua galeria"
    >
      {loading ? (
        <LoadingSpinner message="Carregando fotos..." className="min-h-[40vh] flex items-center justify-center" />
      ) : photos.length === 0 ? (
        <EmptyState
          title="Nenhuma foto encontrada"
          subtitle="Adicione fotos primeiro antes de criar um álbum"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => handleSelectPhoto(photo)}
              className="group relative aspect-square rounded-lg overflow-hidden bg-black/20 border-2 border-white/10 hover:border-purple-500 transition-all cursor-pointer"
            >
              <img
                src={photo.URL}
                alt={photo.description || "Foto"}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Selecionar
                </div>
              </div>
              {selectedPhotoId === photo.id && (
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
