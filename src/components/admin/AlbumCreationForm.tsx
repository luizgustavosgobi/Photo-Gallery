import { DefaultApiMessage, useQuery } from "@/hooks/useQuery";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PhotoSelector from "./PhotoSelector";
import MultiPhotoSelector from "./MultiPhotoSelector";

enum StatusCode {
  SUCCESS,
  ERROR,
}

type Status = {
  type: StatusCode;
  message: string;
};

interface Photo {
  id: string;
  URL: string;
  description?: string;
}

export default function AlbumCreationForm() {
  const { loading, error, fetch } = useQuery<DefaultApiMessage>({
    url: "/api/admin/albums",
    method: "POST",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [albumName, setAlbumName] = useState("");
  const [bannerId, setBannerId] = useState("");
  const [status, setStatus] = useState<Status | null>(null);
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);
  const [showMultiPhotoSelector, setShowMultiPhotoSelector] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([]);

  const handleSelectPhoto = (photo: Photo) => {
    setBannerId(photo.id);
    setPreview(photo.URL);
  };

  const handleSelectPhotos = (photos: Photo[]) => {
    setSelectedPhotos(photos);
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumName.trim()) return;
    if (!bannerId) {
      setStatus({
        type: StatusCode.ERROR,
        message: "É necessário escolher uma capa para o álbum.",
      });
      return;
    }

    const photoIds = selectedPhotos.map(photo => photo.id);
    await fetch({ body: { albumName, bannerId, photoIds } });

    if (!error.get) {
      setAlbumName("");
      setBannerId("");
      setPreview(null);
      setSelectedPhotos([]);
      setStatus({
        type: StatusCode.SUCCESS,
        message: "Álbum criado com sucesso!",
      });
    } else {
      setStatus({
        type: StatusCode.ERROR,
        message: error.get.message || "Erro ao criar álbum.",
      });
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 border-b border-white/5 bg-white/2">
        <h2 className="text-lg font-medium text-white flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-purple-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Novo Álbum
        </h2>
      </div>

      <div className="p-6">
        <form onSubmit={handleCreateAlbum} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/70">
              Capa do Álbum
            </label>

            {!preview ? (
              <div
                onClick={() => setShowPhotoSelector(true)}
                className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-white/30 hover:bg-white/5 transition-all duration-300 group h-48 w-full"
              >
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-white/50 group-hover:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
                <p className="text-xs font-medium text-white/80 text-center">
                  Clique para selecionar uma foto da galeria
                </p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-white/10 group w-full">
                <img
                  src={preview}
                  alt="Capa Preview"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBannerId("");
                      setPreview("");
                    }}
                    className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full transition-transform hover:scale-110"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/70">
              Nome do Álbum
            </label>
            <input
              type="text"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              placeholder="Ex: Viagem, Produtos, Eventos..."
              className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/70">
              Fotos do Álbum (Opcional)
            </label>
            <div
              onClick={() => setShowMultiPhotoSelector(true)}
              className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-white/30 hover:bg-white/5 transition-all duration-300 group"
            >
              {selectedPhotos.length === 0 ? (
                <>
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-white/50 group-hover:text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-white/70 text-center">
                    Clique para adicionar fotos ao álbum
                  </p>
                </>
              ) : (
                <div className="w-full">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-white/80">
                      {selectedPhotos.length}{" "}
                      {selectedPhotos.length === 1 ? "foto adicionada" : "fotos adicionadas"}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhotos([]);
                      }}
                      className="text-xs text-red-400/70 hover:text-red-400 transition-colors"
                    >
                      Limpar
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {selectedPhotos.slice(0, 5).map((photo) => (
                      <div
                        key={photo.id}
                        className="aspect-square rounded-lg overflow-hidden border border-white/20"
                      >
                        <img
                          src={photo.URL}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {selectedPhotos.length > 5 && (
                      <div className="aspect-square rounded-lg bg-white/10 flex items-center justify-center">
                        <p className="text-xs text-white/60 font-medium">
                          +{selectedPhotos.length - 5}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || !albumName.trim() || !bannerId}
              className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" variant="inline" />
                  <span>Criando...</span>
                </>
              ) : (
                "Criar Álbum"
              )}
            </button>
          </div>
        </form>

        {status && (
          <div
            className={`mt-6 p-4 rounded-lg text-sm font-medium border flex items-center gap-2 ${
              status.type === StatusCode.SUCCESS
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {status.type === StatusCode.SUCCESS ? (
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
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
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
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            )}
            {status.message}
          </div>
        )}
      </div>

      <PhotoSelector
        isOpen={showPhotoSelector}
        onClose={() => setShowPhotoSelector(false)}
        onSelect={handleSelectPhoto}
        selectedPhotoId={bannerId}
      />

      <MultiPhotoSelector
        isOpen={showMultiPhotoSelector}
        onClose={() => setShowMultiPhotoSelector(false)}
        onConfirm={handleSelectPhotos}
        selectedPhotoIds={selectedPhotos.map(p => p.id)}
      />
    </div>
  );
}
