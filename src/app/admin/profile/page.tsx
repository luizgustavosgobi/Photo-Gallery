'use client';

import { useEffect, useState, useRef } from 'react';

export default function ProfileAdminPage() {
  const [description, setDescription] = useState('');
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        setDescription(data.description || '');
        setCurrentPhotoUrl(data.photoUrl || null);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      let photoKey: string | undefined = undefined;

      if (selectedFile) {
        const form = new FormData();
        form.append('file', selectedFile);

        const upRes = await fetch('/api/admin/profile/upload', {
          method: 'POST',
          body: form
        });

        if (!upRes.ok) throw new Error();
        const upJson = await upRes.json();
        if (!upJson.key) throw new Error();
        photoKey = upJson.key;
      }

      const patchRes = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, photo: photoKey })
      });

      if (!patchRes.ok) throw new Error();

      const updated = await patchRes.json();
      const proxy = updated.photoProxy ?? null;
      setCurrentPhotoUrl(proxy || currentPhotoUrl);

      try {
        const detail = { photoUrl: proxy, description: updated.description };
        const ev = new CustomEvent('profile:update', { detail });
        window.dispatchEvent(ev);
        try {
          if (typeof BroadcastChannel !== 'undefined') {
            const bc = new BroadcastChannel('profile');
            bc.postMessage(detail);
            bc.close();
          }
        } catch (bcErr) {}
      } catch (e) {}

      setStatus({ type: 'success', message: 'Perfil atualizado com sucesso!' });
      setSelectedFile(null);
    } catch (err) {
      setStatus({ type: 'error', message: 'Erro ao atualizar perfil. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const displayImage = previewUrl || currentPhotoUrl;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">
        Editar Perfil
      </h1>
      
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-xl font-medium text-white/90">
            Informações Públicas
          </h2>
          <p className="text-sm text-white/50 mt-1">
            Isso será exibido publicamente no seu site.
          </p>
        </div>

        <form onSubmit={handleUpdateProfile} className="p-8 space-y-8">
          
          {/* Seção da Foto Centralizada e Maior */}
          <div className="flex flex-col items-center space-y-4">
            <label className="block text-sm font-medium text-white/70">
              Foto de Perfil
            </label>
            
            <div className="relative group">
              <div 
                onClick={() => fileInputRef.current?.click()}
                // Mudança aqui: w-48 h-48 (era w-32 h-32)
                className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/5 cursor-pointer hover:border-purple-500/50 transition-all duration-300 relative bg-[#0f0f0f]"
              >
                {displayImage ? (
                  <img 
                    src={displayImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                </div>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/70">
              Descrição / Bio
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-black/20 border border-white/10 rounded-xl h-32 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
              placeholder="Conte um pouco sobre você..."
            />
            <p className="text-xs text-white/30 text-right">
              {description.length} caracteres
            </p>
          </div>

          {status && (
            <div className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${
              status.type === 'success' 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {status.type === 'success' ? (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                 </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              )}
              {status.message}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-purple-900/20 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                'Salvar Alterações'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}