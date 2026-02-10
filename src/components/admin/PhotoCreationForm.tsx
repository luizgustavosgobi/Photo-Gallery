import { DefaultApiMessage, useQuery } from "@/hooks/useQuery";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useEffect, useRef, useState } from "react";

enum StatusCode {
  SUCCESS,
  ERROR,
}

type Status = {
  type: StatusCode;
  message: string;
};

export default function PhotoCreationFormAdminPage() {
  const { loading, error, fetch } = useQuery<DefaultApiMessage>({
    url: "/api/admin/photos/upload",
    method: "POST",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelect = (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setStatus({
        type: StatusCode.ERROR,
        message: "Por favor, selecione apenas arquivos de imagem.",
      });
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setStatus(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);

    await fetch({
      body: formData,
    });

    if (error.get) {
      setStatus({
        type: StatusCode.ERROR,
        message: "Erro ao enviar a foto. Tente novamente.",
      });
    } else {
      setFile(null);
      setPreview(null);
      setDescription("");
      setStatus({
        type: StatusCode.SUCCESS,
        message: "Foto enviada com sucesso!",
      });
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-white/5">
        <h2 className="text-xl font-medium text-white/90">
          Upload de Nova Foto
        </h2>
        <p className="text-sm text-white/50 mt-1">
          Adicione novas imagens à galeria.
        </p>
      </div>

      <form onSubmit={handleUpload} className="p-8 space-y-8">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/70">
            Imagem
          </label>

          {!preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-white/30 hover:bg-white/5 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-white/50 group-hover:text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-white/80">
                Clique para selecionar
              </p>
              <p className="text-xs text-white/40 mt-1">JPG, PNG ou WebP</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-white/10 group">
              <img
                src={preview}
                alt="Preview"
                className="w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <span className="text-xs font-mono text-white/80 truncate max-w-[80%]">
                  {file?.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white p-2 rounded-lg transition-colors border border-red-500/30"
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
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/70">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escreva algo sobre esta foto..."
            className="w-full p-4 bg-black/20 border border-white/10 rounded-xl h-32 text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all resize-none"
          />
        </div>

        {status && (
          <div
            className={`p-4 rounded-lg text-sm font-medium flex items-center gap-3 ${
              status.type === StatusCode.SUCCESS
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
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

        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={loading || !file}
            className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" variant="inline" />
                <span>Enviando...</span>
              </>
            ) : (
              "Publicar Foto"
            )} 
          </button>
        </div>
      </form>
    </div>
  );
}
