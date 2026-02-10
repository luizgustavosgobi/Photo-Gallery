
export default async function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold mb-2">Fotos</h3>
          <p className="text-gray-400">Gerencie suas fotos enviadas</p>
        </div>
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold mb-2">Álbuns</h3>
          <p className="text-gray-400">Organize suas coleções</p>
        </div>
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold mb-2">Perfil</h3>
          <p className="text-gray-400">Edite suas informações</p>
        </div>
      </div>
    </div>
  );
}
