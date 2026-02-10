import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PhotoSelector from "./PhotoSelector";
import MultiPhotoSelector from "./MultiPhotoSelector";
import { useQuery } from "@/hooks/useQuery";

interface Photo {
  id: string;
  URL: string;
  description?: string;
}

interface Album {
  id: string;
  name: string;
  bannerId: string;
  photos?: Photo[];
}

interface EditAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  album: Album | null;
  onSave: () => void;
}

export default function EditAlbumModal({
  isOpen,
  onClose,
  album,
  onSave,
}: EditAlbumModalProps) {
  const [name, setName] = useState("");
  const [bannerId, setBannerId] = useState("");
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<Photo[]>([]);
  const [showBannerSelector, setShowBannerSelector] = useState(false);
  const [showAddPhotos, setShowAddPhotos] = useState(false);

  const { loading: saving, error, fetch: saveAlbum, setOptions: setAlbumOptions } = useQuery({
    url: album ? `/api/admin/albums/${album.id}` : "",
    method: "PATCH",
  });

  const { data: bannerData, fetch: fetchBanner } = useQuery<{ URL: string }>({
    url: album?.bannerId ? `/api/photos/${album.bannerId}` : "",
    method: "GET",
  });

  const { data: albumData, fetch: fetchAlbumPhotos } = useQuery<{ photos: Photo[] }>({
    url: album ? `/api/albums/${album.id}` : "",
    method: "GET",
  });

  useEffect(() => {
    if (album) {
      setName(album.name);
      setBannerId(album.bannerId);

      setAlbumOptions({ url: `/api/admin/albums/${album.id}`, method: "PATCH" });
      fetchBanner({ url: `/api/photos/${album.bannerId}` });
      fetchAlbumPhotos({ url: `/api/albums/${album.id}` });
    }
  }, [album]);

  useEffect(() => {
    if (bannerData) {
      setBannerPreview(bannerData.URL);
    }
  }, [bannerData]);

  useEffect(() => {
    if (albumData) {
      setAlbumPhotos(albumData.photos || []);
    }
  }, [albumData]);

  const handleSelectBanner = (photo: Photo) => {
    setBannerId(photo.id);
    setBannerPreview(photo.URL);
  };

  const handleAddPhotos = (photos: Photo[]) => {
    const newPhotos = photos.filter(
      (p) => !albumPhotos.some((ap) => ap.id === p.id)
    );
    setAlbumPhotos([...albumPhotos, ...newPhotos]);
  };

  const handleRemovePhoto = (photoId: string) => {
    setAlbumPhotos(albumPhotos.filter((p) => p.id !== photoId));
  };

  const handleSave = async () => {
    if (!album) return;

    await saveAlbum({
      body: {
        name,
        bannerId,
        photoIds: albumPhotos.map((p) => p.id),
      },
    });

    if (!error.get) {
      onSave();
      onClose();
    }
  };

  if (!album) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Editar Álbum"
        subtitle="Atualize as informações do álbum"
        maxWidth="2xl"
      >
        <div className="space-y-6">
          {/* Nome do Álbum */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/70">
              Nome do Álbum
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Viagem, Produtos, Eventos..."
              className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
          </div>

          {/* Banner */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/70">
              Capa do Álbum
            </label>
            <div
              onClick={() => setShowBannerSelector(true)}
              className="relative rounded-xl overflow-hidden border border-white/10 group cursor-pointer h-40"
            >
              {bannerPreview ? (
                <>
                  <img
                    src={bannerPreview}
                    alt="Banner"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Alterar Capa
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <p className="text-white/50 text-sm">Clique para selecionar capa</p>
                </div>
              )}
            </div>
          </div>

          {/* Fotos do Álbum */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-white/70">
                Fotos do Álbum ({albumPhotos.length})
              </label>
              <button
                type="button"
                onClick={() => setShowAddPhotos(true)}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Adicionar Fotos
              </button>
            </div>

            {albumPhotos.length === 0 ? (
              <div
                onClick={() => setShowAddPhotos(true)}
                className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-white/30 hover:bg-white/5 transition-all"
              >
                <p className="text-sm text-white/50">
                  Nenhuma foto no álbum. Clique para adicionar.
                </p>
              </div>
            ) : (
              <div className="border border-white/10 rounded-xl p-4 bg-black/20 max-h-80 overflow-y-auto">
                <div className="grid grid-cols-4 gap-3">
                  {albumPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-white/10"
                    >
                      <img
                        src={photo.URL}
                        alt={photo.description || ""}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="sm" variant="inline" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
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
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Seleção de Banner */}
      <PhotoSelector
        isOpen={showBannerSelector}
        onClose={() => setShowBannerSelector(false)}
        onSelect={handleSelectBanner}
        selectedPhotoId={bannerId}
      />

      {/* Modal de Adicionar Fotos */}
      <MultiPhotoSelector
        isOpen={showAddPhotos}
        onClose={() => setShowAddPhotos(false)}
        onConfirm={handleAddPhotos}
        selectedPhotoIds={albumPhotos.map((p) => p.id)}
      />
    </>
  );
}
