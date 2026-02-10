import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useQuery } from "@/hooks/useQuery";

interface Photo {
  id: string;
  URL: string;
  description?: string;
  isVisible?: boolean;
}

interface EditPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo | null;
  onSave: () => void;
}

export default function EditPhotoModal({
  isOpen,
  onClose,
  photo,
  onSave,
}: EditPhotoModalProps) {
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const { loading: saving, error, fetch, setOptions } = useQuery({
    url: photo ? `/api/admin/photos/${photo.id}` : "",
    method: "PATCH",
  });

  useEffect(() => {
    if (photo) {
      setDescription(photo.description || "");
      setIsVisible(photo.isVisible ?? true);
      setOptions({ url: `/api/admin/photos/${photo.id}`, method: "PATCH" });
    }
  }, [photo]);

  const handleSave = async () => {
    if (!photo) return;

    await fetch({
      body: { description, isVisible },
    });

    if (!error.get) {
      onSave();
      onClose();
    }
  };

  if (!photo) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Foto"
      subtitle="Atualize as informações da foto"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        <div className="relative rounded-lg overflow-hidden border border-white/10">
          <img
            src={photo.URL}
            alt={description || "Foto"}
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/70">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Adicione uma descrição para esta foto..."
            className="w-full p-3 bg-black/20 border border-white/10 rounded-xl h-24 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-black/20 border border-white/10 rounded-xl">
          <div>
            <p className="text-sm font-medium text-white">Foto Visível</p>
            <p className="text-xs text-white/50 mt-1">
              {isVisible
                ? "A foto está visível para todos"
                : "A foto está oculta e só você pode vê-la"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isVisible ? "bg-purple-500" : "bg-white/20"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isVisible ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
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
  );
}
